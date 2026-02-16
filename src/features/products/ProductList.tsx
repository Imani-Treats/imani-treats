import ProductCard from "./ProductCard";
import { Product } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// TEMPORARY MOCK DATA (To match your UI screenshot)
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Artisanal Plantain Chips",
    description: "Cream cheese garlic bread with a sweet and savory glaze.",
    price: 4500,
    image_url: "/images/plantain.jpg", // Local image example
    drop_date: "2025-12-25",
    stock: 10
  },
  {
    id: "2",
    name: "Greek Yogurt",
    description: "Fluffy brioche buns topped with a crackly sugar crust.",
    price: 3000,
    image_url: "/images/greek.jpg",
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
  }
];

export default function ProductList() {
  return (
    <section id="products" className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-16">
          <span className="text-sm font-bold tracking-widest text-orange-600 uppercase">
            The Elite Batch
          </span>
          <h2 className="text-3xl font-serif text-primary mt-3 italic">
          Reserved Lineup.
          </h2>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center border-t border-gray-200 pt-12">
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-primary hover:text-orange-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}