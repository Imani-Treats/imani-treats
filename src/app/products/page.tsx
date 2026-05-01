"use client";

import Link from "next/link";
import { MoveLeft, ArrowLeft } from "lucide-react";
import ProductCard from "@/features/products/ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/supabase"; // <--- Import Supabase fetcher
import { Product } from "@/types";            // <--- Import Type

export default function ProductsPage() {
  // State for live data and loading indicator
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    }
    
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] max-w-7xl mx-auto pt-24 md:pt-40 pb-12 px-6">
      <div className="">
        
        <div className="mb-12 space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <MoveLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          <div className="mt-5">
            <h1 className="text-5xl md:text-6xl font-serif text-primary mb-2">
              The Menu Selection.
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              All products below are reserved for the upcoming saturday drop limited quantities available
            </p>
          </div>
        </div>

        {/* Loading Spinner or Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="flex justify-center border-t border-gray-200 pt-12 mt-12">
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