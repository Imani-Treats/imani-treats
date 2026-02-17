"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 1. Backdrop (Click to close) */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* 2. The Menu Content (Sliding Panel) */}
      <div
        className={`relative w-full md:w-[500px] h-full bg-primary text-white p-8 md:p-12 flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-row justify-between border">
                  {/* Close Button */}
          <span>
            <button onClick={onClose} className="absolute top-8 left-8 text-white/60 hover:text-white transition-colors" >
            <X className="w-8 h-8 font-light" />
          </button>
        </span>
 
        <span>
          <div className="relative w-32 h-32">
          <Image
            src="/images/logo.png" 
            alt="TikTok"
            fill
            className="object-contain"
          />
          </div>

        </span>
        
        </div>


        {/* Menu Links Container */}
        <div className="flex flex-col h-full space-y-10 pt-30 pl-2">
          
          {/* Label */}
          <span className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-2">
            [Navigation]
          </span>

          {/* Links List */}
          <nav className="flex flex-col gap-8">
            <MenuLink href="/products" label="Products" onClick={onClose} isCaps/>
            {/* <MenuLink href="#products" label="Recipes" onClick={onClose} isCaps /> */}
            <MenuLink href="#" label="About" onClick={onClose} isCaps />
            <MenuLink href="#" label="Where to Buy" onClick={onClose} isCaps/>
            <MenuLink href="#" label="fun" onClick={onClose} isCaps/>
          </nav>

        </div>
      </div>
    </div>
  );
}

// Helper Component for the links to ensure consistent styling
function MenuLink({ href, label, onClick, isCaps = false }: { href: string; label: string; onClick: () => void; isCaps?: boolean }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`font-serif text-5xl md:text-6xl text-white hover:text-orange-400 transition-colors duration-300 italic ${
        isCaps ? "uppercase" : ""
      }`}
    >
      {label}
    </Link>
  );
}