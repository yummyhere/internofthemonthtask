from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from decimal import Decimal

from .models import Category, Product, WishlistItem
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    WishlistSerializer, CartValidationInputSerializer
)
from apps.core.pagination import StandardResultsSetPagination

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True).prefetch_related('products')
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_cats = self.queryset.filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_cats, many=True)
        return Response(serializer.data)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        qs = self.queryset

        # Search parameter
        q = self.request.query_params.get('search', '').strip()
        if q:
            qs = qs.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q) |
                Q(origin__icontains=q) |
                Q(category__name__icontains=q)
            )

        # Category filter
        cat = self.request.query_params.get('category', '').strip()
        if cat:
            if cat.isdigit():
                qs = qs.filter(category_id=int(cat))
            else:
                qs = qs.filter(category__slug=cat)

        # Min / Max price
        min_p = self.request.query_params.get('min_price')
        if min_p:
            try:
                qs = qs.filter(regular_price__gte=Decimal(min_p))
            except Exception:
                pass

        max_p = self.request.query_params.get('max_price')
        if max_p:
            try:
                qs = qs.filter(regular_price__lte=Decimal(max_p))
            except Exception:
                pass

        # Organic filter
        is_org = self.request.query_params.get('is_organic')
        if is_org is not None:
            if is_org.lower() in ['true', '1']:
                qs = qs.filter(is_organic=True)
            elif is_org.lower() in ['false', '0']:
                qs = qs.filter(is_organic=False)

        # In stock filter
        in_stock = self.request.query_params.get('in_stock')
        if in_stock is not None and in_stock.lower() in ['true', '1']:
            qs = qs.filter(stock_quantity__gt=0)

        # Featured filter
        featured = self.request.query_params.get('featured')
        if featured is not None and featured.lower() in ['true', '1']:
            qs = qs.filter(is_featured=True)

        # Discounted deals filter
        on_sale = self.request.query_params.get('on_sale')
        if on_sale is not None and on_sale.lower() in ['true', '1']:
            qs = qs.filter(discounted_price__isnull=False, discounted_price__gt=0)

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        if ordering == 'price_asc':
            qs = qs.order_by('regular_price')
        elif ordering == 'price_desc':
            qs = qs.order_by('-regular_price')
        elif ordering == 'name_asc':
            qs = qs.order_by('name')
        elif ordering == 'rating':
            qs = qs.order_by('-rating')
        elif ordering == 'newest':
            qs = qs.order_by('-created_at')
        else:
            qs = qs.order_by(ordering)

        return qs

    @action(detail=False, methods=['get'])
    def deals(self, request):
        deals_qs = self.queryset.filter(discounted_price__isnull=False, discounted_price__gt=0)[:8]
        serializer = ProductListSerializer(deals_qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_qs = self.queryset.filter(is_featured=True)[:8]
        serializer = ProductListSerializer(featured_qs, many=True)
        return Response(serializer.data)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related('product', 'product__category')

    @action(detail=False, methods=['delete'], url_path='remove-by-product/(?P<product_id>[0-9]+)')
    def remove_by_product(self, request, product_id=None):
        deleted_count, _ = WishlistItem.objects.filter(
            user=request.user,
            product_id=product_id
        ).delete()
        if deleted_count > 0:
            return Response({"message": "Product removed from wishlist."}, status=status.HTTP_200_OK)
        return Response({"detail": "Item not found in wishlist."}, status=status.HTTP_404_NOT_FOUND)

class CartValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CartValidationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        items_data = serializer.validated_data['items']

        product_ids = [item['product_id'] for item in items_data]
        products_by_id = {
            p.id: p for p in Product.objects.filter(id__in=product_ids, is_active=True).select_related('category')
        }

        validated_items = []
        subtotal = Decimal('0.00')
        has_stock_issues = False

        for item in items_data:
            pid = item['product_id']
            qty = item['quantity']
            product = products_by_id.get(pid)

            if not product:
                has_stock_issues = True
                validated_items.append({
                    'product_id': pid,
                    'is_available': False,
                    'error': 'Product is currently unavailable or inactive.',
                    'quantity': qty,
                    'adjusted_quantity': 0,
                    'unit_price': '0.00',
                    'line_total': '0.00'
                })
                continue

            available_stock = product.stock_quantity
            adjusted_qty = qty
            stock_warning = None

            if available_stock <= 0:
                adjusted_qty = 0
                stock_warning = 'Item is currently out of stock.'
                has_stock_issues = True
            elif qty > available_stock:
                adjusted_qty = available_stock
                stock_warning = f'Requested {qty}, but only {available_stock} available.'
                has_stock_issues = True

            current_price = product.current_price
            line_total = current_price * adjusted_qty
            subtotal += line_total

            validated_items.append({
                'product_id': product.id,
                'name': product.name,
                'slug': product.slug,
                'unit': product.unit,
                'image_url': product.image_url,
                'is_available': True,
                'stock_quantity': available_stock,
                'requested_quantity': qty,
                'quantity': adjusted_qty,
                'unit_price': str(current_price),
                'regular_price': str(product.regular_price),
                'discounted_price': str(product.discounted_price) if product.discounted_price else None,
                'line_total': str(line_total),
                'stock_warning': stock_warning,
            })

        # Free delivery over Rs. 2,000, otherwise Rs. 150
        free_delivery_threshold = Decimal('2000.00')
        standard_delivery_fee = Decimal('150.00')

        if subtotal >= free_delivery_threshold or subtotal == Decimal('0.00'):
            delivery_fee = Decimal('0.00')
            free_delivery_gap = Decimal('0.00')
        else:
            delivery_fee = standard_delivery_fee
            free_delivery_gap = free_delivery_threshold - subtotal

        total = subtotal + delivery_fee

        return Response({
            'is_valid': not has_stock_issues,
            'items': validated_items,
            'subtotal': str(subtotal),
            'delivery_fee': str(delivery_fee),
            'free_delivery_threshold': str(free_delivery_threshold),
            'free_delivery_gap': str(free_delivery_gap),
            'total': str(total),
            'currency': 'Rs.',
            'items_count': sum(i['quantity'] for i in validated_items if i.get('is_available'))
        })
