import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { Product, Category } from '../types';
import { ProductCard } from '../components/catalog/ProductCard';
import { QuickViewModal } from '../components/catalog/QuickViewModal';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadCategoryData = async () => {
      setIsLoading(true);
      try {
        const [catData, prodsRes] = await Promise.all([
          catalogApi.getCategoryBySlug(slug),
          catalogApi.getProducts({ category: slug, page_size: 40 }),
        ]);
        setCategory(catData);
        setProducts(prodsRes.results);
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-stone-500">
        <div className="w-8 h-8 border-3 border-[#62ab00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading fresh harvest category...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-display">Category Not Found</h2>
        <p className="text-sm text-stone-500">The grocery category you requested is not currently active.</p>
        <Link to="/shop" className="inline-flex px-6 py-2.5 rounded-full bg-[#62ab00] text-white font-semibold text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Editorial Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#203a27] text-white p-8 sm:p-12 shadow-lg min-h-[220px] flex items-center">
        <img
          src={category.image_url}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 max-w-xl space-y-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-[#62ab00] hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Groceries</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            {category.name}
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed">
            {category.description || 'Grown with regenerative organic standards, chemical-free and packed with vital nutrition.'}
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs text-stone-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#62ab00]" />
              Verified Organic Sourcing
            </span>
            <span>•</span>
            <span>{products.length} seasonal items available</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900 font-display">
            Available in {category.name}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {products.length} fresh products
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <p className="text-base font-semibold text-stone-800">
              No products found in {category.name} currently.
            </p>
            <p className="text-xs text-stone-500">
              Our farmers harvest in seasonal cycles. Check back tomorrow morning!
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 bg-[#62ab00] text-white text-xs font-semibold rounded-full hover:bg-[#518e00]"
            >
              Browse All Produce
            </Link>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
