"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Changed Plus to ArrowRight
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // We no longer need the "Add to Cart" logic here since the button just navigates
  
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="h-full border border-gray-100 rounded-xl bg-white overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-square bg-[#F2F2F2] overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Badge */}
          <div className=" hidden absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase text-orange-600 shadow-sm z-10">
            Limited
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="py-4 px-2 flex flex-col flex-1">
          
          {/* Title */}
          <h3 className="font-serif text-[15px] md:text-xl text-primary mb-1 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="hidden text-xs text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* FOOTER */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
            <span className="font-sans font-bold text-gray-900 text-sm md:text-base">
              ₦{product.price.toLocaleString()}
            </span>

            {/* "Select ->" Button (Purely visual, the parent Link handles navigation) */}
            <div className="flex items-center  text-[8px] md:text-xs font-bold uppercase tracking-wider  text-black group-hover:bg-orange-600 transition-colors duration-300">
               Select <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}