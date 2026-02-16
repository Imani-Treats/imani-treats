"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from 'lucide-react';
import { useCountdown } from "@/hooks/useCountdown";

export default function Hero() {
  // Set the next drop date (Modify this date to test the timer!)
  const dropDate = "2025-12-25T12:00:00"; 
  const { days, hours, minutes, seconds } = useCountdown(dropDate);

  return (
    <section className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg" // Baker kneading dough
          alt="Artisanal Baking"
          fill
          className="object-cover object-left opacity-90"
          priority
        />
        {/* Subtle overlay to ensure text readability if image is too bright */}
        <div className="absolute inset-0 bg-white/10" /> 
      </div>

      {/* Content */}
      <div className="space-y-10 pt-17">

        <div >
          <span className="uppercase font-bold text-lg text-gray-400 tracking-widest flex items-center justify-center gap-2">
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
        <h1 className="text-6xl md:text-9xl font-serif text-black italic leading-tight">
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

// Helper component for the timer numbers
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