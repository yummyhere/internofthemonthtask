import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#62ab00] flex items-center justify-center mx-auto">
        <Leaf className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#203a27] font-display">
        404
      </h1>
      <h2 className="text-lg font-bold text-stone-800">
        Organic Harvest Page Not Found
      </h2>
      <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
        The farm path you followed may have moved or been retired with the season.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-xs shadow-xs transition-colors"
        >
          <span>Return to Storefront</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
