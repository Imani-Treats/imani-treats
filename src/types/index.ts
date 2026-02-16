export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string; // Note: We use snake_case to match Supabase database columns
    drop_date: string;
    stock: number;
  }
  
  // ... (other types if any)