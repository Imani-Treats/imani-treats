"use client";

import Link from "next/link";
import Image from "next/image";
import WaitlistForm from "@/components/WaitlistForm";
import { Clock } from 'lucide-react';
import { useCountdown } from "@/hooks/useCountdown";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  motion, 
  useAnimationFrame, 
  useMotionValue, 
  useTransform, 
  useSpring,
  useMotionValueEvent,
  PanInfo
} from "framer-motion";
import BulkOrderModal from "@/components/BulkOrderModal";

export default function Hero() {
  // 1. Calculate the next Saturday dynamically
  const [targetDate, setTargetDate] = useState<string>("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);


  useEffect(() => {
    async function fetchGlobalDropDate() {
      const { data, error } = await supabase
        .from('store_settings')
        .select('next_drop_date')
        .eq('id', 1)
        .single();
        
      if (data?.next_drop_date && !error) {
        setTargetDate(data.next_drop_date);
      }
    }
    
    fetchGlobalDropDate();
  }, []);

  // 2. Use the dynamic date
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <>
    <section className="relative w-full h-screen lg:h-[120vh] flex flex-col pt-40 items-center text-center overflow-hidden ">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg" 
          alt="Artisanal Baking"
          fill
          className="object-cover object-[27%_75%] opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-white/10" /> 
      </div>

      {/* Content */}
      <div className=" w-full relative z-10 flex flex-col items-center">

        {/* Top Label */}
        <div>
          <span className="uppercase font-semibold text-lg text-gray-800 tracking-widest flex items-center justify-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
            <Clock className="w-5 h-5 inline-block text-btn" />
            Next Saturday Drop
          </span>
        </div>
        
        {/* Timer Section */}
        <div className="flex flex-col items-center gap-5 mt-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/90">
            Next Drop In:
          </span>
          <div className="flex gap-4 text-btn font-serif">
            <TimeBox value={days} label="Days" />
            <span className="text-2xl mt-1 opacity-50">:</span>
            <TimeBox value={hours} label="Hrs" />
            <span className="text-2xl mt-1 opacity-50">:</span>
            <TimeBox value={minutes} label="Mins" />
            <span className="text-2xl mt-1 opacity-50">:</span>
            <TimeBox value={seconds} label="Secs" />
          </div>
        </div>

        {/* --- INTERACTIVE MARQUEE HEADING --- */}
        <div className="w-full overflow-hidden py-4 select-none">
          <InteractiveMarquee baseVelocity={-1}>
            Your Cravings<span className="text-btn">, </span> Sorted
          </InteractiveMarquee>
        </div>
        <span className="text-xs md:text-lg font-bold tracking-[0.2em] uppercase text-black">
            We have a flavour for every mood
          </span>
        {/* CTA Button */}
        <div className="w-full max-w-md mt-6">
          <WaitlistForm />
        </div>
        <button 
              onClick={() => setIsBulkOpen(true)}
              className="text-xs md:text-[15px] font-bold uppercase tracking-widest text-primary/70 cursor-pointer hover:text-primary underline decoration-dotted underline-offset-4 hover:scale-105 transition-all mt-2">
              Bulk Orders?
        </button>

      </div>
    </section>
    <BulkOrderModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
    </>
  );
}

// --- SUB-COMPONENTS ---

// 1. The Interactive Marquee Logic (Updated: Removed Drag)
function InteractiveMarquee({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  // const { scrollY } = useSpring(0); 
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll loop
  useAnimationFrame((t, delta) => {
    if (!isPaused) {
      // Calculate move distance based on velocity and time delta (smooth on all refresh rates)
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
      
      if (baseVelocity > 0) {
        directionFactor.current = 1;
      } 
      
      baseX.set(baseX.get() + moveBy);
    }
  });


  return (
    <div 
      className="flex flex-nowrap whitespace-nowrap cursor-pointer"
      onPointerDown={() => setIsPaused(true)} // Stop on touch/click
      onPointerUp={() => setIsPaused(false)}   // Resume on release
      onPointerLeave={() => setIsPaused(false)} // Resume if mouse leaves
    >
      <motion.div 
        className="flex flex-nowrap gap-10 pr-10"
        style={{ x }}
      >
        {/* Render text 8 times to ensure seamless loop on large screens */}
        {Array.from({ length: 8 }).map((_, i) => (
          <h1 
            key={i} 
            className="text-[10rem] md:text-[15rem] font-black text-black leading-none flex-shrink-0 tracking-tighter opacity-90 hover:opacity-100 transition-opacity uppercase"
          >
            {children} <span className="text-orange-600 mx-4">•</span>
          </h1>
        ))}
      </motion.div>
    </div>
  );
}

// 2. Timer Helper
function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold leading-none bg-white/50 backdrop-blur-sm px-2 rounded-lg min-w-[3.5rem]">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider font-bold text-secondary mt-1">{label}</span>
    </div>
  );
}


// 4. Math Helper for wrapping range
// Wraps 'v' such that min <= v < max
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}