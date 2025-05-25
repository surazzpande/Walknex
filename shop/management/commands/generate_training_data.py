import json
from django.core.management.base import BaseCommand
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from django.conf import settings

class Command(BaseCommand):
    help = 'Generate training data for the chatbot'

    def handle(self, *args, **options):
        # Initialize OpenAI
        llm = ChatOpenAI(
            model_name="gpt-4",
            temperature=0.7,
            api_key=settings.OPENAI_API_KEY
        )
        
        # Create prompt templates for products and conversations
        product_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a shoe expert tasked with generating detailed product information. Generate product information in JSON format with the following fields: name, description, price, category, image, features (array), suitableFor (array), and footType (array). Use British English and set realistic prices in GBP."),
            ("user", "Generate a detailed product entry for category: {category}")
        ])
        
        conversation_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a knowledgeable and friendly shoe store assistant. Generate a conversation example in JSON format with:
            - user_query: The customer's message or question
            - assistant_response: Your helpful, friendly response
            - context: Array of relevant topics (e.g., ["greeting", "general", "support"])
            - intent: The main purpose of the message (e.g., "greeting", "farewell", "general_query")
            Use British English and maintain a warm, welcoming tone."""),
            ("user", "Generate a conversation example for scenario: {scenario}")
        ])
        
        # Product categories
        categories = [
            "running shoes",
            "casual sneakers",
            "training shoes",
            "hiking boots",
            "walking shoes"
        ]
        
        # General conversation scenarios
        scenarios = [
            # Greetings and farewells
            "greeting hello",
            "greeting hi",
            "greeting good morning",
            "greeting good afternoon",
            "greeting good evening",
            "farewell goodbye",
            "farewell bye",
            "farewell thank you",
            
            # General queries
            "how are you",
            "what can you help me with",
            "what do you sell",
            "tell me about your store",
            "are you a real person",
            "what's your name",
            
            # Basic support
            "need help",
            "can you assist me",
            "have a question",
            "contact support",
            
            # Product queries
            "shoe size guidance",
            "running shoe recommendations",
            "shoe care and maintenance",
            "comparing different shoes",
            "foot condition advice",
            "shoe pricing information",
            "return policy",
            "shoe materials",
            "style recommendations",
            "gift suggestions"
        ]
        
        training_data = {
            "products": [],
            "conversations": []
        }
        
        # Generate product data
        for category in categories:
            self.stdout.write(f'Generating product data for {category}...')
            
            try:
                chain = product_prompt | llm
                result = chain.invoke({"category": category})
                
                product_data = json.loads(result.content)
                training_data["products"].append(product_data)
                
                self.stdout.write(
                    self.style.SUCCESS(f'Generated product data for {product_data["name"]}')
                )
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error generating product data for {category}: {e}')
                )
        
        # Generate conversation data
        for scenario in scenarios:
            self.stdout.write(f'Generating conversation data for {scenario}...')
            
            try:
                chain = conversation_prompt | llm
                result = chain.invoke({"scenario": scenario})
                
                conversation_data = json.loads(result.content)
                training_data["conversations"].append(conversation_data)
                
                self.stdout.write(
                    self.style.SUCCESS(f'Generated conversation data for {scenario}')
                )
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error generating conversation data for {scenario}: {e}')
                )
        
        # Add predefined general responses
        general_responses = [
            {
                "user_query": "hi",
                "assistant_response": "Hello! Welcome to Walknex. How can I help you find your perfect pair of shoes today?",
                "context": ["greeting", "welcome"],
                "intent": "greeting"
            },
            {
                "user_query": "hello",
                "assistant_response": "Hi there! I'm your Walknex shopping assistant. What kind of shoes are you looking for today?",
                "context": ["greeting", "welcome"],
                "intent": "greeting"
            },
            {
                "user_query": "good morning",
                "assistant_response": "Good morning! Welcome to Walknex. I'm here to help you find the perfect footwear. What can I assist you with?",
                "context": ["greeting", "welcome", "morning"],
                "intent": "greeting"
            },
            {
                "user_query": "bye",
                "assistant_response": "Thank you for chatting with me! Have a great day, and don't hesitate to come back if you need any help with your footwear needs.",
                "context": ["farewell", "closing"],
                "intent": "farewell"
            },
            {
                "user_query": "thanks",
                "assistant_response": "You're welcome! If you need any further assistance, don't hesitate to ask. Happy shopping!",
                "context": ["gratitude", "closing"],
                "intent": "farewell"
            }
        ]
        
        training_data["conversations"].extend(general_responses)
        
        # Save generated data
        try:
            with open('training_data.json', 'w') as f:
                json.dump(training_data, f, indent=2)
            
            self.stdout.write(
                self.style.SUCCESS('Successfully saved training data')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error saving training data: {e}')
            )