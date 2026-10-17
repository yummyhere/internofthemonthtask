import { apiClient } from './client';
import { Category, Product, PaginatedResponse, CartValidationResponse } from '../types';

export interface ProductFilters {
  search?: string;
  category?: string;
  min_price?: number | string;
  max_price?: number | string;
  is_organic?: boolean;
  in_stock?: boolean;
  featured?: boolean;
  on_sale?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const catalogApi = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories/');
    return data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categories/${slug}/`);
    return data;
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories/featured/');
    return data;
  },

  // Products
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params: Record<string, any> = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.is_organic !== undefined) params.is_organic = filters.is_organic;
    if (filters.in_stock !== undefined) params.in_stock = filters.in_stock;
    if (filters.featured !== undefined) params.featured = filters.featured;
    if (filters.on_sale !== undefined) params.on_sale = filters.on_sale;
    if (filters.ordering) params.ordering = filters.ordering;
    if (filters.page) params.page = filters.page;
    if (filters.page_size) params.page_size = filters.page_size;

    const { data } = await apiClient.get<PaginatedResponse<Product>>('/products/', { params });
    return data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${slug}/`);
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/products/featured/');
    return data;
  },

  getSaleDeals: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/products/deals/');
    return data;
  },

  // Cart Validation
  validateCart: async (items: Array<{ product_id: number; quantity: number }>): Promise<CartValidationResponse> => {
    const { data } = await apiClient.post<CartValidationResponse>('/cart/validate/', { items });
    return data;
  },
};
