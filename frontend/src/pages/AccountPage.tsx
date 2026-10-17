import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api/orders';
import { Order } from '../types';
import { useToast } from '../context/ToastContext';
import {
  User as UserIcon,
  Package,
  MapPin,
  Clock,
  LogOut,
  ExternalLink,
  Ban,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout, updateUser, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Profile edit state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [address, setAddress] = useState(user?.profile?.address || '');
  const [city, setCity] = useState(user?.profile?.city || 'Lahore');
  const [postalCode, setPostalCode] = useState(user?.profile?.postal_code || '');
  const [deliveryNotes, setDeliveryNotes] = useState(user?.profile?.delivery_notes || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await ordersApi.getMyOrders();
          setOrders(res.results);
        } catch (err) {
          console.error('Failed to load customer orders', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      loadOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.profile?.phone || '');
      setAddress(user.profile?.address || '');
      setCity(user.profile?.city || 'Lahore');
      setPostalCode(user.profile?.postal_code || '');
      setDeliveryNotes(user.profile?.delivery_notes || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUser({
        first_name: firstName,
        last_name: lastName,
        profile: {
          phone,
          address,
          city,
          postal_code: postalCode,
          delivery_notes: deliveryNotes,
        },
      });
    } catch {
      // toast shown in context
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelOrder = async (orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderNumber}?`)) {
      return;
    }
    try {
      const res = await ordersApi.cancelOrder(orderNumber);
      addToast(res.message, 'info');
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.order_number === orderNumber ? res.order : o))
      );
    } catch (err: any) {
      addToast(err.response?.data?.detail || 'Could not cancel this order.', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
        <div className="w-8 h-8 border-3 border-[#62ab00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading your customer profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Greeting Card */}
      <div className="bg-[#203a27] text-white p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#62ab00] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">{user.email}</p>
            {user.is_staff && (
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md uppercase">
                Staff Administrator
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.is_staff && (
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Django Admin</span>
            </a>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#62ab00] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#62ab00] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Default Address & Settings</span>
        </button>
      </div>

      {/* Tab: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Loading your previous orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-900 text-base font-display">No Orders Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You haven't placed any orders yet. Fresh organic fruits, vegetables, and dairy are waiting for you!
              </p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2.5 bg-[#62ab00] text-white text-xs font-bold rounded-full hover:bg-[#518e00]"
              >
                Browse Harvest Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isCancellable = order.fulfillment_status === 'pending' || order.fulfillment_status === 'processing';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900 font-mono">
                            #{order.order_number}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.fulfillment_status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.fulfillment_status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {order.fulfillment_status}
                          </span>
                        </div>
                        <p className="text-stone-400 mt-1">
                          Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/order-confirmation/${order.order_number}`}
                          className="px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
                        >
                          View Receipt
                        </Link>
                        {isCancellable && (
                          <button
                            onClick={() => handleCancelOrder(order.order_number)}
                            className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="divide-y divide-stone-100 text-xs">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between">
                          <span className="font-medium text-stone-800">
                            {item.quantity} × {item.product_name_snapshot} ({item.unit_snapshot})
                          </span>
                          <span className="font-bold text-stone-900 font-sans">
                            Rs. {item.line_total}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
                      <span>Delivery: {order.shipping_address}, {order.city}</span>
                      <span className="text-sm text-[#203a27]">Total: Rs. {order.final_total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile & Address */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xs max-w-2xl space-y-6">
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Personal Details & Delivery Defaults
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Default Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Notes / Landmark</label>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="py-3 px-6 bg-[#62ab00] hover:bg-[#518e00] text-white text-xs font-bold rounded-xl transition-colors shadow-xs disabled:bg-stone-300"
            >
              {isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
