"use client";

import Link from "next/link";
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
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 left-8 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-8 h-8 font-light" />
        </button>

        {/* Menu Links Container */}
        <div className="flex flex-col justify-center h-full space-y-10 pl-4">
          
          {/* Label */}
          <span className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-2">
            Navigation
          </span>

          {/* Links List */}
          <nav className="flex flex-col gap-6">
            <MenuLink href="/" label="Products" onClick={onClose} />
            <MenuLink href="#products" label="Recipes" onClick={onClose} />
            <MenuLink href="#" label="About" onClick={onClose} isCaps />
            <MenuLink href="#" label="Where to Buy" onClick={onClose} />
            <MenuLink href="#" label="joy" onClick={onClose} />
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