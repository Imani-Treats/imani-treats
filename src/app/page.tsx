import Hero from "@/features/home/Hero";
import ProductList from "@/features/products/ProductList"; // <--- Import
import ReviewSlider from "@/features/reviews/ReviewSlider";

export default function Home() {
  return (
    <main>
      <Hero />
      <ReviewSlider />
      <ProductList /> {/* <--- Add Component */}
    </main>
  );
}