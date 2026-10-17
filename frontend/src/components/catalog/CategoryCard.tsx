import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative bg-white rounded-2xl border border-stone-200/80 p-4 hover:border-[#62ab00]/50 hover:shadow-md transition-all duration-300 active:scale-[0.98] flex flex-col items-center text-center overflow-hidden"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-100 mb-3 border-2 border-stone-100 group-hover:border-[#62ab00] transition-colors duration-300">
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          loading="lazy"
        />
      </div>

      <h3 className="font-semibold text-stone-900 text-sm group-hover:text-[#62ab00] transition-colors duration-200 font-display line-clamp-1 mb-1">
        {category.name}
      </h3>

      <p className="text-xs text-stone-400 mb-2">
        {category.products_count} {category.products_count === 1 ? 'item' : 'items'}
      </p>

      <span className="text-[11px] font-semibold text-[#62ab00] flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        <span>Explore</span>
        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
};
