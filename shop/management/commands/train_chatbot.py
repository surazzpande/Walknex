import json
from django.core.management.base import BaseCommand
from shop.utils.ai import ChatbotAI

class Command(BaseCommand):
    help = 'Train and index products for the chatbot'

    def handle(self, *args, **options):
        chatbot = ChatbotAI()
        
        # Create schema if it doesn't exist
        self.stdout.write('Creating Weaviate schema...')
        try:
            if chatbot.create_product_schema():
                self.stdout.write(self.style.SUCCESS('Schema created successfully'))
            else:
                self.stdout.write(self.style.WARNING('Schema already exists, proceeding with indexing'))
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create schema: {str(e)}')
            )
            return

        # Sample training data with enhanced product information
        products = [
            {
                "name": "Air Cloud Runner",
                "description": "Advanced running shoe with responsive cushioning and breathable mesh upper.",
                "price": 129.99,
                "category": "running",
                "image": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
                "features": [
                    "Responsive cushioning technology",
                    "Breathable mesh upper",
                    "Impact-absorbing midsole",
                    "Reflective details for visibility"
                ],
                "suitableFor": [
                    "Long-distance running",
                    "Road running",
                    "Daily training",
                    "Marathon preparation"
                ],
                "footType": [
                    "Neutral pronation",
                    "Medium to high arch",
                    "Normal foot width"
                ]
            },
            {
                "name": "Street Force One",
                "description": "Classic street style sneaker with modern comfort features.",
                "price": 149.99,
                "category": "casual",
                "image": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
                "features": [
                    "Premium leather upper",
                    "Memory foam insole",
                    "Durable rubber outsole",
                    "Padded collar and tongue"
                ],
                "suitableFor": [
                    "Casual wear",
                    "Street style",
                    "Light walking",
                    "Daily use"
                ],
                "footType": [
                    "All foot types",
                    "Wide foot option available",
                    "Flat to medium arch"
                ]
            },
            {
                "name": "Trail Blazer Pro",
                "description": "Rugged hiking boot designed for challenging terrain.",
                "price": 189.99,
                "category": "boots",
                "image": "https://images.pexels.com/photos/267242/pexels-photo-267242.jpeg",
                "features": [
                    "Waterproof leather upper",
                    "Vibram® outsole",
                    "Shock-absorbing midsole",
                    "Reinforced toe cap"
                ],
                "suitableFor": [
                    "Hiking",
                    "Trail walking",
                    "Mountain climbing",
                    "Outdoor activities"
                ],
                "footType": [
                    "Medium to high arch",
                    "Normal to wide width",
                    "Neutral to mild overpronation"
                ]
            }
        ]

        # Index products
        success = 0
        total = len(products)
        
        self.stdout.write(f'Indexing {total} products...')
        
        for product in products:
            if chatbot.index_product(product):
                success += 1
                self.stdout.write(f'Indexed product: {product["name"]}')
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to index product: {product["name"]}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully indexed {success} out of {total} products'
            )
        )