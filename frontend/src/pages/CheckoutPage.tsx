import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi, CreateOrderPayload } from '../api/orders';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  Lock,
  ChevronLeft
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, total, clearCart, validateCartWithServer } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState(
    user ? `${user.first_name} ${user.last_name}`.trim() || user.username : ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [address, setAddress] = useState(user?.profile?.address || '');
  const [city, setCity] = useState(user?.profile?.city || 'Lahore');
  const [postalCode, setPostalCode] = useState(user?.profile?.postal_code || '');
  const [instructions, setInstructions] = useState(user?.profile?.delivery_notes || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'card_simulation'>('cash_on_delivery');
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'evening'>('morning');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(`${user.first_name} ${user.last_name}`.trim() || user.username);
      if (!email) setEmail(user.email);
      if (!phone && user.profile?.phone) setPhone(user.profile.phone);
      if (!address && user.profile?.address) setAddress(user.profile.address);
      if (user.profile?.city) setCity(user.profile.city);
    }
  }, [user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please provide your full name for delivery.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('A valid email address is required for order confirmation.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Please provide a valid phone number for the delivery courier.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please provide your complete shipping street address.');
      return;
    }

    if (paymentMethod === 'card_simulation') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setErrorMessage('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry) {
        setErrorMessage('Please enter card expiry date (MM/YY).');
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setErrorMessage('Please enter valid CVC security code.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Validate live cart with server first
      const validation = await validateCartWithServer();
      if (validation && !validation.is_valid) {
        setErrorMessage('Some items in your cart had stock or price adjustments. Please review before proceeding.');
        setIsSubmitting(false);
        return;
      }

      // 2. Generate unique idempotency key
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const payload: CreateOrderPayload = {
        customer_name: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        shipping_address: address.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        delivery_instructions: `${deliverySlot === 'morning' ? '[Morning Slot: 7am-11am]' : '[Evening Slot: 4pm-8pm]'} ${instructions.trim()}`,
        payment_method: paymentMethod,
        idempotency_key: idempotencyKey,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await ordersApi.createOrder(payload);

      // Clear local cart
      clearCart();
      addToast(`Order #${createdOrder.order_number} confirmed! Thank you!`, 'success');

      // Navigate to confirmation page
      navigate(`/order-confirmation/${createdOrder.order_number}`, {
        state: { order: createdOrder },
      });
    } catch (err: any) {
      console.error('Order creation error', err);
      const serverErr =
        err.response?.data?.items ||
        err.response?.data?.detail ||
        'Unable to process order. Please verify your items and try again.';
      setErrorMessage(typeof serverErr === 'string' ? serverErr : JSON.stringify(serverErr));
      addToast('Order submission failed. Please check requirements.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#62ab00] mb-2 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#203a27] font-display">
            Secure Organic Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Lock className="w-4 h-4 text-[#62ab00]" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block mb-0.5">Please check the following error:</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2-Column Checkout Layout */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Recipient Contact Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#62ab00] text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Recipient Contact Information</span>
            </h2>

            {!isAuthenticated && (
              <p className="text-xs text-stone-500">
                Already have an account? <Link to="/login" className="text-[#62ab00] font-semibold hover:underline">Log in</Link> for faster checkout.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Ali"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="fatima@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">For courier delivery arrival coordination.</span>
              </div>
            </div>
          </div>

          {/* 2. Delivery Address & Slot */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#62ab00] text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Farm Delivery Address</span>
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address & House / Flat # <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="House 12, Street 4, Sector F, DHA Phase 5"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="54000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                  />
                </div>
              </div>

              {/* Delivery Window Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Harvest Dispatch Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliverySlot('morning')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      deliverySlot === 'morning'
                        ? 'border-[#62ab00] bg-emerald-50/50 text-[#203a27]'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="font-bold text-xs">Morning Dispatch</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">7:00 AM - 11:00 AM (Recommended)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySlot('evening')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      deliverySlot === 'evening'
                        ? 'border-[#62ab00] bg-emerald-50/50 text-[#203a27]'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="font-bold text-xs">Evening Dispatch</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">4:00 PM - 8:00 PM</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Landmark or Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Near Gate 2, ring the bell on the left..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#62ab00]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#62ab00] text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3 pt-2">
              {/* Cash on Delivery (COD) */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#62ab00] bg-emerald-50/50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 text-[#62ab00] focus:ring-[#62ab00]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <Banknote className="w-4 h-4 text-[#62ab00]" />
                    <span>Cash on Delivery (COD)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Popular</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Pay in cash or bank transfer directly to the farm courier when your fresh crate is delivered.
                  </p>
                </div>
              </label>

              {/* Online Card Simulation */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card_simulation'
                    ? 'border-[#62ab00] bg-emerald-50/50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card_simulation'}
                  onChange={() => setPaymentMethod('card_simulation')}
                  className="mt-1 text-[#62ab00] focus:ring-[#62ab00]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <CreditCard className="w-4 h-4 text-[#62ab00]" />
                    <span>Credit / Debit Card (Online Demo Gateway)</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Direct instant card processing with 256-bit sandbox verification.
                  </p>

                  {paymentMethod === 'card_simulation' && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4242 •••• •••• 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6 sticky top-28">
          <h2 className="text-lg font-bold text-stone-900 font-display border-b border-stone-100 pb-4">
            Items in Order ({cart.reduce((a, c) => a + c.quantity, 0)})
          </h2>

          <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="py-3 flex items-center gap-3">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-stone-900 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-stone-400">
                    {item.quantity} × Rs. {item.product.current_price} ({item.product.unit})
                  </p>
                </div>
                <span className="font-bold text-xs text-[#203a27] font-sans">
                  Rs. {(parseFloat(item.product.current_price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-[#62ab00] font-bold">FREE DELIVERY</span>
                ) : (
                  <span className="font-bold text-stone-900">Rs. {deliveryFee.toLocaleString()}</span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#203a27] pt-3 border-t border-stone-200 font-sans">
              <span>Total Payable</span>
              <span className="text-xl text-[#62ab00]">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#62ab00] hover:bg-[#518e00] text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Order with Database...</span>
              </>
            ) : (
              <>
                <span>Place Order (Rs. {total.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-[11px] text-stone-400 space-y-1.5 pt-2">
            <p className="flex items-center gap-1.5 text-stone-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#62ab00]" />
              Safe Database Inventory Reservation
            </p>
            <p>Order totals and stock are calculated and secured in PostgreSQL transactional storage.</p>
          </div>
        </div>
      </form>
    </div>
  );
};
