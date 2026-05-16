import { create } from 'zustand';

export interface CartItem {
  id: string;
  barcode: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomPrice: (id: string, newPrice: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => set((state) => {
    const existingItemIndex = state.items.findIndex(i => i.id === item.id);

    if (existingItemIndex >= 0) {
      const newItems = [...state.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + 1
      };
      return { items: newItems };
    }

    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
  })),

  updateCustomPrice: (id, newPrice) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, price: newPrice } : item
    )
  })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
