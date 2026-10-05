import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { CafeProduct } from '../data/cafeData';
import { SmartImage } from './SmartImage';

export interface CartItem {
  cartItemId: string;
  product: CafeProduct;
  quantity: number;
  selectedOptions: Record<string, { id: string; name: string; priceDelta: number }>;
  specialNote: string;
  unitPrice: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

const FREE_DELIVERY_THRESHOLD = 35.0;
const COURIER_FEE = 4.5;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [fulfillmentMode, setFulfillmentMode] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupWindow, setPickupWindow] = useState('In 15 mins (Express Bar)');
  const [paymentMethod, setPaymentMethod] = useState<'counter' | 'card'>('counter');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    items: CartItem[];
    total: number;
    fulfillmentMode: 'pickup' | 'delivery';
    pickupWindow: string;
    customerName: string;
    address: string;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const qualifiesFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCost =
    fulfillmentMode === 'pickup' ? 0 : qualifiesFreeDelivery ? 0 : COURIER_FEE;
  const grandTotal = subtotal + deliveryCost;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError('Please enter your full name for order verification.');
      return;
    }
    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      setFormError('Please enter a valid mobile number (at least 7 digits) for SMS ready alerts.');
      return;
    }
    if (fulfillmentMode === 'delivery') {
      if (!deliveryAddress.trim() || !postalCode.trim()) {
        setFormError('Please enter your street address and postal code for bicycle courier dispatch.');
        return;
      }
    }

    const randomNum = Math.floor(1040 + Math.random() * 8900);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConfirmedOrder({
      orderNumber: `SR-${randomNum}`,
      items: [...items],
      total: grandTotal,
      fulfillmentMode,
      pickupWindow,
      customerName: customerName.trim(),
      address:
        fulfillmentMode === 'pickup'
          ? '412 NW Flanders St, Pearl District (Express Counter)'
          : `${deliveryAddress.trim()}, ${postalCode.trim()}`,
      timestamp: nowStr,
    });
    onClearCart();
  };

  const handleResetAndClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Order bag and checkout"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-lg bg-[#F9F9F8] h-full flex flex-col justify-between border-l border-stone-300/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200/90 flex items-center justify-between bg-[#F9F9F8]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#141413]">
              {confirmedOrder ? 'Order Confirmation' : 'Order Bag & Fulfillment'}
            </h2>
            <p className="text-xs text-[#575753] mt-0.5">
              {confirmedOrder
                ? `Dispatched to Roastery Bar at ${confirmedOrder.timestamp}`
                : 'Freshly prepared at 412 NW Flanders St · Zero service fees'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close order drawer"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-200/60 text-[#141413] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {confirmedOrder ? (
            <div className="bg-[#F1F1EE] border border-stone-300/90 rounded-xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#1B4332] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono text-[#1B4332] font-medium">
                    Order #{confirmedOrder.orderNumber} Confirmed — Preparing Order
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#141413] mt-0.5">
                    Thank you, {confirmedOrder.customerName}
                  </h3>
                  <p className="text-xs text-[#575753] mt-1 leading-relaxed">
                    {confirmedOrder.fulfillmentMode === 'pickup'
                      ? `Our head barista has queued your order for ${confirmedOrder.pickupWindow}. Proceed directly to the monolithic limestone hand-pour bar upon arrival.`
                      : 'Our local e-cargo courier has received your dispatch ticket and will deliver insulated directly to your door.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-300/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#575753]">Fulfillment Location:</span>
                  <span className="text-[#141413] font-medium text-right">
                    {confirmedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#575753]">Payment Terms:</span>
                  <span className="text-[#141413] font-medium">
                    {paymentMethod === 'counter'
                      ? 'Pay at Counter / Cash or Tap on Handover'
                      : 'Pre-Authorized Contactless'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-300/80 space-y-3">
                <div className="text-xs font-semibold text-[#141413]">Itemized Receipt</div>
                {confirmedOrder.items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-xs gap-4">
                    <div>
                      <span className="font-medium text-[#141413]">
                        {item.quantity}× {item.product.name}
                      </span>
                      <div className="text-[#575753] text-[11px]">
                        {Object.values(item.selectedOptions)
                          .map((o) => o.name)
                          .join(' · ')}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-[#141413] shrink-0">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-stone-300/80 flex justify-between items-baseline text-sm font-semibold text-[#141413]">
                  <span>Total Amount Due</span>
                  <span className="font-mono tabular-nums text-base">
                    ${confirmedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 bg-[#1B4332] hover:bg-[#133124] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Return to Sorel Roastery
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="font-display text-2xl text-[#141413]">Your order bag is empty</p>
              <p className="text-xs text-[#575753] max-w-xs mx-auto leading-relaxed">
                Explore our seasonal single-origin V60 pour-overs, morning sourdough viennoiserie,
                or whole-bean micro-lot boxes.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#141413] text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span>Browse Daily Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Fulfillment Mode Selector */}
              <div className="bg-[#F1F1EE] p-1 rounded-lg grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setFulfillmentMode('pickup')}
                  className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    fulfillmentMode === 'pickup'
                      ? 'bg-white text-[#141413] shadow-xs'
                      : 'text-[#575753] hover:text-[#141413]'
                  }`}
                >
                  Cafe Express Pickup (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentMode('delivery')}
                  className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    fulfillmentMode === 'delivery'
                      ? 'bg-white text-[#141413] shadow-xs'
                      : 'text-[#575753] hover:text-[#141413]'
                  }`}
                >
                  Local Bicycle Courier
                </button>
              </div>

              {/* Free Delivery Threshold Notice */}
              {fulfillmentMode === 'delivery' && (
                <div className="p-3.5 rounded-lg bg-[#F1F1EE] border border-stone-200/90 text-xs text-[#383835]">
                  {qualifiesFreeDelivery ? (
                    <span className="text-[#1B4332] font-medium">
                      Complimentary insulated courier delivery unlocked (orders $35.00+).
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong className="font-mono tabular-nums text-[#141413]">
                        ${remainingForFreeDelivery.toFixed(2)}
                      </strong>{' '}
                      more for complimentary bicycle courier delivery (currently $
                      {COURIER_FEE.toFixed(2)} flat fee).
                    </span>
                  )}
                </div>
              )}

              {/* Itemized List */}
              <div className="divide-y divide-stone-200/90 border-t border-b border-stone-200/90">
                {items.map((item) => (
                  <div key={item.cartItemId} className="py-4 flex gap-3.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#EFEFED] shrink-0">
                      <SmartImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#141413] leading-snug">
                          {item.product.name}
                        </h3>
                        <span className="font-mono text-sm font-medium text-[#141413] tabular-nums shrink-0">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="text-xs text-[#575753] mt-1 space-y-0.5">
                        <div>
                          {Object.values(item.selectedOptions)
                            .map((opt) => opt.name)
                            .join(' · ')}
                        </div>
                        {item.specialNote && (
                          <div className="italic text-[#383835]">Note: “{item.specialNote}”</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-stone-300 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#141413] hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#141413] hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-xs text-[#575753] hover:text-red-700 inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Verification & Fulfillment Form */}
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="text-xs font-semibold text-[#141413]">
                  Customer Verification & Handover Details
                </div>

                {fulfillmentMode === 'pickup' && (
                  <div>
                    <label
                      htmlFor="pickup-window"
                      className="block text-xs text-[#575753] mb-1"
                    >
                      Target Pickup Window (412 NW Flanders St)
                    </label>
                    <select
                      id="pickup-window"
                      value={pickupWindow}
                      onChange={(e) => setPickupWindow(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#141413] focus:outline-none focus:border-[#1B4332]"
                    >
                      <option value="In 15 mins (Express Bar)">In 15 mins (Express Bar)</option>
                      <option value="In 30 mins">In 30 mins</option>
                      <option value="In 45 mins">In 45 mins</option>
                      <option value="Tomorrow Morning 07:30">Tomorrow Morning 07:30</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cust-name" className="block text-xs text-[#575753] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Clara Lindqvist"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#141413] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                  <div>
                    <label htmlFor="cust-phone" className="block text-xs text-[#575753] mb-1">
                      Mobile Number (SMS Alert) *
                    </label>
                    <input
                      id="cust-phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(503) 555-0194"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#141413] font-mono tabular-nums focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                </div>

                {fulfillmentMode === 'delivery' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="cust-address" className="block text-xs text-[#575753] mb-1">
                        Street Address & Suite *
                      </label>
                      <input
                        id="cust-address"
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="920 NW Kearney St, Apt 4B"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#141413] focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                    <div>
                      <label htmlFor="cust-zip" className="block text-xs text-[#575753] mb-1">
                        Postal Code *
                      </label>
                      <input
                        id="cust-zip"
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="97209"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#141413] font-mono tabular-nums focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <span className="block text-xs text-[#575753] mb-1.5">Payment Settlement</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('counter')}
                      className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors ${
                        paymentMethod === 'counter'
                          ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#141413] font-medium'
                          : 'border-stone-300 bg-white text-[#575753]'
                      }`}
                    >
                      Pay on Pickup / Delivery (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#141413] font-medium'
                          : 'border-stone-300 bg-white text-[#575753]'
                      }`}
                    >
                      Express Apple / Card Tap
                    </button>
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-red-700 font-medium" role="alert">
                    {formError}
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer Totals & Submit */}
        {!confirmedOrder && items.length > 0 && (
          <div className="p-6 border-t border-stone-200/90 bg-[#F1F1EE] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#575753]">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono tabular-nums text-[#141413]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#575753]">
                <span>
                  {fulfillmentMode === 'pickup'
                    ? 'Pearl District Bar Pickup'
                    : 'Insulated Bicycle Courier'}
                </span>
                <span className="font-mono tabular-nums text-[#141413]">
                  {deliveryCost === 0 ? 'Free' : `$${deliveryCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#141413] pt-2 border-t border-stone-300/80">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3 px-5 bg-[#1B4332] hover:bg-[#133124] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm & Send to Barista</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">${grandTotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
