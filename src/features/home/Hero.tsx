"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from 'lucide-react';
import { useCountdown } from "@/hooks/useCountdown";
import { useEffect, useState } from "react";

export default function Hero() {
  // 1. Calculate the next Saturday dynamically
  const [targetDate, setTargetDate] = useState<string>("");

  useEffect(() => {
    const nextSaturday = getNextSaturday();
    setTargetDate(nextSaturday.toISOString());
  }, []);

  // 2. Use the dynamic date
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <section className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      
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
      <div className="space-y-10 pt-17">

        <div>
          <span className="uppercase font-semibold text-lg text-gray-600 tracking-widest flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 inline-block mr-2 text-btn" />
            Next Saturday Drop
          </span>
        </div>
        
        {/* Timer Section */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold tracking-widest uppercase text-primary/80">
            Next Drop In:
          </span>
          <div className="flex gap-4 text-primary font-serif">
            <TimeBox value={days} label="Days" />
            <span className="text-2xl mt-2">:</span>
            <TimeBox value={hours} label="Hrs" />
            <span className="text-2xl mt-2">:</span>
            <TimeBox value={minutes} label="Mins" />
            <span className="text-2xl mt-2">:</span>
            <TimeBox value={seconds} label="Secs" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-7xl md:text-9xl font-medium text-black italic leading-tight">
          Artisanal <br /> Baking
        </h1>

        {/* CTA Button */}
        <Link 
          href="/products"
          className="inline-block bg-white text-primary px-8 py-4 text-sm uppercase font-medium tracking-widest hover:bg-accent rounded-3xl transition-colors duration-300"
        >
          view saturday lineup
        </Link>
      </div>
    </section>
  );
}

// Helper Component
function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold leading-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
    </div>
  );
}

// --- HELPER LOGIC: FIND NEXT SATURDAY ---
function getNextSaturday() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7; 
  
  // If today is Saturday, set target to NEXT Saturday (7 days later)
  // or keep it 0 if you want it to be "Today" until the drop time passes.
  // Here we add 7 days if it's already Saturday to look ahead.
  const daysToAdd = daysUntilSaturday === 0 ? 7 : daysUntilSaturday;

  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysToAdd);
  
  // Set drop time to 9:00 AM
  nextSaturday.setHours(9, 0, 0, 0);

  return nextSaturday;
}