import { createContext } from 'react';
import type { Cart } from '../types/models';

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string;
  refreshCart: () => Promise<void>;
  addToCart: (foodItemId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
