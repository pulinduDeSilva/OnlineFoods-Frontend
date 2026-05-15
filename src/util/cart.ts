import type { Cart } from '../types/models';

export function getCartTotal(cart: Cart | null): number {
  const items = cart?.items ?? [];
  return items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
}
