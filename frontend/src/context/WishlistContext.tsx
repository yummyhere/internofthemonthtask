import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { wishlistApi, WishlistRecord } from '../api/wishlist';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: number[];
  wishlistProducts: Product[];
  isLoading: boolean;
  wishlistCount: number;
  wishlistBump: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('vegist_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vegist_wishlist_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wishlistBump, setWishlistBump] = useState<boolean>(false);

  // Sync with server if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchServerWishlist = async () => {
        setIsLoading(true);
        try {
          const records: WishlistRecord[] = await wishlistApi.getWishlist();
          const ids = records.map((r) => r.product.id);
          const products = records.map((r) => r.product);
          setWishlistIds(ids);
          setWishlistProducts(products);
        } catch (err) {
          console.error('Failed to load server wishlist', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchServerWishlist();
    } else {
      try {
        localStorage.setItem('vegist_wishlist_ids', JSON.stringify(wishlistIds));
        localStorage.setItem('vegist_wishlist_products', JSON.stringify(wishlistProducts));
      } catch (e) {
        // ignore
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('vegist_wishlist_ids', JSON.stringify(wishlistIds));
        localStorage.setItem('vegist_wishlist_products', JSON.stringify(wishlistProducts));
      } catch (e) {
        // ignore
      }
    }
  }, [wishlistIds, wishlistProducts, isAuthenticated]);

  const triggerWishlistBump = () => {
    setWishlistBump(true);
    setTimeout(() => setWishlistBump(false), 350);
  };

  const isInWishlist = (productId: number) => wishlistIds.includes(productId);

  const toggleWishlist = async (product: Product) => {
    const isCurrentlySaved = isInWishlist(product.id);
    triggerWishlistBump();

    if (isCurrentlySaved) {
      await removeFromWishlist(product.id);
    } else {
      // Add
      setWishlistIds((prev) => [...prev, product.id]);
      setWishlistProducts((prev) => [...prev, product]);
      addToast(`Added ${product.name} to your wishlist.`, 'success');

      if (isAuthenticated) {
        try {
          await wishlistApi.addToWishlist(product.id);
        } catch (e) {
          console.error('Error saving to server wishlist', e);
        }
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    triggerWishlistBump();
    const removedProduct = wishlistProducts.find((p) => p.id === productId);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));

    if (removedProduct) {
      addToast(`Removed ${removedProduct.name} from wishlist.`, 'info');
    }

    if (isAuthenticated) {
      try {
        await wishlistApi.removeFromWishlist(productId);
      } catch (e) {
        console.error('Error deleting from server wishlist', e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        isLoading,
        wishlistCount: wishlistIds.length,
        wishlistBump,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
