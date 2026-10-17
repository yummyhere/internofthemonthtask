from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, WishlistViewSet, CartValidateView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('cart/validate/', CartValidateView.as_view(), name='cart-validate'),
    path('', include(router.urls)),
]
