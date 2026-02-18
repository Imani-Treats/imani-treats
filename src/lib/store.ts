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
  hasSeenPreloader: boolean;
  setHasSeenPreloader: (seen: boolean) => void;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCartCount: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [], // Unified name to match interface
      hasSeenPreloader: false,
      getCartCount: () => get().cart.length,
      getTotalQuantity: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
      setHasSeenPreloader: (seen) => set({ hasSeenPreloader: seen }),
      
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

      removeFromCart: (id, variant) => {
        set({
          cart: get().cart.filter((item) => {
            // Keep the item if the ID doesn't match OR if the variant doesn't match
            return !(item.id === id && item.variant === variant);
          }),
        });
      },

      updateQuantity: (id, quantity, variant) => {
        set({
          cart: get().cart.map((item) =>
            item.id === id && item.variant === variant
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      
      getTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'imani-cart-storage', // Key in local storage
    }
  )
);