"use client";

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import SlideMenu from "./SlideMenu"; // <--- Import the new component

export default function Navbar() {
  const { getCartCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // New State for Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? getCartCount() : 0;

  return (
    <>
      {/* Pass state and close handler to the SlideMenu */}
      <SlideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 bg-transparent border-b border-white/20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* LEFT: Menu Trigger -> ADD onClick HERE */}
          <button 
            onClick={() => setIsMenuOpen(true)} // <--- Triggers the menu
            className="flex items-center gap-2 text-black hover:text-primary/80 transition"
          >
            <Menu className="w-6 h-6" /> {/* Made icon slightly bigger to match UI */}
            <span className=" font-sans text-xs text-black tracking-wide">MENU</span>
          </button>

          {/* CENTER: Logo */}
          <Link href="/" className="text-xl font-sans font-medium text-primary tracking-tight">
            Imani Treats
          </Link>

          {/* RIGHT: Cart */}
          <Link href="/cart" className="flex relative group items-center text-black  hover:text-primary transition-colors gap-[3px]">
            <span className="text-sm uppercase">Bag</span>
                
                
                {/* Badge */}
                {count > 0 && (
                  <span >
                   ({count})
                  </span>
                )}

                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Link>
          
        </div>
      </nav>
    </>
  );
}