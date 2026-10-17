import React from 'react';
import { useCart } from '../../context/CartContext';
import { Truck, Phone, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { subtotal, freeDeliveryGap, isFreeDeliveryEligible } = useCart();

  return (
    <div className="bg-[#203a27] text-stone-200 text-xs py-2 px-4 transition-colors border-b border-emerald-950/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#62ab00]" />
          {subtotal > 0 && !isFreeDeliveryEligible ? (
            <span>
              Add <strong className="text-white">Rs. {freeDeliveryGap.toLocaleString()}</strong> more to claim <span className="text-[#62ab00] font-semibold">Free Delivery</span>!
            </span>
          ) : isFreeDeliveryEligible && subtotal > 0 ? (
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#62ab00]" />
              Congratulations! You've unlocked Free Standard Delivery.
            </span>
          ) : (
            <span>
              Free same-day delivery on fresh produce orders over <strong className="text-white">Rs. 2,000</strong> across Lahore & Islamabad.
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6 text-stone-300">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#62ab00]" />
            <span>Farm Helpline: <a href="tel:+923008765432" className="text-white hover:text-[#62ab00] transition-colors">+92 300 8765432</a></span>
          </div>
          <span className="text-emerald-900">•</span>
          <span>Morning Harvest: 6:00 AM - 11:00 AM</span>
        </div>
      </div>
    </div>
  );
};
