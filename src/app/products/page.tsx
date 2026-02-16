"use client";

import Link from "next/link";
import { MoveLeft, ArrowLeft } from "lucide-react";
import ProductCard from "@/features/products/ProductCard";
import { PRODUCTS } from "@/lib/data"; // <--- Import from central source

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-12 space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <MoveLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          <div className="mt-5">
            <h1 className="text-5xl md:text-6xl font-serif text-primary italic mb-2">
              The Lineup.
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              All products below are reserved  for the upcoming saturday drop limited quantities available
            </p>
          </div>
        </div>

        {/* Use the centralized PRODUCTS array */}
        <div className="flex flex-col gap-16 mb-24">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center border-t border-gray-200 pt-12">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-primary hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}