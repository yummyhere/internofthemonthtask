import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Plus, Minus, Eye, Check, Star, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 650);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {product.is_organic && (
            <span className="px-2 py-0.5 rounded-md bg-[#62ab00] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              Organic
            </span>
          )}
          {product.discount_percentage > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              -{product.discount_percentage}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons Top-Right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-90 ${
              isSaved
                ? 'bg-rose-50 text-rose-500 shadow-rose-100'
                : 'bg-white/90 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 transition-transform duration-200 ${isSaved ? 'fill-rose-500 text-rose-500 animate-heart-pop' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-600 hover:text-[#62ab00] hover:bg-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-90 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
              title="Quick preview"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3 py-1 bg-white/95 text-stone-900 font-bold text-xs rounded-full shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="font-medium text-stone-500 truncate max-w-[120px]">
              {product.category_name}
            </span>
            <span className="truncate max-w-[110px]" title={product.origin}>
              {product.origin.split(',')[0]}
            </span>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-semibold text-stone-900 hover:text-[#62ab00] transition-colors line-clamp-1 leading-snug mb-1"
          >
            {product.name}
          </Link>

          {/* Unit & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
            <span className="font-normal text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
              {product.unit}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviews_count})</span>
            </div>
          </div>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-[#203a27] font-sans">
              Rs. {product.current_price}
            </span>
            {product.discounted_price && (
              <span className="text-xs text-stone-400 line-through">
                Rs. {product.regular_price}
              </span>
            )}
          </div>

          {/* Stepper + Add Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 bg-stone-100 text-stone-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Out of Stock
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-90 transition-all duration-150"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-semibold text-stone-800 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 active:scale-90 transition-all duration-150"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs active:scale-95 ${
                  isAdding
                    ? 'bg-[#518e00] animate-added-check'
                    : 'bg-[#62ab00] hover:bg-[#518e00]'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-added-check stroke-[2.5]" />
                    <span>Added</span>
                  </>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
