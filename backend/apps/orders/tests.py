from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal

from apps.catalog.models import Category, Product
from apps.orders.models import Order

class OrderProcessingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Dairy", slug="dairy", is_active=True)
        self.product = Product.objects.create(
            category=self.category,
            name="Organic Farm Milk",
            slug="organic-farm-milk",
            description="Pure farm milk",
            regular_price=Decimal("250.00"),
            discounted_price=None,
            unit="1 Litre",
            stock_quantity=10,
            is_active=True
        )

    def test_order_creation_decrements_stock(self):
        payload = {
            "customer_name": "Bilal Siddiqui",
            "email": "bilal@example.com",
            "phone": "+923214567890",
            "shipping_address": "Apartment 4B, Askari 11",
            "city": "Lahore",
            "postal_code": "54000",
            "payment_method": "cash_on_delivery",
            "idempotency_key": "idemp-test-unique-001",
            "items": [
                {"product_id": self.product.id, "quantity": 3}
            ]
        }

        response = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order_number', response.data)

        # Verify stock was decremented from 10 to 7
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 7)

        # Verify order totals: 3 * 250 = 750, delivery = 150, final_total = 900
        order = Order.objects.get(order_number=response.data['order_number'])
        self.assertEqual(order.subtotal, Decimal('750.00'))
        self.assertEqual(order.delivery_fee, Decimal('150.00'))
        self.assertEqual(order.final_total, Decimal('900.00'))
        self.assertEqual(order.payment_status, 'pending')

    def test_insufficient_stock_fails_without_decrementing(self):
        payload = {
            "customer_name": "Hassan",
            "email": "hassan@example.com",
            "phone": "+923331112233",
            "shipping_address": "Street 1",
            "city": "Lahore",
            "items": [
                {"product_id": self.product.id, "quantity": 99}
            ]
        }
        response = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verify stock untouched
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 10)

    def test_duplicate_submission_idempotency(self):
        payload = {
            "customer_name": "Bilal",
            "email": "bilal@example.com",
            "phone": "+923214567890",
            "shipping_address": "Street 1",
            "city": "Lahore",
            "idempotency_key": "idemp-test-duplicate",
            "items": [
                {"product_id": self.product.id, "quantity": 2}
            ]
        }

        # First submit
        res1 = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        # Stock should be 8
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 8)

        # Second submit with same idempotency key
        res2 = self.client.post('/api/v1/orders/', payload, format='json')
        # Should return existing order and NOT decrement stock again!
        self.assertEqual(res1.data['order_number'], res2.data['order_number'])
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 8)

    def test_order_cancellation_restores_stock_once(self):
        user = User.objects.create_user(username="orderuser", email="orderuser@example.com", password="Pass12345!")
        self.client.force_authenticate(user=user)

        # Create order
        payload = {
            "customer_name": "Order User",
            "email": "orderuser@example.com",
            "phone": "+923009988776",
            "shipping_address": "Defense Raya",
            "city": "Lahore",
            "items": [
                {"product_id": self.product.id, "quantity": 4}
            ]
        }
        res = self.client.post('/api/v1/orders/', payload, format='json')
        order_num = res.data['order_number']
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 6)

        # Cancel order
        cancel_res = self.client.post(f'/api/v1/orders/{order_num}/cancel/')
        self.assertEqual(cancel_res.status_code, status.HTTP_200_OK)

        # Stock restored from 6 to 10
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 10)

        # Attempt to cancel again: should reject
        cancel_res_again = self.client.post(f'/api/v1/orders/{order_num}/cancel/')
        self.assertEqual(cancel_res_again.status_code, status.HTTP_400_BAD_REQUEST)
        # Stock should remain 10
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 10)
