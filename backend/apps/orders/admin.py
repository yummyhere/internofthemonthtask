from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name_snapshot', 'unit_snapshot', 'unit_price_at_purchase', 'quantity', 'line_total')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'email', 'phone', 'final_total', 'payment_method', 'payment_status', 'fulfillment_status', 'created_at')
    list_filter = ('payment_status', 'fulfillment_status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'customer_name', 'email', 'phone', 'shipping_address')
    readonly_fields = ('order_number', 'subtotal', 'delivery_fee', 'discount_amount', 'final_total', 'created_at', 'updated_at', 'idempotency_key', 'stock_restored')
    inlines = [OrderItemInline]
    list_editable = ('payment_status', 'fulfillment_status')
