import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    freeDeliveryGap,
    isFreeDeliveryEligible,
    total,
    validateCartWithServer,
    isValidating,
  } = useCart();

  const navigate = useNavigate();
  const [reconciling, setReconciling] = useState(false);

  const handleValidatePrices = async () => {
    setReconciling(true);
    await validateCartWithServer();
    setReconciling(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 font-display">
          Your Organic Basket is Empty
        </h1>
        <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any certified organic groceries to your basket yet. Discover farm-fresh produce harvested this morning!
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-sm shadow-md transition-colors"
          >
            <span>Start Shopping Fresh Harvest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-extrabold text-[#203a27] font-display">
            Shopping Cart
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review your harvest basket before proceeding to safe delivery checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleValidatePrices}
            disabled={isValidating || reconciling}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating || reconciling ? 'animate-spin text-[#62ab00]' : ''}`} />
            <span>Verify Live Stock</span>
          </button>

          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-2 transition-colors"
          >
            Empty Basket
          </button>
        </div>
      </div>

      {/* Free Delivery Meter */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-medium">
            {isFreeDeliveryEligible ? (
              <>
                <Sparkles className="w-4 h-4 text-[#62ab00]" />
                <span className="font-bold">You've unlocked Free Standard Delivery!</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 text-[#62ab00]" />
                <span>
                  Add <strong className="font-bold text-[#203a27]">Rs. {freeDeliveryGap.toLocaleString()}</strong> more to claim <strong className="text-[#62ab00]">Free Delivery</strong>.
                </span>
              </>
            )}
          </div>
          <span className="font-bold text-emerald-800">{progressPct}% of Rs. {freeDeliveryThreshold.toLocaleString()}</span>
        </div>
        <div className="w-full h-2 bg-emerald-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#62ab00] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-stone-100 text-xs font-bold text-stone-400 uppercase tracking-wider">
            <div className="col-span-6">Produce</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Line Total</div>
          </div>

          <div className="divide-y divide-stone-100">
            {cart.map((item) => {
              const itemPrice = parseFloat(item.product.current_price || item.product.regular_price);
              const itemTotal = itemPrice * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="p-5 sm:px-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                >
                  {/* Produce Thumbnail & Name */}
                  <div className="sm:col-span-6 flex items-center gap-3.5">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-bold text-sm text-stone-900 hover:text-[#62ab00] transition-colors truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Packaging: {item.product.unit}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium">
                        {item.product.origin.split(',')[0]}
                      </p>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="sm:col-span-2 sm:text-center text-xs font-semibold text-stone-700 font-sans">
                    <span className="sm:hidden text-stone-400 mr-1">Price:</span>
                    Rs. {item.product.current_price}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="sm:col-span-2 flex items-center sm:justify-center">
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-90 transition-all duration-150"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-90 transition-all duration-150"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm font-bold text-[#203a27] font-sans">
                      Rs. {itemTotal.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 active:scale-90 transition-all duration-150"
                      title="Remove product"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
          <h2 className="text-lg font-bold text-stone-900 font-display border-b border-stone-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
              <span className="font-bold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-[#62ab00] font-bold">FREE DELIVERY</span>
                ) : (
                  <span className="font-bold text-stone-900">Rs. {deliveryFee.toLocaleString()}</span>
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-[#203a27] pt-4 border-t border-stone-200 font-sans">
              <span>Grand Total</span>
              <span className="text-xl text-[#62ab00]">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-[11px] text-stone-500 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#62ab00]" />
              Safe Organic Checkout Guarantee
            </p>
            <p>Every product is verified against real-time farm inventory before order dispatch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
