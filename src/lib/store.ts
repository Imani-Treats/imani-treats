import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  variant?: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, variant?: string) => void; // UPDATED: Accepts variant
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product) => {
        const currentCart = get().cart;
        // Check if item exists (Same ID AND Same Variant)
        const existingItem = currentCart.find(
          (item) => item.id === product.id && item.variant === product.variant
        );

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item.id === product.id && item.variant === product.variant
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...currentCart, product] });
        }
      },

      // --- FIX IS HERE ---
      removeFromCart: (id, variant) => {
        set({
          cart: get().cart.filter((item) => {
            // Keep the item if the ID doesn't match OR if the variant doesn't match
            // This ensures we only delete the specific ID+Variant combo
            return !(item.id === id && item.variant === variant);
          }),
        });
      },

      clearCart: () => set({ cart: [] }),
      
      total: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'imani-cart-storage',
    }
  )
);