import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem, CartValidationResponse } from '../types';
import { catalogApi } from '../api/catalog';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  freeDeliveryGap: number;
  isFreeDeliveryEligible: boolean;
  total: number;
  isCartOpen: boolean;
  cartBump: boolean;
  lastAddedProductId: number | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  validateCartWithServer: () => Promise<CartValidationResponse | null>;
  isValidating: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 2000;
const STANDARD_DELIVERY_FEE = 150;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vegist_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartBump, setCartBump] = useState<boolean>(false);
  const [lastAddedProductId, setLastAddedProductId] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('vegist_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart to localStorage', e);
    }
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.is_active || product.stock_quantity <= 0) {
      addToast(`${product.name} is currently out of stock.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, product.stock_quantity);
        if (newQty === currentQty) {
          addToast(`Maximum available stock (${product.stock_quantity}) already in cart.`, 'warning');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock_quantity);
        return [...prev, { product, quantity: initialQty }];
      }
    });

    // Micro-interaction triggers
    setLastAddedProductId(product.id);
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
    setTimeout(() => setLastAddedProductId(null), 1500);

    addToast(`Added ${quantity}x ${product.name} to cart.`, 'success');
    openCart();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock_quantity;
          const cappedQty = Math.min(quantity, maxStock);
          if (quantity > maxStock) {
            addToast(`Only ${maxStock} items available in stock.`, 'warning');
          }
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const itemToRemove = prev.find((item) => item.product.id === productId);
      if (itemToRemove) {
        addToast(`Removed ${itemToRemove.product.name} from cart.`, 'info');
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('vegist_cart');
  };

  const validateCartWithServer = useCallback(async (): Promise<CartValidationResponse | null> => {
    if (cart.length === 0) return null;
    setIsValidating(true);
    try {
      const payload = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));
      const validationResult = await catalogApi.validateCart(payload);

      // Reconcile client cart if server detected stock changes or price adjustments
      setCart((prevCart) => {
        const updatedCart: CartItem[] = [];
        validationResult.items.forEach((vItem) => {
          if (vItem.is_available && vItem.quantity > 0) {
            const existing = prevCart.find((p) => p.product.id === vItem.product_id);
            if (existing) {
              updatedCart.push({
                product: {
                  ...existing.product,
                  current_price: vItem.unit_price,
                  stock_quantity: vItem.stock_quantity ?? existing.product.stock_quantity,
                },
                quantity: vItem.quantity,
              });
            }
          }
        });
        return updatedCart;
      });

      return validationResult;
    } catch (err) {
      console.error('Cart validation error', err);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [cart]);

  // Derived totals
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.product.current_price || item.product.regular_price);
    return acc + price * item.quantity;
  }, 0);

  const isFreeDeliveryEligible = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = subtotal > 0 && !isFreeDeliveryEligible ? STANDARD_DELIVERY_FEE : 0;
  const freeDeliveryGap = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsCount,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        freeDeliveryGap,
        isFreeDeliveryEligible,
        total,
        isCartOpen,
        cartBump,
        lastAddedProductId,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        validateCartWithServer,
        isValidating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
