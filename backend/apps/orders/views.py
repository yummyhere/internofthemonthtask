from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Order, OrderItem
from .serializers import OrderCreateSerializer, OrderDetailSerializer
from apps.core.pagination import StandardResultsSetPagination

class OrderViewSet(viewsets.ModelViewSet):
    lookup_field = 'order_number'
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ['create', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        if user.is_staff:
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(customer=user).prefetch_related('items')

    def retrieve(self, request, *args, **kwargs):
        lookup_val = kwargs.get('order_number')
        order = Order.objects.filter(
            Q(order_number=lookup_val) | Q(id__iexact=lookup_val if lookup_val.isdigit() else 0)
        ).prefetch_related('items').first()

        if not order:
            raise NotFound(detail="Order not found.")

        # Permission check:
        # 1. Staff can view any order
        # 2. Authenticated owner can view their own order
        # 3. Guest order can be viewed if guest provides matching email or phone in query params or headers
        if request.user.is_authenticated:
            if not request.user.is_staff and order.customer and order.customer != request.user:
                raise PermissionDenied(detail="You do not have permission to view this order.")
        else:
            verify_email = request.query_params.get('email', '').strip().lower()
            verify_phone = request.query_params.get('phone', '').strip()
            if not (verify_email and verify_email == order.email.lower()) and not (verify_phone and verify_phone == order.phone):
                # If guest just created the order, frontend passes email or phone in query
                if order.customer is not None:
                    raise PermissionDenied(detail="Please log in to view this customer order.")

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderDetailSerializer(order).data, status=status.HTTP_201_CREATED)

class GuestOrderLookupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_number = request.data.get('order_number', '').strip()
        identifier = request.data.get('identifier', '').strip()  # email or phone

        if not order_number or not identifier:
            raise ValidationError("Both order_number and email/phone are required.")

        order = Order.objects.filter(order_number__iexact=order_number).prefetch_related('items').first()
        if not order:
            return Response({"detail": "No matching order found."}, status=status.HTTP_404_NOT_FOUND)

        matches = (order.email.lower() == identifier.lower()) or (order.phone == identifier)
        if not matches:
            return Response({"detail": "Verification failed. Identifier does not match order records."}, status=status.HTTP_403_FORBIDDEN)

        return Response(OrderDetailSerializer(order).data)

class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)

        # Check ownership or staff
        if not request.user.is_staff and order.customer != request.user:
            raise PermissionDenied("You can only cancel your own orders.")

        if order.fulfillment_status in ['shipped', 'delivered']:
            return Response(
                {"detail": f"Order cannot be cancelled as it is already {order.fulfillment_status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.fulfillment_status == 'cancelled':
            return Response(
                {"detail": "Order is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Restore inventory safely once
            if not order.stock_restored:
                for item in order.items.select_related('product'):
                    if item.product:
                        item.product.stock_quantity += item.quantity
                        item.product.save(update_fields=['stock_quantity'])
                order.stock_restored = True

            order.fulfillment_status = 'cancelled'
            order.save(update_fields=['fulfillment_status', 'stock_restored', 'updated_at'])

        return Response({
            "message": f"Order #{order.order_number} has been cancelled successfully. Stock has been restored.",
            "order": OrderDetailSerializer(order).data
        })
