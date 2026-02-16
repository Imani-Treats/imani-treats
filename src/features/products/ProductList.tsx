import ProductCard from "./ProductCard";
import { PRODUCTS } from "@/lib/data"; // <--- Import from central source
import Link from "next/link";
import { ArrowRight } from "lucide-react"

export default function ProductList() {
  // We only want to show the first 3 items on the homepage
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <section id="products" className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-sm font-bold tracking-widest text-orange-600 uppercase">
            The Selection
          </span>
          <h2 className="text-5xl font-serif text-primary mt-3 italic">
            Reserved Lineup.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center border-t border-gray-200 pt-12">
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-primary hover:text-orange-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}