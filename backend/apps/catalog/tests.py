from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from apps.catalog.models import Category, Product

class CatalogAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Vegetables",
            slug="vegetables",
            description="Organic greens",
            is_active=True,
            is_featured=True
        )
        self.product1 = Product.objects.create(
            category=self.category,
            name="Organic Kale",
            slug="organic-kale",
            description="Fresh green curly kale",
            regular_price=Decimal("180.00"),
            discounted_price=Decimal("150.00"),
            unit="500 g bunch",
            stock_quantity=20,
            is_organic=True,
            is_featured=True,
            is_active=True,
            image_url="https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57"
        )
        self.product2 = Product.objects.create(
            category=self.category,
            name="Organic Red Radish",
            slug="organic-red-radish",
            description="Crunchy garden radish",
            regular_price=Decimal("100.00"),
            discounted_price=None,
            unit="1 kg pack",
            stock_quantity=15,
            is_organic=True,
            is_featured=False,
            is_active=True,
            image_url="https://images.unsplash.com/photo-1590779033100-9f60a05a013d"
        )

    def test_list_categories(self):
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'vegetables')

    def test_list_products_and_filters(self):
        # All products
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

        # Search filter
        search_res = self.client.get('/api/v1/products/?search=kale')
        self.assertEqual(search_res.data['count'], 1)
        self.assertEqual(search_res.data['results'][0]['slug'], 'organic-kale')

        # Deals filter
        deals_res = self.client.get('/api/v1/products/?on_sale=true')
        self.assertEqual(deals_res.data['count'], 1)
        self.assertEqual(deals_res.data['results'][0]['slug'], 'organic-kale')

    def test_cart_validation_endpoint(self):
        payload = {
            "items": [
                {"product_id": self.product1.id, "quantity": 2},
                {"product_id": self.product2.id, "quantity": 1}
            ]
        }
        res = self.client.post('/api/v1/cart/validate/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['is_valid'])
        # 2 * 150 (discounted) + 1 * 100 = 400. Subtotal < 2000, so delivery fee = 150
        self.assertEqual(res.data['subtotal'], '400.00')
        self.assertEqual(res.data['delivery_fee'], '150.00')
        self.assertEqual(res.data['total'], '550.00')
