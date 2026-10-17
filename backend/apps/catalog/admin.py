from django.contrib import admin
from .models import Category, Product, WishlistItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_featured', 'is_active', 'created_at')
    list_filter = ('is_featured', 'is_active')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'regular_price', 'discounted_price', 'unit', 'stock_quantity', 'is_organic', 'is_featured', 'is_active')
    list_filter = ('category', 'is_organic', 'is_featured', 'is_active')
    search_fields = ('name', 'description', 'origin')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('regular_price', 'discounted_price', 'stock_quantity', 'is_active', 'is_featured')

@admin.register(WishlistItem)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'product__name')
