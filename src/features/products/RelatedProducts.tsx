import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
  subtitle?: string;
}

export default function RelatedProducts({ 
  products, 
  subtitle = "The rest of this week's drop" 
}: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="text-center md:text-left mb-8">
         {subtitle && (
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-2">
            {subtitle}
            </p>
         )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-5 md:gap-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}