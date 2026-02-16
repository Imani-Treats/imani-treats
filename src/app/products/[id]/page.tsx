"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MoveLeft, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, CreditCard, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import ProductCard from "@/features/products/ProductCard";
import RelatedProducts from "@/features/products/RelatedProducts";
import { Product } from "@/types";

// --- UPDATED MOCK DATA (Now matches the List Page exactly) ---
interface ExtendedProduct extends Product {
  images: string[];
}

const ALL_PRODUCTS: ExtendedProduct[] = [
  { 
    id: "1", 
    name: "Artisanal Plantain Chips", 
    description: "Hand-sliced and kettle-fried to perfection. Choose your ripeness level for the perfect crunch.", 
    price: 4500, 
    image_url: "/images/cinamon2.jpg", 
    images: [
      "/images/cinamon.jpg",
      "/images/cinamon3.jpg",
      "/images/cinamon2.jpg"
    ],
    drop_date: "2025-12-25", 
    stock: 10 
  },
  { 
    id: "2", 
    name: "Crack Sugar Buns", 
    description: "Fluffy brioche buns topped with a crackly sugar crust.", 
    price: 3000, 
    image_url: "/images/cinamon.jpg",
    images: [
      "/images/cinamon3.jpg",
      "/images/cinamon2.jpg"
    ],
    drop_date: "2025-12-25", 
    stock: 15 
  },
  {
    id: "3",
    name: "Cinnamon Rolls",
    description: "Classic gooey cinnamon rolls with cream cheese frosting.",
    price: 5000,
    image_url: "/images/cinamon.jpg", // Local image example
    images: [
        "/images/cinamon.jpg",
        "/images/cinamon2.jpg",
        "/images/cinamon3.jpg"
    ],
    drop_date: "2025-12-25",
    stock: 8
  },
  {
    id: "4",
    name: "Banana Bread Loaf",
    description: "Moist, dense, and packed with real bananas and walnuts.",
    price: 6500,
    image_url: "/images/cinamon.jpg",
    images: [
        "/images/cinamon2.jpg",
        "/images/cinamon3.jpg"
    ],
    drop_date: "2025-12-25",
    stock: 2
  },
  {
    id: "5",
    name: "Strawberry Parfait",
    description: "Layers of fresh cream, strawberry compote, and sponge cake.",
    price: 4000,
    image_url: "/images/cinamon.jpg",
    images: [
        "/images/cinamon3.jpg",
        "/images/cinamon2.jpg"
    ],
    drop_date: "2025-12-25",
    stock: 0 
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  // 1. Find product
  // Default to empty array if no images found to prevent crashes
  const product = ALL_PRODUCTS.find((p) => p.id === params.id);
  const productImages = product?.images || [product?.image_url || ""];

  // 2. States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("Original");
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-serif text-primary">Product Not Found</h2>
        <Link href="/products" className="text-sm underline hover:text-orange-600">Return to Lineup</Link>
    </div>
  );

  // Slider Navigation Functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: quantity,
      variant: selectedVariant, // <--- Add this line!
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pt-24 pb-12">
      
        {/* Back Link */}
        <Link 
          href="/products" 
          className="inline-flex items-center text-sm text-gray-500 pb-10 px-6 hover:text-primary transition-colors"
        >
          <MoveLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
      <div className="max-w-6xl mx-auto  grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">

        
        {/* --- LEFT: IMAGE SLIDER --- */}
        <div className="relative aspect-square md:aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden group">
          
          {/* Main Image */}
          <Image
            src={productImages[currentImageIndex]}
            alt={product.name}
            fill
            className="object-cover object-center transition-all duration-500"
            priority
          />

          {/* Slider Controls (Only show if > 1 image) */}
          {productImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>

              {/* Remove Right Arrow */}
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100 z-100"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>

              {/* Dots Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {productImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === idx ? "bg-primary w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

  
        </div>

        {/* --- RIGHT: PRODUCT INFO (Same as before) --- */}
        <div className="flex flex-col justify-center px-6 space-y-6">
          
          <div>
            <span className="text-orange-500 font-bold text-xs tracking-widest uppercase">
              Savory Collection
            </span>
            <h1 className="text-2xl font-serif text-primary italic mt-2 mb-4">
              {product.name}
            </h1>
            <p className="text-xl font-sans font-medium text-gray-900">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed font-light">
            {product.description}
          </p>

          <hr className="border-gray-200" />

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Hand Made</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Non-GMO</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Daily Fresh</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Local Ingredients</div>
          </div>

          <hr className="border-gray-200" />

          {/* Variants */}
          <div>
            <span className="block text-xs font-bold text-gray-900 uppercase mb-3">Select Variety</span>
            <div className="flex flex-wrap gap-3">
              {["Lightly Salted", "Spicy Chili", "Sweet Caramelized"].map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 text-xs font-bold border transition-colors ${
                    selectedVariant === variant
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-gray-500 border-gray-300 hover:border-primary"
                  }`}
                >
                  {variant.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-100 w-max px-4 py-2 rounded-full">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-btn text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
              >
                {isAdded ? "ADDED TO BAG" : "ADD TO BAG"} 
                <ShoppingBag className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => {
                  handleAddToCart();
                  router.push('/cart');
                }}
                className="w-full bg-white border border-gray-300 text-gray-900 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                BUY NOW - ₦{(product.price * quantity).toLocaleString()}
                <CreditCard className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
{/* Bottom Recommendations */}
<div className="max-w-6xl mx-auto mb-12 px-6">
        <RelatedProducts 
          products={ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4)}
        />
      </div>

    </div>
  );
}