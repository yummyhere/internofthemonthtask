import { apiClient } from './client';
import { Order, PaginatedResponse } from '../types';

export interface CreateOrderPayload {
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  city: string;
  postal_code?: string;
  delivery_instructions?: string;
  payment_method: 'cash_on_delivery' | 'card_simulation';
  idempotency_key?: string;
  items: Array<{ product_id: number; quantity: number }>;
}

export const ordersApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await apiClient.post<Order>('/orders/', payload);
    return data;
  },

  getMyOrders: async (page: number = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders/', {
      params: { page },
    });
    return data;
  },

  getOrderDetails: async (orderNumber: string, verification?: { email?: string; phone?: string }): Promise<Order> => {
    const params: Record<string, string> = {};
    if (verification?.email) params.email = verification.email;
    if (verification?.phone) params.phone = verification.phone;

    const { data } = await apiClient.get<Order>(`/orders/${orderNumber}/`, { params });
    return data;
  },

  guestLookup: async (orderNumber: string, identifier: string): Promise<Order> => {
    const { data } = await apiClient.post<Order>('/orders/guest-lookup/', {
      order_number: orderNumber,
      identifier,
    });
    return data;
  },

  cancelOrder: async (orderNumber: string): Promise<{ message: string; order: Order }> => {
    const { data } = await apiClient.post<{ message: string; order: Order }>(`/orders/${orderNumber}/cancel/`);
    return data;
  },
};
