"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ArrowRight, Minus, Plus } from "lucide-react"; // <--- Added Plus/Minus
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function CartPage() {
  // 1. UPDATED: Destructure 'getTotal' and 'updateQuantity'
  const { cart, removeFromCart, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-12 px-4 md:px-6 pt-24">
      
      {/* Main Container */}
      <div className="w-full max-w-2xl bg-white shadow-sm rounded-lg overflow-hidden min-h-[80vh] flex flex-col relative">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h1 className="text-2xl font-serif text-primary italic">
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
                  <h3 className="font-serif text-sm text-primary">{item.name}</h3>
                  
                  {/* Variant */}
                  {item.variant && (
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1 mb-2">
                      {item.variant}
                    </p>
                  )}

                  {/* Quantity Controls & Price */}
                  <div className="flex items-center gap-4">
                    {/* Plus/Minus Buttons */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variant)}
                        className="p-1 hover:text-black text-gray-400 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="text-xs font-bold w-3 text-center">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                        className="p-1 hover:text-black text-gray-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 font-medium">
                       x ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id, item.variant)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* --- FOOTER SUMMARY --- */}
        {cart.length > 0 && (
          <div className="p-8 bg-gray-50 border-t border-gray-100 pt-19">
            
            {/* Subtotal Line */}
            <div className="flex items-end justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Subtotal
              </span>
              {/* 2. UPDATED: Use getTotal() function */}
              <span className="text-2xl font-serif text-primary italic">
                ₦{getTotal().toLocaleString()}
              </span>
            </div>

            {/* Note */}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-8">
              Pick up only • Sat 9:00 - 12:00PM
            </p>

            {/* Checkout Button */}
            <Link href="/checkout" className="block w-full">
              <button className="w-full bg-btn text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 uppercase tracking-wider text-sm">
                Check Out <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}