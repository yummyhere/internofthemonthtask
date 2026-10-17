from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    description = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True)
    icon_name = models.CharField(max_length=50, blank=True, default='leaf')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, db_index=True)
    description = models.TextField()
    regular_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(Decimal('0.00'))])
    unit = models.CharField(max_length=50, default='1 kg', help_text='e.g., 1 kg, 500 g, Dozen, 1 Litre')
    stock_quantity = models.PositiveIntegerField(default=50)
    is_organic = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    image_url = models.CharField(max_length=500)
    origin = models.CharField(max_length=150, default='Certified Organic Farm', blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=Decimal('4.90'))
    reviews_count = models.PositiveIntegerField(default=24)
    nutritional_highlights = models.TextField(blank=True, default='Rich in dietary fibre, natural vitamins, and zero synthetic pesticides.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['is_featured', 'is_active']),
            models.Index(fields=['regular_price']),
        ]

    def clean(self):
        if self.discounted_price is not None and self.discounted_price >= self.regular_price:
            raise ValidationError({'discounted_price': 'Discounted price must be strictly lower than regular price.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        if self.discounted_price is not None and self.discounted_price > Decimal('0.00'):
            return self.discounted_price
        return self.regular_price

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0

    @property
    def discount_percentage(self):
        if self.discounted_price is not None and self.discounted_price < self.regular_price:
            pct = int(((self.regular_price - self.discounted_price) / self.regular_price) * 100)
            return pct
        return 0

    def __str__(self):
        return f"{self.name} ({self.unit})"

class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
