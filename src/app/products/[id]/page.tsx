"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MoveLeft, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, CreditCard, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import RelatedProducts from "@/features/products/RelatedProducts";
import { PRODUCTS } from "@/lib/data";
import BulkOrderModal from "@/components/BulkOrderModal";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const product = PRODUCTS.find((p) => p.id === params.id);

  const productImages = product?.images?.length ? product.images : [product?.image_url || ""];
  
  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || "Standard"
  );
  const [isAdded, setIsAdded] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  
  // Stock Logic
  const stock = product?.stock || 0;
  const isSoldOut = stock === 0;

  // --- SWIPE LOGIC (Kept from previous task) ---
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-serif text-primary">Product Not Found</h2>
        <Link href="/products" className="text-sm underline hover:text-orange-600">Return to Lineup</Link>
    </div>
  );

  // Navigation & Swipe Handlers
  const nextImage = () => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));

  useEffect(() => {
    if (productImages.length <= 1) return;
    const timer = setInterval(() => nextImage(), 5000);
    return () => clearInterval(timer);
  }, [currentImageIndex, productImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
    setTouchStart(0); setTouchEnd(0);
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart({ ...product, quantity, variant: selectedVariant });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Logic to prevent increasing quantity beyond stock
  const increaseQuantity = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  return (
    <>
    <div className="bg-[#fafafa] min-h-screen pt-24 pb-12">
      
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center text-sm text-gray-500 pb-10 px-6 hover:text-primary transition-colors">
          <MoveLeft className="w-4 h-4 mr-1" /> Back
        </Link>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        
        {/* --- LEFT: IMAGE SLIDER --- */}
        <div 
          className="relative aspect-square md:aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden group touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={productImages[currentImageIndex]}
            alt={product.name}
            fill
            className={`object-cover object-center transition-all duration-500 ${isSoldOut ? 'grayscale' : ''}`}
            priority
          />
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-black px-6 py-3 text-xl font-bold uppercase tracking-widest rotate-[-10deg] border-4 border-black">
                Sold Out
              </span>
            </div>
          )}

          {/* Slider Controls */}
          {productImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hidden md:block hover:bg-white"><ChevronLeft className="w-5 h-5 text-primary" /></button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hidden md:block hover:bg-white z-10"><ChevronRight className="w-5 h-5 text-black" /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {productImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? "bg-primary w-4" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- RIGHT: PRODUCT INFO --- */}
        <div className="flex flex-col justify-center px-6 space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-orange-500 font-bold text-xs tracking-widest uppercase">
                Savory Collection
              </span>
              {/* Stock Indicator */}
              {!isSoldOut && (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                  {stock} Available
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-primary mt-2 mb-4">{product.name}</h1>
            <p className="text-2xl font-sans font-medium text-gray-900">₦{product.price.toLocaleString()}</p>
          </div>

          <p className="text-gray-600 leading-relaxed font-light">{product.description}</p>
          <hr className="border-gray-200" />

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Hand Made</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Daily Fresh</div>
          </div>
          <hr className="border-gray-200" />

          {/* Variants Section */}
          {!isSoldOut && product.variants && product.variants.length > 0 && (
            <div>
              <span className="block text-xs font-bold text-gray-900 uppercase mb-3">
                Select Variety
              </span>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 text-[10px] font-bold border transition-all duration-300 ${
                      selectedVariant === variant
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-transparent text-gray-500 border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {variant.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- ACTIONS SECTION --- */}
          {isSoldOut ? (
            // SOLD OUT MESSAGE
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
              <h3 className="font-serif text-xl text-primary italic">Sold Out for this Drop</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This item is no longer available. Please make an order immediately after the next drop ends as our products are on a <span className="font-bold">"first come first serve"</span> basis.
              </p>
            </div>
          ) : (
            // ACTIVE BUY BUTTONS
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-100 w-max px-4 py-2 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium w-4 text-center">{quantity}</span>
                <button onClick={increaseQuantity} className={`text-gray-500 hover:text-black ${quantity >= stock ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-btn text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
                >
                  {isAdded ? "ADDED TO BAG" : "ADD TO BAG"} <ShoppingBag className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { handleAddToCart(); router.push('/cart'); }}
                  className="w-full bg-white border border-gray-300 text-gray-900 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  BUY NOW - ₦{(product.price * quantity).toLocaleString()} <CreditCard className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setIsBulkOpen(true)}
                    className="text-xs font-bold uppercase tracking-widest text-primary/70 hover:text-primary underline decoration-dotted underline-offset-4 hover:scale-105 transition-all">
                    Bulk Orders?
              </button>
              </div>
              
              {/* Low Stock Warning */}
              {stock < 5 && (
                <p className="text-xs text-red-600 font-bold text-center animate-pulse">
                  Hurry! Only {stock} items left.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Related */}
      <div className="max-w-6xl mx-auto mb-12 px-6">
        <RelatedProducts products={PRODUCTS.filter(p => p.id !== product.id).slice(0, 4)} />
      </div>
    </div>
    <BulkOrderModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
    </>
  );
}