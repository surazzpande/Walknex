from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryList.as_view(), name='category-list'),
    path('products/', views.ProductList.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetail.as_view(), name='product-detail'),
    path('orders/', views.OrderList.as_view(), name='order-list'),
    path('orders/create/', views.OrderCreate.as_view(), name='order-create'),
    path('products/<int:product_id>/reviews/', views.ProductReviews.as_view(), name='product-reviews'),
    path('products/<int:product_id>/reviews/create/', views.ReviewCreate.as_view(), name='review-create'),
    path('chatbot/', views.ChatbotView.as_view(), name='chatbot'),
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', views.WishlistView.as_view(), name='wishlist-item'),
]