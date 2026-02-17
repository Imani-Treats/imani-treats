"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/features/home/Hero";
import ProductList from "@/features/products/ProductList"; // <--- Import
import Preloader from "@/components/Preloader";
import { useCartStore } from "@/lib/store";

export default function Home() {
  const { hasSeenPreloader, setHasSeenPreloader } = useCartStore();
  // Initialize loading based on whether user has seen it this session
  const [isLoading, setIsLoading] = useState(!hasSeenPreloader);
  

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setHasSeenPreloader(true); // Mark as seen globally
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader key="preloader" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
    <div className="relative overflow-x-hidden">
      <Hero />
      <ProductList /> {/* <--- Add Component */}
    </div>
    </>
  );
}