"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Info, MapPin, Smile } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import SlideMenu from "./SlideMenu"; 
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { getCartCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const pathname = usePathname();

  // --- NEW: DRAWER STATES ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'about' | 'where' | 'fun' | null>(null);
  const [siteContent, setSiteContent] = useState({ about: "", where: "", fun: "" });

  useEffect(() => {
    setMounted(true);
    
    // Fetch the dynamic content in the background
    async function fetchContent() {
      const { data } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      if (data) {
        setSiteContent({
          about: data.about_content || "Welcome to Imani Treats!",
          where: data.where_to_buy_content || "Catch our drops every Saturday!",
          fun: data.fun_content || "We bake with love."
        });
      }
    }
    fetchContent();
  }, []);

  if (pathname.startsWith("/admin")) {
    return null; 
  }

  const count = mounted ? getCartCount() : 0;

  // Helper to open the drawer
  const openDrawer = (type: 'about' | 'where' | 'fun') => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  // Dynamic Content for the Drawer based on what they clicked
  const drawerConfig = {
    about: { title: "About Us", icon: Info, text: siteContent.about },
    where: { title: "Where to Buy", icon: MapPin, text: siteContent.where },
    fun: { title: "Fun Facts", icon: Smile, text: siteContent.fun }
  };

  const activeContent = drawerType ? drawerConfig[drawerType] : null;

  return (
    <>
      {/* Pass state and close handler to the SlideMenu */}
      <SlideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} openDrawer={openDrawer} />

      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 bg-transparent border-b border-white/20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* LEFT: Menu Trigger */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="flex md:hidden items-center gap-2 text-black hover:text-primary/80 transition"
          >
            <Menu className="w-6 h-6" /> 
            <span className=" font-sans text-xs text-black tracking-wide">MENU</span>
          </button>

          {/* CENTER: Logo */}
          <Link href="/" className="text-xl md:text-2xl font-sans font-medium text-primary tracking-tight">
            Imani Treats
          </Link>

          <div className="hidden md:flex flex-1 justify-center items-center gap-6">
            <Link href="/products" className="font-sans text-md font-bold text-black tracking-widest uppercase hover:text-primary/80 transition">
              Products
            </Link>
            
            {/* Swapped Links to Buttons, kept your exact CSS classes! */}
            <button onClick={() => openDrawer('about')} className="font-sans text-md font-bold text-black tracking-widest uppercase hover:text-primary/80 transition">
              About
            </button>
            <button onClick={() => openDrawer('where')} className="font-sans text-md font-bold text-black tracking-widest uppercase hover:text-primary/80 transition">
              Where to Buy
            </button>
            <button onClick={() => openDrawer('fun')} className="font-sans text-md font-bold text-black tracking-widest uppercase hover:text-primary/80 transition">
              Fun
            </button>
          </div>

          {/* RIGHT: Cart */}
          <Link href="/cart" className="flex relative group items-center hover:text-primary transition-colors gap-[3px]">
            <span className="text-xs md:text-lg uppercase">Bag </span>
                {/* Badge */}
                {count > 0 && (
                  <span className="text-xs md:text-lg">
                   ({count})
                  </span>
                )}
            <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
          
        </div>
      </nav>

      {/* --- SLIDE-OVER DRAWER COMPONENT --- */}
      {/* 1. The dark background overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsDrawerOpen(false)} 
        />
      )}

      {/* 2. The actual sliding panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {activeContent && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3 text-primary">
                <activeContent.icon className="w-6 h-6" />
                <h2 className="text-xl font-serif font-bold">{activeContent.title}</h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-8 overflow-y-auto text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
              {activeContent.text}
            </div>
            
            {/* Drawer Footer / Call to Action */}
            <div className="p-6 border-t border-gray-100 mt-auto">
              <Link 
                href="/products" 
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-btn text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 text-xs uppercase tracking-widest"
              >
                Shop the Drop
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}