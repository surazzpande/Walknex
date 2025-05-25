import os
import threading
from typing import List, Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import weaviate
from django.conf import settings
import logging
import time
import urllib.parse

logger = logging.getLogger(__name__)

PRODUCT_CLASS = "Product"
CONVERSATION_CLASS = "Conversation"

WELCOME_MESSAGE = {
    "text": (
        "👋 Welcome to Walknex! I'm your AI shopping assistant.\n\n"
        "I can help you:\n"
        "• Find the perfect shoes for your needs\n"
        "• Get personalized recommendations\n"
        "• Track your order or answer FAQs\n\n"
        "How can I assist you today?"
    ),
    "sender": "bot",
    "timestamp": "",
}

class AIException(Exception):
    """Custom exception for AI-related errors."""
    pass

class ChatbotAI:
    """
    Backend AI logic for Walknex chatbot.
    Designed for seamless integration with a Material UI/UX frontend.
    """
    _schema_checked = False
    _schema_lock = threading.Lock()
    _cache: Dict[str, Any] = {}
    _cache_lock = threading.Lock()

    def __init__(self) -> None:
        """Initializes the ChatbotAI with OpenAI and Weaviate clients."""
        self._validate_env()
        self.llm = ChatOpenAI(
            model_name="gpt-4",
            temperature=0.7,
            api_key=os.environ.get("OPENAI_API_KEY", settings.OPENAI_API_KEY)
        )
        self.output_parser = StrOutputParser()
        self.weaviate_client = self._init_weaviate_client()
        self.conversation_prompt = self._build_prompt()
        self._ensure_schema()
        # Debug log for env vars
        logger.info(f"OPENAI_API_KEY loaded: {bool(os.environ.get('OPENAI_API_KEY', settings.OPENAI_API_KEY))}")
        logger.info(f"WEAVIATE_URL loaded: {os.environ.get('WEAVIATE_URL', settings.WEAVIATE_URL)}")
        logger.info(f"WEAVIATE_API_KEY loaded: {bool(os.environ.get('WEAVIATE_API_KEY', settings.WEAVIATE_API_KEY))}")

    def _validate_env(self) -> None:
        """Validates required environment variables."""
        required = [
            ("OPENAI_API_KEY", os.environ.get("OPENAI_API_KEY", getattr(settings, "OPENAI_API_KEY", None))),
            ("WEAVIATE_URL", os.environ.get("WEAVIATE_URL", getattr(settings, "WEAVIATE_URL", None))),
            ("WEAVIATE_API_KEY", os.environ.get("WEAVIATE_API_KEY", getattr(settings, "WEAVIATE_API_KEY", None))),
        ]
        for name, value in required:
            if not value:
                logger.critical(f"Missing environment variable: {name}")
                raise AIException(f"{name} is not set")

    def _init_weaviate_client(self) -> weaviate.Client:
        """Initializes the Weaviate client (v3 style for compatibility)."""
        try:
            client = weaviate.Client(
                url=os.environ.get("WEAVIATE_URL", settings.WEAVIATE_URL),
                auth_client_secret=weaviate.AuthApiKey(
                    api_key=os.environ.get("WEAVIATE_API_KEY", settings.WEAVIATE_API_KEY)
                )
            )
            logger.info("Connected to Weaviate")
            return client
        except Exception as e:
            logger.critical(f"Failed to connect to Weaviate: {e}")
            raise AIException("Weaviate connection failed") from e

    def _build_prompt(self) -> ChatPromptTemplate:
        """Builds the conversation prompt template."""
        return ChatPromptTemplate.from_messages([
            ("system", (
                "You are a knowledgeable and friendly shoe store assistant for Walknex, a UK-based online footwear store. "
                "Your goal is to help customers find the perfect shoes and provide excellent customer service.\n\n"
                "Guidelines:\n"
                "1. Be friendly and professional\n"
                "2. Use British English\n"
                "3. Provide specific product recommendations when appropriate\n"
                "4. Ask clarifying questions when needed\n"
                "5. Consider factors like intended use, foot type, and budget\n"
                "6. Explain benefits and features clearly\n"
                "7. All prices should be in GBP (£)\n\n"
                "You have access to:\n"
                "- Various shoe categories (casual, running, boots, sneakers)\n"
                "- Different foot types and arch support needs\n"
                "- Common foot problems and solutions\n"
                "- Size guides and fitting recommendations\n\n"
                "Previous conversation context: {conversation_history}\n"
            )),
            ("user", "{input}")
        ])

    def _ensure_schema(self) -> None:
        """Ensures that the required schemas exist in Weaviate (thread-safe, runs once)."""
        with self._schema_lock:
            if self._schema_checked:
                return
            try:
                schema = self.weaviate_client.schema.get()
                existing_classes = [c["class"] for c in schema.get("classes", [])]

                if PRODUCT_CLASS not in existing_classes:
                    self.weaviate_client.schema.create_class({
                        "class": PRODUCT_CLASS,
                        "description": "Product information for shoes",
                        "properties": [
                            {"name": "name", "dataType": ["text"], "description": "Name of the product"},
                            {"name": "description", "dataType": ["text"], "description": "Product description"},
                            {"name": "price", "dataType": ["number"], "description": "Product price in GBP"},
                            {"name": "category", "dataType": ["text"], "description": "Product category"},
                            {"name": "image", "dataType": ["text"], "description": "URL of the product image"},
                            {"name": "features", "dataType": ["text[]"], "description": "Key features and benefits"},
                            {"name": "suitableFor", "dataType": ["text[]"], "description": "Activities or use cases"},
                            {"name": "footType", "dataType": ["text[]"], "description": "Suitable foot types"},
                        ],
                        "vectorizer": "text2vec-openai"
                    })
                    logger.info("Created product schema")

                if CONVERSATION_CLASS not in existing_classes:
                    self.weaviate_client.schema.create_class({
                        "class": CONVERSATION_CLASS,
                        "description": "Training data for conversation responses",
                        "properties": [
                            {"name": "userQuery", "dataType": ["text"], "description": "User's message or question"},
                            {"name": "assistantResponse", "dataType": ["text"], "description": "Assistant's response"},
                            {"name": "context", "dataType": ["text[]"], "description": "Conversation context tags"},
                            {"name": "intent", "dataType": ["text"], "description": "Main intent of the message"},
                        ],
                        "vectorizer": "text2vec-openai"
                    })
                    logger.info("Created conversation schema")

                self._schema_checked = True
            except Exception as e:
                logger.error(f"Error ensuring schema: {e}", exc_info=True)
                raise

    def _cache_get(self, key: str) -> Optional[Any]:
        with self._cache_lock:
            return self._cache.get(key)

    def _cache_set(self, key: str, value: Any, ttl: int = 60) -> None:
        with self._cache_lock:
            self._cache[key] = value
            # Optionally, implement TTL expiration logic

    def index_conversation(self, conversation: Dict[str, Any]) -> bool:
        """
        Indexes a single conversation example in Weaviate.
        Returns True if successful, False otherwise.
        """
        try:
            self.weaviate_client.data_object.create(
                data_object={
                    "userQuery": conversation["user_query"],
                    "assistantResponse": conversation["assistant_response"],
                    "context": conversation.get("context", []),
                    "intent": conversation.get("intent", "")
                },
                class_name=CONVERSATION_CLASS
            )
            logger.info(f"Indexed conversation: {conversation['user_query']}")
            return True
        except Exception as e:
            logger.error(f"Error indexing conversation: {e}", exc_info=True)
            return False

    def index_conversations_batch(self, conversations: List[Dict[str, Any]]) -> int:
        """
        Batch index multiple conversations for speed.
        Returns the number of successfully indexed conversations.
        """
        success = 0
        for conv in conversations:
            if self.index_conversation(conv):
                success += 1
        logger.info(f"Batch indexed {success}/{len(conversations)} conversations.")
        return success

    def get_similar_conversations(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves similar conversation examples from Weaviate based on the query.
        Uses in-memory cache for repeated queries.
        """
        cache_key = f"simconv:{query}:{limit}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached
        try:
            result = (
                self.weaviate_client.query
                .get(CONVERSATION_CLASS, ["userQuery", "assistantResponse", "context", "intent"])
                .with_near_text({"concepts": [query]})
                .with_limit(limit)
                .do()
            )
            conversations = result.get("data", {}).get("Get", {}).get(CONVERSATION_CLASS, [])
            self._cache_set(cache_key, conversations)
            return conversations
        except Exception as e:
            logger.error(f"Error getting similar conversations: {e}", exc_info=True)
            return []

    def get_similar_products(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves similar products from Weaviate based on the query.
        Uses in-memory cache for repeated queries.
        """
        cache_key = f"simprod:{query}:{limit}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached
        try:
            result = (
                self.weaviate_client.query
                .get(PRODUCT_CLASS, [
                    "name", "description", "price", "category", "image",
                    "features", "suitableFor", "footType"
                ])
                .with_near_text({"concepts": [query]})
                .with_limit(limit)
                .do()
            )
            products = result.get("data", {}).get("Get", {}).get(PRODUCT_CLASS, [])
            self._cache_set(cache_key, products)
            return products
        except Exception as e:
            logger.error(f"Error getting similar products: {e}", exc_info=True)
            return []

    def generate_response(
        self,
        message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generates a response to the user's message, including product recommendations if relevant.
        Uses caching for repeated queries.
        Returns a dict ready for Material UI/UX frontend.
        """
        try:
            # Use cache for repeated conversation history
            history_text = ""
            if conversation_history:
                history_text = "\n".join([
                    f"User: {msg['user']}\nAssistant: {msg['assistant']}"
                    for msg in conversation_history[-3:]
                ])
            chain = self.conversation_prompt | self.llm | self.output_parser
            response = chain.invoke({
                "input": message,
                "conversation_history": history_text
            })

            product_keywords = [
                "shoe", "sneaker", "boot", "trainer", "footwear", "size",
                "running", "walking", "casual", "recommend", "looking for"
            ]
            product_related = any(word in message.lower() for word in product_keywords)
            recommendations = self.get_similar_products(message) if product_related else []

            # Structure for Material UI/UX frontend
            return {
                "message": {
                    "text": response,
                    "sender": "bot",
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                },
                "recommendations": recommendations
            }
        except Exception as e:
            logger.error(f"Error generating response: {e}", exc_info=True)
            return {
                "message": {
                    "text": (
                        "I apologize, but I'm having trouble processing your request. "
                        "Please try again or contact our support team for assistance."
                    ),
                    "sender": "bot",
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                },
                "recommendations": []
            }

    def index_product(self, product: Dict[str, Any]) -> bool:
        """
        Indexes a single product in Weaviate, enhancing with default fields if missing.
        Returns True if successful, False otherwise.
        """
        try:
            enhanced_product = {
                **product,
                "features": product.get("features", [
                    "Responsive cushioning",
                    "Breathable mesh upper",
                    "Durable rubber outsole",
                    "Moisture-wicking lining"
                ]),
                "suitableFor": product.get("suitableFor", [
                    "Running",
                    "Walking",
                    "Gym workouts",
                    "Daily wear"
                ]),
                "footType": product.get("footType", [
                    "Neutral",
                    "Medium arch",
                    "Normal pronation"
                ])
            }
            self.weaviate_client.data_object.create(
                data_object=enhanced_product,
                class_name=PRODUCT_CLASS
            )
            logger.info(f"Indexed product: {product.get('name', 'Unknown')}")
            return True
        except Exception as e:
            logger.error(f"Error indexing product: {e}", exc_info=True)
            return False

    def index_products_batch(self, products: List[Dict[str, Any]]) -> int:
        """
        Batch index multiple products for speed.
        Returns the number of successfully indexed products.
        """
        success = 0
        for prod in products:
            if self.index_product(prod):
                success += 1
        logger.info(f"Batch indexed {success}/{len(products)} products.")
        return success