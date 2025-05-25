from django.core.management.base import BaseCommand
from shop.models import Product
from shop.utils.ai import ChatbotAI
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Index all products in Weaviate for chatbot recommendations'

    def handle(self, *args, **options):
        try:
            chatbot = ChatbotAI()
            
            # Create schema if it doesn't exist
            self.stdout.write('Creating Weaviate schema...')
            if chatbot.create_product_schema():
                self.stdout.write(self.style.SUCCESS('Schema created successfully'))
            else:
                self.stdout.write(self.style.ERROR('Failed to create schema'))
                return
            
            # Get all products
            products = Product.objects.all()
            total = products.count()
            
            self.stdout.write(f'Indexing {total} products...')
            
            success = 0
            for product in products:
                # Prepare product data
                product_data = {
                    'name': product.name,
                    'description': product.description,
                    'price': float(product.price),
                    'category': product.category.name,
                    'image': product.image,
                    'features': [
                        'Responsive cushioning',
                        'Breathable mesh upper',
                        'Durable rubber outsole'
                    ],
                    'suitableFor': [
                        'Daily wear',
                        'Running',
                        'Training'
                    ],
                    'footType': [
                        'Neutral',
                        'Medium arch',
                        'Normal pronation'
                    ]
                }
                
                # Index product
                if chatbot.index_product(product_data):
                    success += 1
                    self.stdout.write(f'Indexed product: {product.name}')
                else:
                    self.stdout.write(self.style.ERROR(f'Failed to index product: {product.name}'))
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully indexed {success} out of {total} products')
            )
            
        except Exception as e:
            logger.error(f"Error in index_products command: {e}")
            self.stdout.write(
                self.style.ERROR(f'Failed to index products: {str(e)}')
            )