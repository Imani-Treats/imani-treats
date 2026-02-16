"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, total } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-12 px-4 md:px-6 pt-24">
      
      {/* Main Container (mimicking the card look in the UI) */}
      <div className="w-full max-w-2xl bg-white shadow-sm rounded-lg overflow-hidden min-h-[80vh] flex flex-col relative">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h1 className="text-3xl font-serif text-primary italic">
            Reservation Bag
          </h1>
          <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </Link>
        </div>

        {/* --- CART ITEMS LIST --- */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <span className="text-6xl">🥐</span>
              <p className="font-serif text-xl">Your reservation bag is empty</p>
              <Link href="/products" className="text-sm underline hover:text-orange-600">
                Browse the Lineup
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.variant}`} className="flex gap-6 items-center">
                {/* Image */}
                <div className="relative w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-primary">{item.name}</h3>
                  
                  {/* Variant (Optional) */}
                  {item.variant && (
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1 mb-1">
                      {item.variant}
                    </p>
                  )}

                  {/* Quantity x Price */}
                  <p className="text-xs text-gray-400 font-medium">
                    {item.quantity} <span className="mx-1">×</span> ₦{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id, item.variant)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* --- FOOTER SUMMARY --- */}
        {cart.length > 0 && (
          <div className="p-8 bg-gray-50 border-t border-gray-100">
            
            {/* Subtotal Line */}
            <div className="flex items-end justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Subtotal
              </span>
              <span className="text-4xl font-serif text-primary italic">
                ₦{total().toLocaleString()}
              </span>
            </div>

            {/* Note */}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-8">
              Pick up only • Sat 9:00 - 12:00PM
            </p>

            {/* Checkout Button */}
            <Link href="/checkout" className="block w-full">
              <button className="w-full bg-btn text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 uppercase tracking-wider text-sm">
                Check Out <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}