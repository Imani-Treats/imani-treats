"use client";

import Link from "next/link";
import { MoveLeft, ArrowLeft } from "lucide-react";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/types";

// Extended Mock Data to fill up the page (simulating a full menu)
const ALL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Artisanal Korean Garlic",
    description: "Cream cheese garlic bread with a sweet and savory glaze.",
    price: 4500,
    image_url: "/images/cinamon.jpg", // Local image example
    drop_date: "2025-12-25",
    stock: 5 // Low stock example
  },
  {
    id: "2",
    name: "Crack Sugar Buns",
    description: "Fluffy brioche buns topped with a crackly sugar crust.",
    price: 3000,
    image_url: "/images/cinamon.jpg",
    drop_date: "2025-12-25",
    stock: 15
  },
  {
    id: "3",
    name: "Cinnamon Rolls",
    description: "Classic gooey cinnamon rolls with cream cheese frosting.",
    price: 5000,
    image_url: "/images/cinamon.jpg", // Local image example
    drop_date: "2025-12-25",
    stock: 8
  },
  {
    id: "4",
    name: "Banana Bread Loaf",
    description: "Moist, dense, and packed with real bananas and walnuts.",
    price: 6500,
    image_url: "/images/cinamon3.jpg",
    drop_date: "2025-12-25",
    stock: 2
  },
  {
    id: "5",
    name: "Strawberry Parfait",
    description: "Layers of fresh cream, strawberry compote, and sponge cake.",
    price: 4000,
    image_url: "/images/cinamon2.jpg",
    drop_date: "2025-12-25",
    stock: 0 // Sold out example logic (we can add later)
  }
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 ">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 mb-10 hover:text-primary transition-colors"
          >
            <MoveLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          {/* Title */}
          <div className="space-y-2 border">
            <span className="text-4xl md:text-6xl font-sans italic text-primary mt-8">
            The Lineup.
            </span>
            <p className="text-xs text-gray-400 uppercase pt-3 ">
            All Product Below are  Reserved for the Upcoming
            Saturday drop limited quantities available
            </p>
          </div>
        </div>

        {/* Product Grid (Vertical Stack as per screenshot) */}
        <div className="flex flex-col gap-16 mb-24">
          {ALL_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Navigation */}
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