"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoveLeft, Lock, Loader2, CheckCircle2, Truck, Store, CreditCard, Banknote, MapPin } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // --- DATABASE DATA STATES ---
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [storeAddress, setStoreAddress] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- FORM STATES ---
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", state: "", address: "" 
  });
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'pay_later'>('online');
  
  // --- SUBMISSION STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // --- FETCH ZONES & SETTINGS ON MOUNT ---
  useEffect(() => {
    setMounted(true);
    if (cart.length === 0 && !successData) {
      router.push("/cart");
      return;
    }

    async function fetchCheckoutData() {
      // Fetch Delivery Zones
      const { data: zones } = await supabase.from('delivery_zones').select('*').order('state_name');
      if (zones) {
        setDeliveryZones(zones);
        if (zones.length > 0) setFormData(prev => ({ ...prev, state: zones[0].state_name })); // Default first state
      }

      // Fetch Store Settings
      const { data: settings } = await supabase.from('store_settings').select('pickup_address').single();
      if (settings) setStoreAddress(settings.pickup_address);

      setIsLoadingData(false);
    }

    fetchCheckoutData();
  }, [cart.length, successData, router]);

  if (!mounted) return null;

  // --- CALCULATIONS ---
  const subtotal = getTotal();
  const selectedZone = deliveryZones.find(z => z.state_name === formData.state);
  const deliveryFee = deliveryMethod === 'delivery' ? (selectedZone?.fee || 0) : 0;
  const totalAmount = subtotal + deliveryFee;

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCode = (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const isOnline = paymentMethod === 'online';
      const trackingCode = generateCode('TRK');
      const reservationCode = isOnline ? null : generateCode('RSV');

      // 1. Save to Supabase first (defaults to pending_payment or reserved)
      const { data, error } = await supabase.from('orders').insert([
        {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          items: cart,
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'delivery' ? formData.address : storeAddress,
          delivery_state: deliveryMethod === 'delivery' ? formData.state : null,
          delivery_fee: deliveryFee,
          payment_method: paymentMethod,
          total_amount: totalAmount,
          status: isOnline ? 'pending_payment' : 'reserved', 
          tracking_code: trackingCode,
          reservation_code: reservationCode
        }
      ]).select().single();

      if (error) throw error;

      // 2. HANDLE NEXT STEPS BASED ON PAYMENT METHOD
      if (!isOnline) {
        // --- PAY LATER FLOW ---
        // Send Reservation Email
        await fetch('/api/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            customerName: formData.name,
            emailType: 'reservation',
            orderDetails: data
          })
        });

        setSuccessData(data);
        clearCart();
        setIsSubmitting(false);

      } else {
        // --- PAY ONLINE FLOW (PAYSTACK) ---
        // Dynamically import Paystack to prevent Next.js server-side errors
        const PaystackPop = (await import('@paystack/inline-js')).default;
        const paystack = new PaystackPop();

        paystack.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email: formData.email,
          amount: totalAmount * 100, // Paystack requires the amount in Kobo (multiply by 100)
          reference: trackingCode, // We use your generated tracking code as the official reference
          onSuccess: async () => {
            // 1. Payment worked! Update database status to 'paid'
            await supabase.from('orders').update({ status: 'paid' }).eq('id', data.id);

            // 2. Send the confirmation email
            await fetch('/api/emails', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: formData.email,
                customerName: formData.name,
                emailType: 'confirmation',
                orderDetails: data
              })
            });

            // 3. Complete checkout
            setSuccessData(data);
            clearCart();
            setIsSubmitting(false);
          },
          onCancel: () => {
            setErrorMsg("Payment window was closed. Please try again.");
            setIsSubmitting(false);
          }
        });
      }

    } catch (error: any) {
      console.error("Order error:", error.message);
      setErrorMsg("Something went wrong saving your order. Please try again.");
      setIsSubmitting(false);
    } 
    // Note: We removed the 'finally' block here so setIsSubmitting doesn't 
    // turn off while the Paystack window is still open!
  };

  // --- SUCCESS SCREEN ---
  if (successData) {
    const isPayLater = successData.payment_method === 'pay_later';
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center pt-24 pb-12 px-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-4xl font-serif text-primary italic mb-2">
          {isPayLater ? "Order Reserved!" : "Order Placed Successfully!"}
        </h1>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          Thank you, {successData.customer_name}. 
          {isPayLater 
            ? " We have reserved your items. We will contact you shortly to confirm." 
            : " Your payment is pending/confirmed. We have emailed you your receipt."}
        </p>

        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8 max-w-sm w-full space-y-4 shadow-sm text-left">
          <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking Code</p>
             <p className="font-mono text-lg text-primary bg-gray-50 p-2 rounded text-center font-bold tracking-widest">{successData.tracking_code}</p>
          </div>
          {isPayLater && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reservation Code</p>
              <p className="font-mono text-lg text-orange-600 bg-orange-50 p-2 rounded text-center font-bold tracking-widest">{successData.reservation_code}</p>
            </div>
          )}
        </div>

        <Link href="/" className="bg-primary text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-lg">
          Return to Home
        </Link>
      </div>
    );
  }

  // --- CHECKOUT SCREEN ---
  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 md:pt-32 pb-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors mb-6">
            <MoveLeft className="w-4 h-4 mr-1" /> Back to Bag
          </Link>
          <h1 className="text-4xl font-serif text-primary italic">Secure Checkout</h1>
        </div>

        {isLoadingData ? (
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT: FORM (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 text-sm p-4 rounded-md border border-red-100">{errorMsg}</div>
                )}

                {/* 1. CONTACT INFO */}
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-5">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">Contact Details</h2>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Jane Doe" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number <span className="text-orange-500 lowercase normal-case ml-1 font-normal">(WhatsApp pref.)</span></label>
                      <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="+234 800 000 0000" />
                    </div>
                  </div>
                </div>

                {/* 2. DELIVERY OPTIONS */}
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">Delivery Method</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Pickup Toggle */}
                    <button type="button" onClick={() => setDeliveryMethod('pickup')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                      <Store className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">Self Pickup</span>
                    </button>
                    {/* Delivery Toggle */}
                    <button type="button" onClick={() => setDeliveryMethod('delivery')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                      <Truck className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">Delivery</span>
                    </button>
                  </div>

                  {/* Dynamic Fields based on Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                    {deliveryMethod === 'pickup' ? (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 uppercase mb-1">Store Address</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{storeAddress || "Loading address..."}</p>
                          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Free of charge</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select State</label>
                          <select required name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-md outline-none">
                            <option value="" disabled>Choose your state</option>
                            {deliveryZones.map((zone) => (
                              <option key={zone.id} value={zone.state_name}>{zone.state_name} - ₦{zone.fee.toLocaleString()}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Delivery Address</label>
                          <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-md outline-none resize-none" placeholder="123 Example Street, City..." />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. PAYMENT OPTIONS */}
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pay Online */}
                    <button type="button" onClick={() => setPaymentMethod('online')} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className={`p-2 rounded-full ${paymentMethod === 'online' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}><CreditCard className="w-4 h-4" /></div>
                      <div>
                        <span className={`block text-xs font-bold uppercase tracking-widest ${paymentMethod === 'online' ? 'text-primary' : 'text-gray-500'}`}>Pay Online</span>
                        <span className="text-[10px] text-gray-400">Card, Transfer, USSD</span>
                      </div>
                    </button>
                    {/* Pay Later */}
                    <button type="button" onClick={() => setPaymentMethod('pay_later')} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'pay_later' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className={`p-2 rounded-full ${paymentMethod === 'pay_later' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}><Banknote className="w-4 h-4" /></div>
                      <div>
                        <span className={`block text-xs font-bold uppercase tracking-widest ${paymentMethod === 'pay_later' ? 'text-primary' : 'text-gray-500'}`}>Pay Later</span>
                        <span className="text-[10px] text-gray-400">Pay on {deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                      </div>
                    </button>
                  </div>
                </div>

              </form>
            </div>

            {/* RIGHT: ORDER SUMMARY (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm sticky top-32">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-sm text-primary leading-tight">{item.name}</h3>
                        {item.variant && <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">{item.variant}</p>}
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-8">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{deliveryMethod === 'pickup' ? 'Pickup Fee' : 'Delivery Fee'}</span>
                    <span>{deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif text-primary italic pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full bg-btn text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Lock className="w-4 h-4" /> {paymentMethod === 'online' ? `Pay ₦${totalAmount.toLocaleString()}` : 'Reserve Order'}</>}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}