from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, GuestOrderLookupView, CancelOrderView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('orders/guest-lookup/', GuestOrderLookupView.as_view(), name='guest-order-lookup'),
    path('orders/<str:order_number>/cancel/', CancelOrderView.as_view(), name='order-cancel'),
    path('', include(router.urls)),
]
