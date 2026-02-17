import { Product } from "@/types";

export const PRODUCTS: Product[] = [
  { 
    id: "1", 
    name: "Plantain Chips", 
    description: "Hand-sliced and kettle-fried to perfection. Choose your ripeness level for the perfect crunch.", 
    price: 4500, 
    image_url: "/images/plantain.jpg", 
    images: [
      "/images/plantain.jpg",
      "/images/plantain2.jpg"
    ],
    drop_date: "2025-12-25", 
    stock: 10,
    variants: ["Unripe", "Ripe", "Sweet"] 
  },
  { 
    id: "2", 
    name: "Banana Bread", 
    description: "Fluffy brioche buns topped with a crackly sugar crust.", 
    price: 3000, 
    image_url: "/images/buns.jpg",
    images: [
        "/images/buns.jpg",
        "/images/buns2.jpg"
    ],
    drop_date: "2025-12-25", 
    stock: 15 ,
    variants: ["Classic", "Chocolate", "Cinanamon swirls"]
  },
  {
    id: "3",
    name: "Cinnamon Rolls", 
    description: "Classic gooey cinnamon rolls with cream cheese frosting.",
    price: 5000,
    image_url: "/images/cinamon.jpg", 
    images: [
        "/images/cinamon.jpg",
        "/images/cinamon2.jpg",
        "/images/cinamon3.jpg"
    ],
    drop_date: "2025-12-25",
    stock: 8,
    variants: ["Classic", "Chocolate"]
  },
  {
    id: "4",
    name: "Greek Yoghurt",
    description: "Layers of fresh cream, strawberry compote, and sponge cake.",
    price: 4000,
    image_url: "/images/greek.jpg",
    images: [
        "/images/greek.jpg",
        "/images/greek2.jpg",
        "/images/greek3.jpg"
    ],
    drop_date: "2025-12-25",
    stock: 0,
    variants: ["Plain", "Sweetened", "Parfaits"]
  },
  {
    id: "5",
    name: "Shawarma",
    description: "Layers of fresh cream, strawberry compote, and sponge cake.",
    price: 4000,
    image_url: "/images/greek.jpg",
    images: [
        "/images/greek.jpg",
        "/images/greek2.jpg",
        "/images/greek3.jpg"
    ],
    drop_date: "2025-12-25",
    stock: 1,
    variants: ["Beef", "Chicken", "Asun"] 
  }
];