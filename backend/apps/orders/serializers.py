from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import uuid

from .models import Order, OrderItem
from apps.catalog.models import Product

class OrderItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name_snapshot', 'unit_snapshot', 'unit_price_at_purchase', 'quantity', 'line_total']

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'email', 'phone',
            'shipping_address', 'city', 'postal_code', 'delivery_instructions',
            'subtotal', 'delivery_fee', 'discount_amount', 'final_total',
            'payment_method', 'payment_status', 'fulfillment_status',
            'created_at', 'items', 'items_count'
        ]

    def get_items_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30)
    shipping_address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100, default='Lahore')
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    delivery_instructions = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES, default='cash_on_delivery')
    idempotency_key = serializers.CharField(max_length=120, required=False, allow_blank=True)
    items = OrderItemInputSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        idempotency_key = validated_data.get('idempotency_key')
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        # Check idempotency to prevent duplicate orders
        if idempotency_key:
            existing_order = Order.objects.filter(idempotency_key=idempotency_key).first()
            if existing_order:
                return existing_order

        # Safe transaction with row locking
        with transaction.atomic():
            product_ids = [i['product_id'] for i in items_data]
            # Lock the product rows for update to prevent overselling
            locked_products = {
                p.id: p for p in Product.objects.select_for_update().filter(id__in=product_ids)
            }

            subtotal = Decimal('0.00')
            order_items_to_create = []

            for item_input in items_data:
                pid = item_input['product_id']
                qty = item_input['quantity']
                product = locked_products.get(pid)

                if not product or not product.is_active:
                    raise serializers.ValidationError({
                        "items": f"Product with ID {pid} is no longer available."
                    })

                if product.stock_quantity < qty:
                    raise serializers.ValidationError({
                        "items": f"Insufficient stock for '{product.name}'. Only {product.stock_quantity} available, but {qty} requested."
                    })

                # Decrement stock safely
                product.stock_quantity -= qty
                product.save(update_fields=['stock_quantity'])

                # Verified price snapshot
                unit_price = product.current_price
                line_total = unit_price * qty
                subtotal += line_total

                order_items_to_create.append({
                    'product': product,
                    'product_name_snapshot': product.name,
                    'unit_snapshot': product.unit,
                    'unit_price_at_purchase': unit_price,
                    'quantity': qty,
                    'line_total': line_total,
                })

            # Recalculate delivery fee and total
            free_threshold = Decimal('2000.00')
            delivery_fee = Decimal('0.00') if subtotal >= free_threshold else Decimal('150.00')
            discount_amount = Decimal('0.00')
            final_total = subtotal + delivery_fee - discount_amount

            # Generate unique order number
            date_str = timezone.now().strftime('%Y%m%d')
            rand_suffix = uuid.uuid4().hex[:6].upper()
            order_number = f"VEG-{date_str}-{rand_suffix}"

            order = Order.objects.create(
                order_number=order_number,
                customer=user,
                customer_name=validated_data['customer_name'],
                email=validated_data['email'],
                phone=validated_data['phone'],
                shipping_address=validated_data['shipping_address'],
                city=validated_data.get('city', 'Lahore'),
                postal_code=validated_data.get('postal_code', ''),
                delivery_instructions=validated_data.get('delivery_instructions', ''),
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                discount_amount=discount_amount,
                final_total=final_total,
                payment_method=validated_data.get('payment_method', 'cash_on_delivery'),
                payment_status='paid' if validated_data.get('payment_method') == 'card_simulation' else 'pending',
                fulfillment_status='pending',
                idempotency_key=idempotency_key or None
            )

            for oi_data in order_items_to_create:
                OrderItem.objects.create(
                    order=order,
                    product=oi_data['product'],
                    product_name_snapshot=oi_data['product_name_snapshot'],
                    unit_snapshot=oi_data['unit_snapshot'],
                    unit_price_at_purchase=oi_data['unit_price_at_purchase'],
                    quantity=oi_data['quantity'],
                    line_total=oi_data['line_total'],
                )

            return order
