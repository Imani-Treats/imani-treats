import type { Metadata } from "next";
import { Cormorant, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- IMPORT THIS
import Footer from "@/components/Footer";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ['normal', 'italic'],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Imani Treats",
  description: "Exclusive pastry drops and treats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jakarta.variable} antialiased bg-background text-primary`}>
        <Navbar /> {/* <--- ADD THIS HERE */}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}