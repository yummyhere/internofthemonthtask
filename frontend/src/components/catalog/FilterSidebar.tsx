import React from 'react';
import { Category } from '../../types';
import { ProductFilters } from '../../api/catalog';
import { Filter, RotateCcw, Check } from 'lucide-react';

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (newFilters: Partial<ProductFilters>) => void;
  onReset: () => void;
  isMobileModal?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  isMobileModal = false,
  onCloseMobile,
}) => {
  return (
    <div className={`space-y-6 ${isMobileModal ? 'p-6 bg-white' : ''}`}>
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-base font-display">
          <Filter className="w-4 h-4 text-[#62ab00]" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-[#62ab00] flex items-center gap-1 transition-all duration-200 active:scale-95 group"
        >
          <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform duration-200" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3 font-display">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ category: undefined, page: 1 })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.98] text-left ${
              !filters.category
                ? 'bg-[#62ab00] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug, page: 1 })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.98] text-left ${
                  isSelected
                    ? 'bg-[#62ab00] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200/60 text-stone-500'
                  }`}
                >
                  {cat.products_count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3 font-display">
          Price Range (PKR)
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Min Price</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.min_price || ''}
              onChange={(e) => onFilterChange({ min_price: e.target.value || undefined, page: 1 })}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#62ab00]/20 focus:border-[#62ab00] transition-all duration-150"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Max Price</label>
            <input
              type="number"
              min="0"
              placeholder="2500"
              value={filters.max_price || ''}
              onChange={(e) => onFilterChange({ max_price: e.target.value || undefined, page: 1 })}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#62ab00]/20 focus:border-[#62ab00] transition-all duration-150"
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <h4 className="font-semibold text-stone-800 text-sm font-display">
          Organic Preferences
        </h4>

        {/* Organic Only */}
        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.is_organic}
            onChange={(e) => onFilterChange({ is_organic: e.target.checked ? true : undefined, page: 1 })}
            className="w-4 h-4 rounded text-[#62ab00] focus:ring-[#62ab00] border-stone-300"
          />
          <span>100% Certified Organic Only</span>
        </label>

        {/* In Stock Only */}
        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.in_stock}
            onChange={(e) => onFilterChange({ in_stock: e.target.checked ? true : undefined, page: 1 })}
            className="w-4 h-4 rounded text-[#62ab00] focus:ring-[#62ab00] border-stone-300"
          />
          <span>In Stock Available Now</span>
        </label>

        {/* On Sale / Harvest Deals */}
        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.on_sale}
            onChange={(e) => onFilterChange({ on_sale: e.target.checked ? true : undefined, page: 1 })}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
          />
          <span className="text-amber-800 font-medium">Discounted Harvest Deals Only</span>
        </label>
      </div>

      {isMobileModal && (
        <button
          onClick={onCloseMobile}
          className="w-full py-3 bg-[#62ab00] text-white text-sm font-semibold rounded-xl shadow-sm mt-4"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};
