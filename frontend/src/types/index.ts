export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  icon_name: string;
  is_featured: boolean;
  is_active: boolean;
  products_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  category_slug: string;
  regular_price: string;
  discounted_price: string | null;
  current_price: string;
  discount_percentage: number;
  unit: string;
  stock_quantity: number;
  is_in_stock: boolean;
  is_organic: boolean;
  is_featured: boolean;
  is_active: boolean;
  image_url: string;
  origin: string;
  rating: string;
  reviews_count: number;
  description?: string;
  nutritional_highlights?: string;
  created_at?: string;
  related_products?: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartValidationItem {
  product_id: number;
  name?: string;
  slug?: string;
  unit?: string;
  image_url?: string;
  is_available: boolean;
  stock_quantity?: number;
  requested_quantity: number;
  quantity: number;
  unit_price: string;
  regular_price?: string;
  discounted_price?: string | null;
  line_total: string;
  stock_warning?: string | null;
  error?: string;
}

export interface CartValidationResponse {
  is_valid: boolean;
  items: CartValidationItem[];
  subtotal: string;
  delivery_fee: string;
  free_delivery_threshold: string;
  free_delivery_gap: string;
  total: string;
  currency: string;
  items_count: number;
}

export interface CustomerProfile {
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  delivery_notes: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  profile?: CustomerProfile;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface OrderItem {
  id: number;
  product: number | null;
  product_name_snapshot: string;
  unit_snapshot: string;
  unit_price_at_purchase: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  delivery_instructions: string;
  subtotal: string;
  delivery_fee: string;
  discount_amount: string;
  final_total: string;
  payment_method: 'cash_on_delivery' | 'card_simulation';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
  items_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
