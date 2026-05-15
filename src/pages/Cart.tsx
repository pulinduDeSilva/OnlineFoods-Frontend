import { Link } from 'react-router';
import { useCart } from '../context/useCart';
import { getCartTotal } from '../util/cart';

export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  const items = cart?.items ?? [];
  const totalAmount = getCartTotal(cart);

  if (loading) {
    return <div className="pt-24 text-center">Loading cart...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-24">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
          <Link to="/" className="mt-3 inline-block text-gray-600 hover:underline">
            Go to menu
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-lg font-bold">{item.foodItem.name}</h3>
                    <p className="text-sm text-gray-500">{item.foodItem.category?.name || 'Uncategorized'}</p>
                    <p className="text-sm text-gray-600">${item.foodItem.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity === 1}
                      className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded border border-gray-300 px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">${(item.foodItem.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={clearCart}
                className="rounded-md border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
              >
                Clear Cart
              </button>
              <Link to="/orders" className="rounded-md bg-black px-4 py-2 text-center text-white hover:opacity-90">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}