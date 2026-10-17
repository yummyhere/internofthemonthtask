import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogApi, ProductFilters } from '../api/catalog';
import { Product, Category, PaginatedResponse } from '../types';
import { ProductCard } from '../components/catalog/ProductCard';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { QuickViewModal } from '../components/catalog/QuickViewModal';
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  X
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state from URL query params
  const currentCategory = searchParams.get('category') || undefined;
  const currentSearch = searchParams.get('search') || undefined;
  const currentMinPrice = searchParams.get('min_price') || undefined;
  const currentMaxPrice = searchParams.get('max_price') || undefined;
  const currentOrganic = searchParams.get('is_organic') === 'true' ? true : undefined;
  const currentInStock = searchParams.get('in_stock') === 'true' ? true : undefined;
  const currentOnSale = searchParams.get('on_sale') === 'true' ? true : undefined;
  const currentOrdering = searchParams.get('ordering') || '-created_at';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const filters: ProductFilters = {
    category: currentCategory,
    search: currentSearch,
    min_price: currentMinPrice,
    max_price: currentMaxPrice,
    is_organic: currentOrganic,
    in_stock: currentInStock,
    on_sale: currentOnSale,
    ordering: currentOrdering,
    page: currentPage,
    page_size: 12,
  };

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await catalogApi.getProducts(filters);
        setProductsData(res);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilters = (newParams: Partial<ProductFilters>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === '' || val === null) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(val));
      }
    });

    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-extrabold text-[#203a27] font-display">
            {currentCategory
              ? `${currentCategory.replace('-', ' ').toUpperCase()} Harvest`
              : currentSearch
              ? `Search: "${currentSearch}"`
              : currentOnSale
              ? 'Harvest Deals & Discounts'
              : 'Organic Grocery Catalog'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {productsData ? `Showing ${productsData.count} certified organic items` : 'Loading items...'}
          </p>
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-50"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#62ab00]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 hidden sm:inline">Sort By:</span>
            <select
              value={currentOrdering}
              onChange={(e) => updateFilters({ ordering: e.target.value, page: 1 })}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#62ab00]"
            >
              <option value="-created_at">Newest Harvest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs sticky top-28">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={updateFilters}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Products Grid Column */}
        <main className="lg:col-span-3 space-y-8">
          {/* Active Filter Chips */}
          {(currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentOrganic || currentInStock || currentOnSale) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-stone-400 font-medium">Active:</span>

              {currentCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-[#203a27] text-xs font-medium rounded-full border border-emerald-200">
                  Category: {currentCategory}
                  <button onClick={() => updateFilters({ category: undefined, page: 1 })}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}

              {currentSearch && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-[#203a27] text-xs font-medium rounded-full border border-emerald-200">
                  "{currentSearch}"
                  <button onClick={() => updateFilters({ search: undefined, page: 1 })}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}

              {currentOrganic && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-[#203a27] text-xs font-medium rounded-full border border-emerald-200">
                  Organic Only
                  <button onClick={() => updateFilters({ is_organic: undefined, page: 1 })}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}

              {currentOnSale && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-full border border-amber-200">
                  Deals Only
                  <button onClick={() => updateFilters({ on_sale: undefined, page: 1 })}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-[#62ab00] hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4 animate-pulse">
                  <div className="aspect-square bg-stone-100 rounded-xl" />
                  <div className="h-4 bg-stone-100 rounded w-2/3" />
                  <div className="h-3 bg-stone-100 rounded w-1/3" />
                  <div className="h-8 bg-stone-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : productsData && productsData.results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {productsData.results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                No organic products found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn't find items matching your active filters. Try adjusting price thresholds or clearing search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-[#62ab00] text-white text-xs font-semibold hover:bg-[#518e00] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {productsData && productsData.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
              <button
                disabled={!productsData.previous}
                onClick={() => updateFilters({ page: currentPage - 1 })}
                className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(productsData.total_pages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilters({ page: pageNum })}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-[#62ab00] text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={!productsData.next}
                onClick={() => updateFilters({ page: currentPage + 1 })}
                className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl overflow-y-auto">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={(newF) => {
                  updateFilters(newF);
                }}
                onReset={handleResetFilters}
                isMobileModal={true}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
