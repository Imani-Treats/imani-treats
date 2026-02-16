import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- IMPORT THIS
import Footer from "@/components/Footer";

const cormorant = localFont({
  src: [
    {
      path: "./fonts/Cormorant-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Cormorant-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Cormorant-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Cormorant-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Cormorant-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Cormorant-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/Cormorant-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cormorant", // Keep this variable name the same so Tailwind finds it!
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
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