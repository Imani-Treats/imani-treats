"use client";

import SocialIcon from "./socialmedia";
import { Facebook, Instagram, Youtube, ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        
        {/* Left Column: Brand & Socials */}
        <div className="space-y-6 md:w-1/2">
          <h2 className="text-4xl font-serif italic">Imani Treats</h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-sm">
            “Small batches, wild yeast, and enough time
            to let the flavor develop naturally. Our 
            Phoenix micro-bakery operates on a strict
            drop schedule to ensure every loaf is prefect.”
          </p>
          
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Youtube className="w-5 h-5" />} href="#" />
          </div>
        </div>

        {/* Right Column: Newsletter */}
        <div className="space-y-6 md:w-1/3">
          <h3 className="text-lg font-bold font-serif tracking-wide">
            Weekly Newsletter
          </h3>
          <p className="text-white/60 text-xs">
            Join over 1000+ customers to get notified about the next drop before it sells out.
          </p>
          
          <form className="flex items-center border-b border-white/30 py-2">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-sm"
            />
            <button type="button" className="text-white hover:text-orange-400 transition">
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar: Contact Info */}
      <div className="mt-10 pt-8 border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] tracking-widest text-white/60 uppercase">
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Bauchi</span>
          </div>
          <div >|</div>
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>090 0000 0000</span>
          </div>
      </div>
        <div className="hidden md:block">|</div>
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" />
          <span>imanitreatsng@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}

