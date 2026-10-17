import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistCount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 font-display">
          Your Saved Wishlist is Empty
        </h1>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Save your favourite seasonal fruits, vegetables, and pantry items to shop for them easily later.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-xs transition-colors shadow-xs"
        >
          <span>Explore Farm Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-extrabold text-[#203a27] font-display">
            My Saved Wishlist
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for quick ordering
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-[#62ab00] hover:underline"
        >
          Continue Browsing →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-stone-100">
              <Link to={`/product/${product.slug}`} className="block w-full h-full">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-stone-400 hover:text-rose-600 transition-colors shadow-xs"
                title="Remove from wishlist"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  {product.category_name}
                </span>
                <Link
                  to={`/product/${product.slug}`}
                  className="font-bold text-sm text-stone-900 hover:text-[#62ab00] transition-colors truncate block"
                >
                  {product.name}
                </Link>
                <span className="text-xs text-stone-500">{product.unit}</span>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                <span className="text-base font-bold text-[#203a27] font-sans">
                  Rs. {product.current_price}
                </span>
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={!product.is_active || product.stock_quantity <= 0}
                  className="px-3.5 py-1.5 rounded-xl bg-[#62ab00] hover:bg-[#518e00] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:bg-stone-200 disabled:text-stone-400"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
