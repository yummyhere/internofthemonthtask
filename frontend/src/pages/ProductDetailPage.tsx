import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { Product } from '../types';
import { useCart } from '../../src/context/CartContext';
import { useWishlist } from '../../src/context/WishlistContext';
import { ProductCard } from '../components/catalog/ProductCard';
import {
  Heart,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  Truck,
  Leaf,
  ChevronRight,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await catalogApi.getProductBySlug(slug);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
        <div className="w-8 h-8 border-3 border-[#62ab00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading fresh organic produce details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-display">Product Not Found</h2>
        <p className="text-sm text-stone-500">This organic item is currently not active in our harvest catalog.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#62ab00] text-white font-semibold text-xs rounded-full">
          Browse Organic Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Vegist Organic Grocery!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-[#62ab00] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link to="/shop" className="hover:text-[#62ab00] transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link to={`/category/${product.category_slug}`} className="hover:text-[#62ab00] transition-colors">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Dual-Column Product Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
        {/* Left: Product Imagery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-xs">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_organic && (
                <span className="px-3 py-1 rounded-md bg-[#62ab00] text-white text-xs font-bold uppercase shadow-sm">
                  100% Certified Organic
                </span>
              )}
              {product.discount_percentage > 0 && (
                <span className="px-3 py-1 rounded-md bg-amber-500 text-white text-xs font-bold uppercase shadow-sm">
                  Save {product.discount_percentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Buy Box & Specs */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Farm Origin */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-bold text-[#62ab00] uppercase tracking-wider">{product.category_name}</span>
              <span className="text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">{product.origin}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203a27] font-display mb-3">
              {product.name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex flex-wrap items-center gap-4 text-xs mb-6">
              <div className="flex items-center gap-1.5 text-amber-500 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviews_count} verified reviews)</span>
              </div>

              <span className="text-stone-300">•</span>

              {isOutOfStock ? (
                <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                  Currently Out of Stock
                </span>
              ) : (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  In Stock ({product.stock_quantity} available)
                </span>
              )}

              <span className="text-stone-300">•</span>
              <span className="text-stone-600 font-medium">Packaging: {product.unit}</span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 mb-6 flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-[#203a27] font-sans">
                Rs. {product.current_price}
              </span>
              {product.discounted_price && (
                <span className="text-base text-stone-400 line-through">
                  Rs. {product.regular_price}
                </span>
              )}
              <span className="text-xs text-stone-500 font-medium ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-stone text-sm text-stone-600 leading-relaxed mb-6">
              <p>{product.description}</p>
            </div>

            {/* Nutritional & Origin Highlights Callout */}
            {product.nutritional_highlights && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-950 mb-6 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-[#62ab00]" />
                  <span>Harvest Purity & Nutritional Highlights</span>
                </div>
                <p className="leading-relaxed text-stone-600 pl-5">
                  {product.nutritional_highlights}
                </p>
              </div>
            )}
          </div>

          {/* Quantity Stepper & Add to Cart Controls */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg active:scale-90 transition-all duration-150"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg active:scale-90 transition-all duration-150"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`w-full sm:flex-1 py-3.5 px-8 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none ${
                  isAdding
                    ? 'bg-[#518e00] animate-added-check'
                    : 'bg-[#62ab00] hover:bg-[#518e00]'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 animate-added-check stroke-[2.5]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <span>
                    Add to Cart • Rs. {(parseFloat(product.current_price) * quantity).toLocaleString()}
                  </span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border border-stone-200 transition-all duration-200 shadow-xs active:scale-90 hover:scale-105 ${
                  isSaved ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white hover:bg-stone-50 text-stone-600'
                }`}
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 transition-transform duration-200 ${isSaved ? 'fill-rose-500 text-rose-500 animate-heart-pop' : ''}`} />
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-all duration-200 shadow-xs active:scale-90"
                title="Share produce"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Assurance */}
            <div className="grid grid-cols-2 gap-4 text-xs text-stone-500 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#62ab00]" />
                <span>Next morning dispatch at 7:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#62ab00]" />
                <span>Biodegradable cornstarch packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Produce Section */}
      {product.related_products && product.related_products.length > 0 && (
        <section className="pt-10 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#62ab00] uppercase tracking-wider block mb-1">
                More from {product.category_name}
              </span>
              <h3 className="text-2xl font-bold text-[#203a27] font-display">
                Related Farm Harvests
              </h3>
            </div>
            <Link
              to={`/category/${product.category_slug}`}
              className="text-xs font-bold text-[#62ab00] hover:underline"
            >
              View All {product.category_name} →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
