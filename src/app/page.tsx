import Hero from "@/features/home/Hero";
import ProductList from "@/features/products/ProductList"; // <--- Import

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductList /> {/* <--- Add Component */}
    </main>
  );
}