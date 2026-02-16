"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Mock Data based on your UI and some placeholders
const REVIEWS = [
  {
    id: 1,
    text: "It's ya boy from Bauchi city just a stuttering time, you can taste the love in every different treat. It's the best cinnamon in town, hands down.",
    author: "Tobi K.",
    role: "Regular Customer"
  },
  {
    id: 2,
    text: "I have never tasted anything quite like the Greek Yogurt. They are an absolute masterpiece. I set my alarm for every drop!",
    author: "Amara N.",
    role: "Pastry Lover"
  },
  {
    id: 3,
    text: "The delivery was seamless and the packaging was beautiful. But the taste? Simply out of this world. Highly recommended.",
    author: "David O.",
    role: "Verified Buyer"
  }
];

export default function ReviewSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  return (
    <section className="bg-primary text-white py-15 px-6 relative overflow-hidden">
      {/* Background decoration (optional subtle circle) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Quote Icon */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center justify-center text-btn text-sm font-bold uppercase">
            <span>The Community Voice</span>
          </div>
        </div>

        {/* Review Text */}
        <div className="min-h-[200px] flex flex-col justify-center">
          <h3 className="text-3xl md:text-4xl font-serif italic leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 key={currentIndex}">
            "{REVIEWS[currentIndex].text}"
          </h3>
          
          <div className="mt-8 space-y-1 animate-in fade-in zoom-in duration-700 delay-100 key={currentIndex + '-author'}">
            <p className="font-bold tracking-widest uppercase text-sm text-secondary">
              {REVIEWS[currentIndex].author}
            </p>
            <p className="text-xs text-white/50">
              {REVIEWS[currentIndex].role}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-8 mt-12">
          <button 
            onClick={prevReview}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={nextReview}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}