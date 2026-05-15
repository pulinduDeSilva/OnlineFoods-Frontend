import { useEffect, useState, type ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { CartContext } from './cartContext';
import { useAuth } from './useAuth';
import type { Cart } from '../types/models';

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshCart = async () => {
    if (!isAuthenticated || !user?.id) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const nextCart = await cartService.getByUser(user.id);
      setCart(nextCart);
    } catch {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void refreshCart();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const addToCart = async (foodItemId: number, quantity = 1) => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const nextCart = await cartService.addItem(user.id, foodItemId, quantity);
      setCart(nextCart);
    } catch {
      setError('Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const nextCart = await cartService.updateQuantity(user.id, cartItemId, quantity);
      setCart(nextCart);
    } catch {
      setError('Failed to update cart item.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const nextCart = await cartService.removeItem(user.id, cartItemId);
      setCart(nextCart);
    } catch {
      setError('Failed to remove cart item.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const nextCart = await cartService.clear(user.id);
      setCart(nextCart);
    } catch {
      setError('Failed to clear cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, error, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
