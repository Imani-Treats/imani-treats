"use client";

import SocialIcon from "./socialmedia";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { Facebook, Instagram, Youtube, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        
        {/* Left Column: Brand & Socials */}
        <div className="space-y-6 md:w-1/2">
          <h2 className="text-4xl font-serif">Imani Treats</h2>
          <p className="text-white/80 text-sm md:text-lg leading-relaxed max-w-md">
            “Small batches, fresh ingredients and the patience to get every detail right. Our microbakery works on a strict drop schedule, crafting each treat by hand so every bite is as fresh and satisfying as it should be.”
          </p>
          
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Youtube className="w-5 h-5" />} href="#" />
          </div>
        </div>

        {/* Right Column: Newsletter */}
        <div className="space-y-6 md:w-1/3">
          <h3 className="text-lg md:text-xl font-bold font-serif tracking-wide">
            Weekly Newsletter
          </h3>
          <p className="text-white/60 text-xs md:text-lg">
            Join over 1000+ customers to get notified about the next drop before it sells out.
          </p>
          
          <WaitlistForm />
        </div>
      </div>

      {/* Bottom Bar: Contact Info */}
      <div className="mt-10 pt-8 border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-sm tracking-widest text-white/60 uppercase">
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
      <div className="w-fit mx-auto mt-5">
        <Link href="https://nenshallom.netlify.app/" target="blank" className="text-xs text-blue-500/50">Built By NSG</Link>
      </div>
    </footer>
  );
}

