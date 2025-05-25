from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Category, Product, UserProfile, Order, Review, ChatSession, Wishlist
from .serializers import (
    CategorySerializer, ProductSerializer, UserProfileSerializer,
    OrderSerializer, ReviewSerializer, ChatSessionSerializer, WishlistSerializer
)
from .utils.ai import ChatbotAI

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        gender = self.request.query_params.get('gender', None)
        search = self.request.query_params.get('search', None)

        if category:
            queryset = queryset.filter(category__slug=category)
        if gender:
            queryset = queryset.filter(gender=gender)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

class OrderCreate(generics.CreateAPIView):
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, firebase_uid=self.request.user.uid)
        serializer.save(user=user_profile)

class OrderList(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserProfile, firebase_uid=self.request.user.uid)
        return Order.objects.filter(user=user_profile)

class ReviewCreate(generics.CreateAPIView):
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        user_profile = get_object_or_404(UserProfile, firebase_uid=self.request.user.uid)
        product = get_object_or_404(Product, id=self.kwargs['product_id'])
        serializer.save(user=user_profile, product=product)

class ProductReviews(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(product__id=self.kwargs['product_id'])

class ChatbotView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        message = request.data.get('message')
        
        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create chat session
        session, created = ChatSession.objects.get_or_create(session_id=session_id)
        
        try:
            # Initialize chatbot
            chatbot = ChatbotAI()
            
            # Get conversation history
            history = session.conversation_history
            
            # Generate response
            response = chatbot.generate_response(message, history)
            
            # Update conversation history
            history.append({
                'user': message,
                'assistant': response['message']
            })
            session.conversation_history = history
            session.save()
            
            return Response(response)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to process message'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class WishlistView(APIView):
    def get(self, request):
        user_profile = get_object_or_404(UserProfile, firebase_uid=request.user.uid)
        wishlist, created = Wishlist.objects.get_or_create(user=user_profile)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    def post(self, request):
        user_profile = get_object_or_404(UserProfile, firebase_uid=request.user.uid)
        product = get_object_or_404(Product, id=request.data.get('product_id'))
        wishlist, created = Wishlist.objects.get_or_create(user=user_profile)
        wishlist.products.add(product)
        return Response({'status': 'success'})

    def delete(self, request, product_id):
        user_profile = get_object_or_404(UserProfile, firebase_uid=request.user.uid)
        wishlist = get_object_or_404(Wishlist, user=user_profile)
        product = get_object_or_404(Product, id=product_id)
        wishlist.products.remove(product)
        return Response(status=status.HTTP_204_NO_CONTENT)