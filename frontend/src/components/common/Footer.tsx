import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Send, ShieldCheck, Truck, RefreshCcw, HeartHandshake } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please provide a valid email address.', 'warning');
      return;
    }
    setIsSubscribed(true);
    addToast('Thank you for subscribing to weekly farm harvest alerts!', 'success');
  };

  return (
    <footer className="bg-[#203a27] text-stone-300 mt-20 border-t border-emerald-950">
      {/* Guarantees Bar */}
      <div className="border-b border-emerald-900/60 py-8 bg-[#1a3020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#62ab00]/20 flex items-center justify-center text-[#62ab00] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Harvested Same-Day</p>
              <p className="text-xs text-stone-400">Direct from field to kitchen within 24h</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#62ab00]/20 flex items-center justify-center text-[#62ab00] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">100% Certified Organic</p>
              <p className="text-xs text-stone-400">Zero synthetic sprays or chemical ripening</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#62ab00]/20 flex items-center justify-center text-[#62ab00] shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Freshness Guarantee</p>
              <p className="text-xs text-stone-400">Instant replacement if not delighted</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#62ab00]/20 flex items-center justify-center text-[#62ab00] shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Fair Farmer Trade</p>
              <p className="text-xs text-stone-400">Supporting local ethical agricultural families</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & About */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#62ab00] flex items-center justify-center text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-display">
              Vegist
            </span>
          </Link>
          <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
            Vegist connects conscious households directly with chemical-free regenerative organic growers.
            Fresh, wholesome, seasonal produce delivered straight to your doorstep at fair prices.
          </p>
          <div className="text-xs text-stone-400 pt-2 space-y-1">
            <p><strong className="text-stone-300">Hub:</strong> 14-Industrial Zone, Gulberg III, Lahore, Pakistan</p>
            <p><strong className="text-stone-300">Support:</strong> support@vegist-organic.com | +92 300 8765432</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4 font-display">
            Organic Catalog
          </h4>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link to="/category/vegetables" className="hover:text-white transition-colors">Fresh Vegetables</Link></li>
            <li><Link to="/category/fruits" className="hover:text-white transition-colors">Organic Fruits</Link></li>
            <li><Link to="/category/dairy-eggs" className="hover:text-white transition-colors">Dairy & Free-Range Eggs</Link></li>
            <li><Link to="/category/juices" className="hover:text-white transition-colors">Cold-Pressed Juices</Link></li>
            <li><Link to="/category/bakery-grains" className="hover:text-white transition-colors">Bakery & Whole Grains</Link></li>
            <li><Link to="/category/pantry" className="hover:text-white transition-colors">Pantry & Raw Oils</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4 font-display">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            <li><Link to="/account" className="hover:text-white transition-colors">My Orders & Profile</Link></li>
            <li><Link to="/shop?on_sale=true" className="hover:text-white transition-colors">Weekly Harvest Specials</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4 font-display">
            Weekly Farm Dispatch
          </h4>
          <p className="text-xs text-stone-400 mb-3 leading-relaxed">
            Get seasonal produce arrivals, harvest calendars, and exclusive subscriber perks.
          </p>

          {isSubscribed ? (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#62ab00] shrink-0" />
              <span>You're subscribed to weekly fresh produce alerts!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#62ab00] hover:bg-[#518e00] text-white rounded-lg transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-stone-500">We respect your privacy. No spam, ever.</p>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-950 py-6 bg-[#16271b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Vegist Organic Grocery Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Payment Accepted:</span>
            <span className="px-2 py-1 bg-stone-800 text-stone-300 font-medium rounded text-[11px] border border-stone-700">Cash on Delivery (COD)</span>
            <span className="px-2 py-1 bg-stone-800 text-stone-300 font-medium rounded text-[11px] border border-stone-700">Online Card Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
