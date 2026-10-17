import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    freeDeliveryGap,
    isFreeDeliveryEligible,
    freeDeliveryThreshold,
    total,
    itemsCount,
    lastAddedProductId,
  } = useCart();

  const navigate = useNavigate();

  // Animation states for smooth exit transitions
  const [shouldRender, setShouldRender] = useState(isCartOpen);
  const [isExiting, setIsExiting] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  // Keyboard accessibility: Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        handleTriggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  if (!shouldRender) return null;

  const handleTriggerClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      closeCart();
    }, 240);
  };

  const handleItemRemove = (productId: number) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingId(null);
    }, 220);
  };

  const progressPct = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    handleTriggerClose();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    handleTriggerClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with Fade In / Out */}
      <div
        className={`fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-260 ease-out ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleTriggerClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel with Fluid Slide In / Out */}
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 transition-transform duration-280 ${
            isExiting
              ? 'translate-x-full ease-[cubic-bezier(0.3,0,0.8,0.15)]'
              : 'translate-x-0 ease-[cubic-bezier(0.22,1,0.36,1)]'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#62ab00]" />
              <h2 className="font-bold text-lg text-stone-900 font-display">
                Your Fresh Basket
              </h2>
              <span className="text-xs px-2 py-0.5 bg-[#62ab00]/10 text-[#62ab00] font-bold rounded-full">
                {itemsCount}
              </span>
            </div>
            <button
              onClick={handleTriggerClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors active:scale-95"
              aria-label="Close Cart Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-emerald-50/80 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                {isFreeDeliveryEligible && subtotal > 0 ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#62ab00]" />
                    <span>Free Standard Delivery unlocked!</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5 text-[#62ab00]" />
                    <span>
                      Add <strong>Rs. {freeDeliveryGap.toLocaleString()}</strong> for Free Delivery
                    </span>
                  </>
                )}
              </div>
              <span className="font-bold text-emerald-800">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#62ab00] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-base">Your basket is empty</p>
                  <p className="text-xs text-stone-500 mt-1">Explore our organic harvest and fill it with healthy goodness.</p>
                </div>
                <button
                  onClick={() => {
                    handleTriggerClose();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#62ab00] hover:bg-[#518e00] text-white text-xs font-semibold rounded-full shadow-xs transition-all duration-150 active:scale-95"
                >
                  Start Shopping Fresh
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = parseFloat(item.product.current_price || item.product.regular_price);
                const itemTotal = itemPrice * item.quantity;
                const isNewlyAdded = lastAddedProductId === item.product.id;
                const isBeingRemoved = removingId === item.product.id;

                return (
                  <div
                    key={item.product.id}
                    className={`py-4 flex gap-3.5 items-center group transition-all duration-200 ${
                      isNewlyAdded ? 'animate-item-flash rounded-xl p-2 -mx-2' : ''
                    } ${
                      isBeingRemoved ? 'opacity-0 translate-x-6 scale-95 pointer-events-none' : 'opacity-100 translate-x-0'
                    }`}
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100 group-hover:scale-103 transition-transform duration-200"
                    />

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={handleTriggerClose}
                        className="text-sm font-semibold text-stone-900 hover:text-[#62ab00] transition-colors truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-stone-400 mb-2">
                        {item.product.unit} • Rs. {item.product.current_price} each
                      </p>

                      {/* Stepper */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-90 transition-all duration-150"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-stone-800 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-90 transition-all duration-150"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-stone-900 font-sans">
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleItemRemove(item.product.id)}
                      className="text-stone-300 hover:text-rose-500 transition-colors p-1.5 active:scale-90"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      <span className="font-semibold text-stone-900">Rs. {deliveryFee.toLocaleString()}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Due</span>
                  <span className="text-base text-[#203a27] font-sans">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleViewCartClick}
                  className="w-full py-3 px-4 border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl transition-all duration-150 active:scale-98 text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 bg-[#62ab00] hover:bg-[#518e00] text-white text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm active:scale-98 group"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                🔒 Safe & secure checkout • Cash on Delivery or Card
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
