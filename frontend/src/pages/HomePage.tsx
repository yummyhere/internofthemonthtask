import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { Product, Category } from '../types';
import { ProductCard } from '../components/catalog/ProductCard';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { QuickViewModal } from '../components/catalog/QuickViewModal';
import { ScrollReveal } from '../components/common/ScrollReveal';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  Sun,
  Award,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleDeals, setSaleDeals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'trending' | 'deals' | 'best'>('trending');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const [cats, feat, deals, all] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getFeaturedProducts(),
          catalogApi.getSaleDeals(),
          catalogApi.getProducts({ page_size: 8 }),
        ]);
        setCategories(cats);
        setFeaturedProducts(feat);
        setSaleDeals(deals);
        setAllProducts(all.results);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const displayedProducts =
    activeTab === 'trending'
      ? featuredProducts
      : activeTab === 'deals'
      ? saleDeals
      : allProducts;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Editorial Section with Natural Coordinated Entrance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#203a27] via-[#24452d] to-[#1a3320] text-white shadow-xl min-h-[500px] flex items-center">
          {/* Subtle Organic Background Texture */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#62ab00_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10 w-full">
            <div className="lg:col-span-7 space-y-6">
              <div
                style={{ animationDelay: '60ms' }}
                className="animate-hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-[#62ab00] text-xs font-bold tracking-wider uppercase"
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>100% Farm-Direct Certified Organic</span>
              </div>

              <h1
                style={{ animationDelay: '160ms' }}
                className="animate-hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-white"
              >
                Fresh from Earth <br />
                <span className="text-[#62ab00]">to Your Kitchen.</span>
              </h1>

              <p
                style={{ animationDelay: '260ms' }}
                className="animate-hero-reveal text-stone-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed"
              >
                Picked at sunrise from certified organic local growers. Zero chemical ripening, zero synthetic pesticides—just pure, nutritious abundance delivered straight to your door.
              </p>

              <div
                style={{ animationDelay: '360ms' }}
                className="animate-hero-reveal flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/shop"
                  className="px-8 py-3.5 rounded-full bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-sm tracking-wide transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#62ab00]/25 hover:shadow-xl flex items-center gap-2 group"
                >
                  <span>Shop Fresh Harvest</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/shop?on_sale=true"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] border border-white/20 backdrop-blur-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Weekly Deals</span>
                </Link>
              </div>

              {/* Trust Metric Badges */}
              <div
                style={{ animationDelay: '460ms' }}
                className="animate-hero-reveal grid grid-cols-3 gap-4 pt-6 border-t border-emerald-900/60 text-xs"
              >
                <div>
                  <p className="font-extrabold text-white text-lg font-display">24h</p>
                  <p className="text-stone-400">Harvest to Doorstep</p>
                </div>
                <div>
                  <p className="font-extrabold text-white text-lg font-display">0%</p>
                  <p className="text-stone-400">Synthetic Sprays</p>
                </div>
                <div>
                  <p className="font-extrabold text-white text-lg font-display">Rs. 0</p>
                  <p className="text-stone-400">Delivery over Rs. 2k</p>
                </div>
              </div>
            </div>

            {/* Editorial Hero Visual with Restrained Organic Hover & Entrance */}
            <div
              style={{ animationDelay: '200ms' }}
              className="lg:col-span-5 relative animate-hero-image"
            >
              <div className="relative mx-auto w-full max-w-md aspect-4/3 lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group transition-all duration-500 hover:border-[#62ab00]/40">
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80"
                  alt="Farm Fresh Organic Vegetables Basket"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#62ab00] bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                      Today's Harvest
                    </span>
                    <p className="text-white font-bold text-lg mt-1 font-display">
                      potohar heirloom crops
                    </p>
                    <p className="text-stone-300 text-xs">Hand-harvested 6:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Discovery Shelf */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#62ab00] uppercase tracking-wider block mb-1">
                Explore Our Pantry
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#203a27] font-display">
                Shop by Fresh Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#62ab00] hover:text-[#518e00] flex items-center gap-1 group transition-colors"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 3. Curated Tabbed Collections */}
      <ScrollReveal delayMs={80}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#62ab00] uppercase tracking-wider block mb-1">
                Hand-Selected Abundance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#203a27] font-display">
                Seasonal Organic Collections
              </h2>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  activeTab === 'trending'
                    ? 'bg-white text-[#203a27] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Trending Fresh
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1 ${
                  activeTab === 'deals'
                    ? 'bg-[#62ab00] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Harvest Deals</span>
              </button>
              <button
                onClick={() => setActiveTab('best')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  activeTab === 'best'
                    ? 'bg-white text-[#203a27] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Essentials
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Seasonal Editorial Promotion Banners */}
      <ScrollReveal delayMs={60}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1 */}
            <div className="relative rounded-3xl overflow-hidden bg-emerald-900 text-white p-8 flex flex-col justify-between min-h-[260px] group shadow-md transition-shadow duration-300 hover:shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80"
                alt="Leafy greens harvest"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-104 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold text-[#62ab00] uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                  Weekly Bundle
                </span>
                <h3 className="text-2xl font-bold font-display text-white max-w-xs">
                  Fresh Salad & Greens Box
                </h3>
                <p className="text-xs text-stone-300 max-w-sm">
                  Crisp baby spinach, kale bunches, rainbow carrots, and heirloom vine tomatoes at special harvest prices.
                </p>
              </div>
              <div className="relative z-10 pt-4">
                <Link
                  to="/category/vegetables"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-[#203a27] font-bold text-xs hover:bg-[#62ab00] hover:text-white transition-all duration-200 active:scale-95"
                >
                  <span>Shop Veggie Bundles</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative rounded-3xl overflow-hidden bg-amber-950 text-white p-8 flex flex-col justify-between min-h-[260px] group shadow-md transition-shadow duration-300 hover:shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=700&q=80"
                alt="Organic Olive Oil and Raw Honey"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-104 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                  Pantry Reserve
                </span>
                <h3 className="text-2xl font-bold font-display text-white max-w-xs">
                  Cold-Pressed Oils & Sidr Honey
                </h3>
                <p className="text-xs text-stone-300 max-w-sm">
                  Pure raw honey gathered from wild Beri forests and single-estate virgin olive oil cold-extracted under 27°C.
                </p>
              </div>
              <div className="relative z-10 pt-4">
                <Link
                  to="/category/pantry"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-[#203a27] font-bold text-xs hover:bg-amber-500 hover:text-white transition-all duration-200 active:scale-95"
                >
                  <span>Explore Organic Pantry</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Why Vegist Credibility Section */}
      <ScrollReveal delayMs={60}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-xs transition-shadow duration-300 hover:shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#62ab00] uppercase tracking-wider block mb-1">
                Ethical Sourcing Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#203a27] font-display mb-3">
                Why Shopping at Vegist is Different
              </h2>
              <p className="text-sm text-stone-500">
                We eliminated the brokers, wholesale cold storages, and synthetic preservatives that compromise the vital nutrition of your family's food.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3 p-4 rounded-2xl hover:bg-stone-50/70 transition-colors duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#62ab00] flex items-center justify-center mx-auto border border-emerald-100 transition-transform duration-200 hover:scale-105">
                  <Sun className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 text-base font-display">
                  Sun-Ripened Naturally
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Produce is left on the soil or tree until genuine biological ripeness, ensuring full nutrient density and natural sweetness.
                </p>
              </div>

              <div className="text-center space-y-3 p-4 rounded-2xl hover:bg-stone-50/70 transition-colors duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#62ab00] flex items-center justify-center mx-auto border border-emerald-100 transition-transform duration-200 hover:scale-105">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 text-base font-display">
                  Laboratory Soil Audits
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Partner farms undergo seasonal soil chemistry testing to verify complete absence of synthetic fertilizers and heavy metals.
                </p>
              </div>

              <div className="text-center space-y-3 p-4 rounded-2xl hover:bg-stone-50/70 transition-colors duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#62ab00] flex items-center justify-center mx-auto border border-emerald-100 transition-transform duration-200 hover:scale-105">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 text-base font-display">
                  Fair Trade Crop Pricing
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  We pay our organic farmers 35% above conventional market rates, securing sustainable agricultural livelihoods for regional growers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
