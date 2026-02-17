"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [bites, setBites] = useState<number[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Sequence of bites (indices)
    const biteSequence = [0, 1, 2, 3]; 
    
    // Play bite animation
    let delay = 500;
    biteSequence.forEach((biteIndex, i) => {
      setTimeout(() => {
        setBites((prev) => [...prev, biteIndex]);
      }, delay + (i * 600)); // Bite every 600ms
    });

    // Show text after last bite
    setTimeout(() => {
      setShowText(true);
    }, delay + (biteSequence.length * 600) + 200);

    // Finish loader
    setTimeout(() => {
      onComplete();
    }, delay + (biteSequence.length * 600) + 2000); // 2 seconds after text appears

  }, [onComplete]);

  // Bite positions (relative to the image container)
  const bitePositions = [
    { top: "-10%", right: "-10%", size: "w-32 h-32" }, // 1. Top Right
    { bottom: "-5%", left: "-10%", size: "w-36 h-36" }, // 2. Bottom Left
    { top: "40%", left: "-20%", size: "w-32 h-32" },   // 3. Middle Left
    { bottom: "10%", right: "10%", size: "w-40 h-40" }, // 4. Big chunk bottom right
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-[#fafafa] flex flex-col items-center justify-center"
      exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }} // Wipe up effect
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        
        {/* The Pastry */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white"
        >
          <Image
            src="/images/cinamon.jpg" // Ensure this path is correct
            alt="Loading..."
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* The "Invisible Bites" (White circles overlay) */}
        {bitePositions.map((pos, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={bites.includes(index) ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute bg-[#fafafa] rounded-full ${pos.size}`}
            style={{ 
              top: pos.top, 
              bottom: pos.bottom, 
              left: pos.left, 
              right: pos.right,
              zIndex: 10 
            }}
          />
        ))}

        {/* Crumbs Effect (Optional subtle details) */}
        {bites.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary text-xl"
          >
            ●
          </motion.div>
        )}
      </div>

      {/* Text Reveal */}
      <div className="h-12 mt-8">
        {showText && (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif text-primary italic"
          >
            Fresh out of the oven!
          </motion.h2>
        )}
      </div>

    </motion.div>
  );
}