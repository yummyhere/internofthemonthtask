import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { X, Heart, Plus, Minus, Check, Star, ShieldCheck, Truck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Keyboard accessibility
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto animate-hero-reveal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-all duration-150 active:scale-90"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Column */}
        <div className="md:w-1/2 bg-stone-50 relative aspect-square md:aspect-auto">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.is_organic && (
              <span className="px-2.5 py-1 rounded-md bg-[#62ab00] text-white text-xs font-bold uppercase shadow-sm">
                100% Certified Organic
              </span>
            )}
            {product.discount_percentage > 0 && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white text-xs font-bold uppercase shadow-sm">
                Save {product.discount_percentage}%
              </span>
            )}
          </div>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span className="font-semibold text-stone-500 uppercase tracking-wider">{product.category_name}</span>
              <span className="text-stone-400">{product.origin}</span>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 font-display mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviews_count} reviews)</span>
              </div>
              <span className="text-stone-300">•</span>
              <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-xs">
                {product.unit}
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-extrabold text-[#203a27] font-sans">
                Rs. {product.current_price}
              </span>
              {product.discounted_price && (
                <span className="text-sm text-stone-400 line-through">
                  Rs. {product.regular_price}
                </span>
              )}
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              {product.description || 'Grown according to verified organic farming standards with zero synthetic fertilizers, chemical insecticides, or toxic ripening agents.'}
            </p>

            {product.nutritional_highlights && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 mb-6 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#62ab00] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Nutrition & Harvest:</strong> {product.nutritional_highlights}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Stepper */}
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1 py-3 px-6 rounded-xl bg-[#62ab00] hover:bg-[#518e00] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:bg-stone-200 disabled:text-stone-400 shadow-sm"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <span>Add to Cart • Rs. {(parseFloat(product.current_price) * quantity).toLocaleString()}</span>
                )}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border border-stone-200 transition-colors ${
                  isSaved ? 'bg-rose-50 border-rose-200 text-rose-500' : 'hover:bg-stone-50 text-stone-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Truck className="w-3.5 h-3.5" />
                Free delivery on orders over Rs. 2,000
              </span>
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="text-[#62ab00] hover:underline font-semibold"
              >
                Full Product Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
