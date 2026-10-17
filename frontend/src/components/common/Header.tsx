import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { catalogApi } from '../../api/catalog';
import { Product, Category } from '../../types';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemsCount, subtotal, openCart, cartBump } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount, wishlistBump } = useWishlist();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Smooth scroll-reactive header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await catalogApi.getProducts({ search: searchQuery.trim(), page_size: 5 });
        setSearchResults(res.results);
        setShowSearchDropdown(true);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all duration-300 ${isScrolled ? 'shadow-md shadow-stone-900/5' : 'shadow-none'}`}>
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-[#62ab00] transition-colors active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#62ab00] flex items-center justify-center text-white shadow-md shadow-[#62ab00]/25 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[#203a27] font-display flex items-center gap-1 group-hover:text-[#62ab00] transition-colors duration-200">
                Vegist
                <span className="w-2 h-2 rounded-full bg-[#62ab00] inline-block mb-1"></span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 -mt-1">
                Organic Grocery
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                placeholder="Search fresh spinach, desi milk, wild honey..."
                className="w-full pl-11 pr-24 py-2.5 rounded-full border border-stone-200 bg-stone-50/80 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#62ab00] focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#62ab00] hover:bg-[#518e00] text-white text-xs font-semibold rounded-full transition-all active:scale-95 duration-150"
              >
                Search
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 overflow-hidden animate-hero-reveal">
                {isSearching ? (
                  <div className="py-6 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#62ab00] border-t-transparent rounded-full animate-spin"></span>
                    Searching organic catalog...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col divide-y divide-stone-100">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Product Matches
                    </p>
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl transition-all duration-150 group"
                      >
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover bg-stone-100 shrink-0 group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800 truncate group-hover:text-[#62ab00] transition-colors">
                            {p.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {p.unit} • <span className="font-semibold text-[#203a27]">Rs. {p.current_price}</span>
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#62ab00] -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-semibold text-[#62ab00] hover:bg-emerald-50 rounded-lg transition-colors mt-1"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-stone-500">
                    No matching organic produce found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-stone-700 hover:text-[#62ab00] hover:bg-stone-50 rounded-full transition-all duration-150 active:scale-95"
              title="Saved Produce"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 transition-transform duration-200 ${wishlistBump ? 'animate-heart-pop text-rose-500 fill-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className={`absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${wishlistBump ? 'animate-badge-bump' : ''}`}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-stone-50 text-stone-700 transition-colors"
                  aria-label="Account Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#203a27] font-semibold text-xs flex items-center justify-center border border-emerald-200">
                    {user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-medium max-w-[100px] truncate text-stone-800">
                    {user?.first_name || user?.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 text-stone-700 hover:text-[#62ab00] hover:bg-stone-50 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-400">Signed in as</p>
                    <p className="text-sm font-semibold text-stone-900 truncate">{user?.email || user?.username}</p>
                    {user?.is_staff && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                        Store Staff
                      </span>
                    )}
                  </div>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-[#62ab00] transition-colors"
                  >
                    My Account & Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-[#62ab00] transition-colors"
                  >
                    Wishlist ({wishlistCount})
                  </Link>
                  {user?.is_staff && (
                    <a
                      href="http://127.0.0.1:8000/admin/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      Django Administration ↗
                    </a>
                  )}
                  <div className="border-t border-stone-100 my-1"></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#62ab00] hover:bg-[#518e00] text-white shadow-sm hover:shadow transition-all duration-150 active:scale-95 group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${cartBump ? 'scale-125' : ''}`} />
                {itemsCount > 0 && (
                  <span className={`absolute -top-2 -right-2.5 w-4 h-4 bg-white text-[#203a27] text-[10px] font-black rounded-full flex items-center justify-center shadow-xs transition-transform ${cartBump ? 'animate-badge-bump' : ''}`}>
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">
                Rs. {subtotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-stone-100 py-3 text-sm font-medium text-stone-700">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`nav-link-indicator py-1 hover:text-[#62ab00] transition-colors duration-200 ${
                location.pathname === '/' ? 'active text-[#62ab00]' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`nav-link-indicator py-1 hover:text-[#62ab00] transition-colors duration-200 ${
                location.pathname === '/shop' ? 'active text-[#62ab00]' : ''
              }`}
            >
              All Produce & Groceries
            </Link>

            {/* Dynamic Category Links */}
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`nav-link-indicator py-1 hover:text-[#62ab00] transition-colors duration-200 ${
                  location.pathname === `/category/${cat.slug}` ? 'active text-[#62ab00]' : ''
                }`}
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/shop?on_sale=true"
              className="flex items-center gap-1.5 text-amber-700 font-semibold hover:text-amber-800 transition-colors duration-200 group py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform duration-200" />
              Harvest Deals
            </Link>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            100% Certified Organic Guarantee
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetables, fruits, dairy..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col gap-2 font-medium text-stone-800 text-sm">
            <Link to="/" className="p-2 hover:bg-stone-50 rounded-lg">Home</Link>
            <Link to="/shop" className="p-2 hover:bg-stone-50 rounded-lg">All Groceries</Link>
            <p className="px-2 pt-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Categories</p>
            {categories.map((c) => (
              <Link key={c.id} to={`/category/${c.slug}`} className="p-2 pl-4 hover:bg-stone-50 rounded-lg text-stone-600">
                {c.name}
              </Link>
            ))}
            <div className="border-t border-stone-100 my-2"></div>
            <Link to="/shop?on_sale=true" className="p-2 text-amber-700 font-semibold hover:bg-amber-50 rounded-lg">
              ✨ Harvest Deals
            </Link>
            <Link to="/wishlist" className="p-2 hover:bg-stone-50 rounded-lg flex items-center justify-between">
              <span>Saved Wishlist</span>
              <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">{wishlistCount}</span>
            </Link>
            {isAuthenticated ? (
              <Link to="/account" className="p-2 hover:bg-stone-50 rounded-lg">My Account ({user?.username})</Link>
            ) : (
              <Link to="/login" className="p-2 text-[#62ab00] font-semibold hover:bg-emerald-50 rounded-lg">Sign In / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
