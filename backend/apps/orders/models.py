from django.db import models
from django.contrib.auth.models import User
from apps.catalog.models import Product
from decimal import Decimal
import uuid

class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash_on_delivery', 'Cash on Delivery (COD)'),
        ('card_simulation', 'Card Payment (Online Demo Gateway)'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('paid', 'Paid'),
        ('failed', 'Payment Failed'),
        ('refunded', 'Refunded'),
    ]

    FULFILLMENT_STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('processing', 'Processing Harvest'),
        ('shipped', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    shipping_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default='Lahore')
    postal_code = models.CharField(max_length=20, blank=True)
    delivery_instructions = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    final_total = models.DecimalField(max_digits=12, decimal_places=2)

    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHOD_CHOICES, default='cash_on_delivery')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    fulfillment_status = models.CharField(max_length=20, choices=FULFILLMENT_STATUS_CHOICES, default='pending')

    idempotency_key = models.CharField(max_length=120, unique=True, null=True, blank=True, db_index=True)
    stock_restored = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['email']),
            models.Index(fields=['customer', '-created_at']),
        ]

    def __str__(self):
        return f"Order #{self.order_number} ({self.customer_name} - Rs. {self.final_total})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_name_snapshot = models.CharField(max_length=200)
    unit_snapshot = models.CharField(max_length=50, default='1 kg')
    unit_price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.quantity}x {self.product_name_snapshot} (Rs. {self.line_total})"
