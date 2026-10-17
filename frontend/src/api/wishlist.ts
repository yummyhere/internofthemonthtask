import { apiClient } from './client';
import { Product } from '../types';

export interface WishlistRecord {
  id: number;
  product: Product;
  created_at: string;
}

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistRecord[]> => {
    const { data } = await apiClient.get<WishlistRecord[]>('/wishlist/');
    return data;
  },

  addToWishlist: async (productId: number): Promise<WishlistRecord> => {
    const { data } = await apiClient.post<WishlistRecord>('/wishlist/', { product_id: productId });
    return data;
  },

  removeFromWishlist: async (productId: number): Promise<void> => {
    await apiClient.delete(`/wishlist/remove-by-product/${productId}/`);
  },
};
