import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';


interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = updatedItems[existingItemIndex].quantity + quantity;
            // Cap at product stock if defined
            const finalQty = product.stock > 0 ? Math.min(newQty, product.stock) : newQty;
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: finalQty,
            };
            return { items: updatedItems, isOpen: true };
          } else {
            const initialQty = product.stock > 0 ? Math.min(quantity, product.stock) : quantity;
            return {
              items: [...state.items, { product, quantity: initialQty }],
              isOpen: true,
            };
          }
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxQty = item.product.stock > 0 ? Math.min(quantity, item.product.stock) : quantity;
              return { ...item, quantity: maxQty };
            }
            return item;
          }),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cuisinedz_cart_storage',
    }
  )
);
