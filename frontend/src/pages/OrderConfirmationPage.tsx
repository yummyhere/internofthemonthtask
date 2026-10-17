import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { Order } from '../types';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  Printer,
  ArrowRight,
  ShieldCheck,
  Phone
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!order);
  const [guestIdentifier, setGuestIdentifier] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        setIsLoading(true);
        try {
          const data = await ordersApi.getOrderDetails(id);
          setOrder(data);
        } catch (err: any) {
          // If permission denied for guest, show email/phone verification input
          if (err.response?.status === 403 || err.response?.status === 401) {
            setLookupError('Please enter the email or phone number used for this order to view confirmation.');
          } else {
            setLookupError('Order not found or access expired.');
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const handleGuestVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !guestIdentifier) return;
    setIsLoading(true);
    setLookupError(null);
    try {
      const data = await ordersApi.guestLookup(id, guestIdentifier);
      setOrder(data);
    } catch (err: any) {
      setLookupError(err.response?.data?.detail || 'Verification failed. Please check your order number and contact details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
        <div className="w-8 h-8 border-3 border-[#62ab00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Retrieving verified order confirmation...
      </div>
    );
  }

  // Guest Verification Form if not authorized immediately
  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#62ab00] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-display">
            Verify Order Access
          </h2>
          <p className="text-xs text-stone-500">
            For security, please enter the email address or phone number used during checkout for Order <strong>#{id}</strong>.
          </p>

          {lookupError && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {lookupError}
            </p>
          )}

          <form onSubmit={handleGuestVerify} className="space-y-3 pt-2">
            <input
              type="text"
              required
              placeholder="Email or phone number"
              value={guestIdentifier}
              onChange={(e) => setGuestIdentifier(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#62ab00] hover:bg-[#518e00] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Verify & View Order
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#62ab00] flex items-center justify-center mx-auto border-2 border-emerald-100 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          Order Confirmed & Logged
        </span>

        <h1 className="text-3xl font-extrabold text-[#203a27] font-display">
          Thank you for choosing Vegist Organic!
        </h1>

        <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
          Your order has been received and scheduled for morning farm dispatch. A confirmation message has been recorded for <strong>{order.email}</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <span className="px-4 py-2 bg-stone-100 text-stone-800 rounded-xl font-mono">
            Order Reference: {order.order_number}
          </span>
          <span className="px-4 py-2 bg-stone-100 text-stone-800 rounded-xl">
            Payment: {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery (Pending)' : 'Paid Online'}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <h2 className="text-base font-bold text-stone-900 font-display">
            Order Summary
          </h2>
          <button
            onClick={() => window.print()}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Itemized list */}
        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-stone-800">{item.product_name_snapshot}</p>
                <p className="text-stone-400">
                  {item.quantity} × Rs. {item.unit_price_at_purchase} ({item.unit_snapshot})
                </p>
              </div>
              <span className="font-bold text-stone-900 font-sans">
                Rs. {item.line_total}
              </span>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900">Rs. {order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>
              {parseFloat(order.delivery_fee) === 0 ? (
                <span className="text-[#62ab00] font-bold">FREE</span>
              ) : (
                <span className="font-bold text-stone-900">Rs. {order.delivery_fee}</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-[#203a27] pt-3 border-t border-stone-200 font-sans">
            <span>Total Paid / Payable</span>
            <span className="text-xl text-[#62ab00]">Rs. {order.final_total}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#62ab00]" />
              Shipping Address
            </p>
            <p className="text-stone-600">{order.customer_name}</p>
            <p className="text-stone-500">{order.shipping_address}, {order.city}</p>
            <p className="text-stone-500">Phone: {order.phone}</p>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#62ab00]" />
              Fulfillment Status
            </p>
            <p className="text-emerald-700 font-bold capitalize">{order.fulfillment_status}</p>
            <p className="text-stone-500">Slot & Notes: {order.delivery_instructions || 'Standard farm dispatch'}</p>
          </div>
        </div>
      </div>

      {/* Return to shop button */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-xs transition-colors shadow-sm"
        >
          <span>Continue Shopping Fresh Harvest</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
