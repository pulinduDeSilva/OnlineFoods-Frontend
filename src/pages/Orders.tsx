import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import type { Order, PaymentStatus } from '../types/models';
import { getCartTotal } from '../util/cart';

export default function OrdersPage() {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadOrders = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');
    try {
      const list = await orderService.getUserOrders(user.id);
      const enriched = await Promise.all(
        list.map(async (order) => {
          if (order.payment) return order;
          try {
            const payment = await paymentService.getByOrder(order.id);
            return { ...order, payment };
          } catch {
            return order;
          }
        }),
      );
      setOrders(enriched);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadOrders();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handlePlaceOrder = async () => {
    if (!user?.id) return;

    setPlacingOrder(true);
    setError('');

    try {
      const order = await orderService.checkout(user.id);
      const payment = await paymentService.createPending(order.id);
      setOrders((prev) => [{ ...order, payment }, ...prev]);
      await refreshCart();
    } catch {
      setError('Checkout failed. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePaymentUpdate = async (paymentId: number, status: PaymentStatus) => {
    setError('');

    try {
      const updatedPayment = await paymentService.updateStatus(paymentId, status);
      setOrders((prev) =>
        prev.map((order) => (order.payment?.id === paymentId ? { ...order, payment: updatedPayment } : order)),
      );
    } catch {
      setError('Failed to update payment status.');
    }
  };

  const cartTotal = getCartTotal(cart);

  const handlePaymentAction = (order: Order, status: PaymentStatus) => {
    const paymentId = order.payment?.id;
    if (paymentId == null) return;
    void handlePaymentUpdate(paymentId, status);
  };


  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-24">
      <h1 className="mb-6 text-3xl font-bold">Orders & Checkout</h1>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Place Order</h2>
        <p className="mb-1 text-sm text-gray-600">Cart items: {cart?.items.length ?? 0}</p>
        <p className="mb-4 text-sm text-gray-600">Cart total: ${cartTotal.toFixed(2)}</p>
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder || !cart?.items.length}
          className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:bg-gray-300"
        >
          {placingOrder ? 'Placing...' : 'Place Order'}
        </button>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Order Tracking</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">Order #{order.id}</p>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{order.status}</span>
                </div>

                <ul className="mb-3 list-disc pl-5 text-sm text-gray-700">
                  {order.orderItems.map((item) => (
                    <li key={item.id}>
                      {item.foodItem.name} × {item.quantity} (${(item.unitPrice * item.quantity).toFixed(2)})
                    </li>
                  ))}
                </ul>

                <div className="mb-3 text-sm font-medium">Total: ${order.totalAmount.toFixed(2)}</div>

                <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm">
                  <p className="mb-2">Payment Status: {order.payment?.status ?? 'N/A'}</p>
                  {order.payment?.status === 'PENDING' && order.payment?.id != null && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePaymentAction(order, 'COMPLETED')}
                        className="rounded bg-green-600 px-3 py-1 text-white"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => handlePaymentAction(order, 'FAILED')}
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Mark Failed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
