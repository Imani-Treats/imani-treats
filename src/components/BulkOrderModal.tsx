"use client";

import { X, Mail, MessageCircle } from "lucide-react"; // Removed Instagram icon
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkOrderModal({ isOpen, onClose }: BulkOrderModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all scale-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-serif text-primary italic mb-2">Big Plans?</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Planning a corporate event, wedding, or just really hungry? 
            Reach out directly for custom bulk orders.
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-4">
          
          {/* Email */}
          <a 
            href="mailto:hello@imanitreats.com?subject=Bulk Order Inquiry"
            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:bg-orange-50/50 transition-all group"
          >
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email Us</span>
              <span className="font-serif text-lg text-primary">hello@imanitreats.com</span>
            </div>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/2348123456789" 
            target="_blank"
            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-green-500/30 hover:bg-green-50/50 transition-all group"
          >
            <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">WhatsApp</span>
              <span className="font-serif text-lg text-primary">+234 812 345 6789</span>
            </div>
          </a>

          {/* TikTok (Replaced Instagram) */}
          <a 
            href="https://tiktok.com/@imani.treats" 
            target="_blank"
            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-black/30 hover:bg-gray-50 transition-all group"
          >
            {/* Icon Container: Using neutral gray/black for TikTok brand */}
            <div className="bg-gray-100 p-3 rounded-full transition-colors flex items-center justify-center group-hover:bg-gray-200">
              <div className="relative w-5 h-5">
                <Image
                  src="/images/tiktok.svg" 
                  alt="TikTok"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">DM on TikTok</span>
              <span className="font-serif text-lg text-primary">@imani.treats</span>
            </div>
          </a>

        </div>

        <div className="mt-8 text-center">
          <button onClick={onClose} className="text-xs text-gray-400 underline hover:text-primary">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}