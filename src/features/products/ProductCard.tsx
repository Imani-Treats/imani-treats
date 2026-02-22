"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ban } from "lucide-react"; 
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Link href={`/products/${product.id}`} className={`group block h-full ${isSoldOut ? 'opacity-70 grayscale-[0.5]' : ''}`}>
      <div className="h-full border border-gray-100 rounded-xl bg-white overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-square bg-[#F2F2F2] overflow-hidden">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* STOCK BADGE */}
          {!isSoldOut && (
            <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm z-10 ${
              isLowStock ? 'bg-red-100 text-red-600' : 'bg-white/90 text-primary'
            }`}>
              {isLowStock ? `Only ${product.stock} Left` : `${product.stock} Available`}
            </div>
          )}

          {isSoldOut && (
            <div className="absolute top-3 left-3 bg-gray-900 text-white px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm z-10">
              Sold Out
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="py-4 px-3 flex flex-col flex-1">
          
          {/* Title */}
          <h3 className="font-serif text-[15px] md:text-xl text-primary mb-1 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price & Action */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
            <span className="font-sans font-bold text-gray-900 text-sm md:text-base">
              ₦{product.price.toLocaleString()}
            </span>

            {/* Dynamic Button */}
            <div className={`flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
              isSoldOut ? "text-gray-400 cursor-not-allowed" : "text-black group-hover:bg-orange-600 group-hover:text-white px-2 py-1 rounded-full"
            }`}>
               {isSoldOut ? (
                 <span className="flex items-center gap-1">Sold Out <Ban className="w-3 h-3" /></span>
               ) : (
                 <span className="flex items-center gap-1">Select <ArrowRight className="w-3 h-3" /></span>
               )}
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}