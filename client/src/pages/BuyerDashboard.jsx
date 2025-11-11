import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal.jsx";
import { useNotification } from "../components/Notification.jsx";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orderForm, setOrderForm] = useState({ productId: "", quantity: 1 });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const { showNotification } = useNotification();

  // Load all products
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
      showNotification("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Place order
  const placeOrder = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Please login first", "warning");
      return;
    }

    try {
      setLoading(true);
      await api.post("/orders", { productId, quantity });
      showNotification("Order placed successfully!", "success");
      await fetchOrders();
      await fetchProducts(); // Refresh to update stock
      setIsOrderModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to place order";
      showNotification(errorMessage, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {

    try {
      setOrdersLoading(true);
      await api.delete(`/orders/${orderId}`);
      showNotification("Order cancelled successfully!", "success");
      // Refresh orders list
      await fetchOrders();
      // Refresh products to update stock
      await fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to cancel order";
      showNotification(errorMessage, "error");
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#31694E] mb-6">
          Buyer Dashboard 🛒
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setShowOrders(false)}
            className={`px-4 py-2 font-semibold ${
              !showOrders
                ? "text-[#31694E] border-b-2 border-[#31694E]"
                : "text-gray-500"
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setShowOrders(true)}
            className={`px-4 py-2 font-semibold ${
              showOrders
                ? "text-[#31694E] border-b-2 border-[#31694E]"
                : "text-gray-500"
            }`}
          >
            My Orders ({orders.length})
          </button>
        </div>

        {!showOrders ? (
          <>
            {/* Products List */}
            {loading ? (
              <Loader />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-4 sm:p-6 shadow rounded-lg hover:shadow-lg transition border border-gray-100"
                  >
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{p.name}</h3>
                    <p className="text-gray-600 mb-1">Price: KSh {p.price}</p>
                    <p className="text-gray-600 mb-1">Category: {p.category}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      Farmer: {p.farmer?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Stock: {p.quantity} available
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setOrderForm({ productId: p._id, quantity: 1 });
                          setIsOrderModalOpen(true);
                        }}
                        disabled={loading || p.quantity === 0}
                        className="bg-[#31694E] text-white px-4 py-2 rounded hover:bg-[#2a5a42] disabled:opacity-50 disabled:cursor-not-allowed flex-1 text-sm sm:text-base"
                      >
                        {loading ? "Ordering..." : "Order Now"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No products available.</p>
            )}
          </>
        ) : (
          <>
            {/* Orders History */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Order History</h2>
            {ordersLoading ? (
              <Loader />
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">
                          {order.product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-gray-600">Quantity: {order.quantity}</p>
                        <p className="text-gray-600">Total: KSh {order.totalPrice}</p>
                        <p className="text-sm text-gray-400">
                          Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            order.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "delivered"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.status === "pending" && (
                          <button
                            onClick={() => setCancelOrderId(order._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No orders yet. Start shopping!</p>
            )}
          </>
        )}
      </div>

      {/* Place Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Place Order"
        size="sm"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            min="1"
            value={orderForm.quantity}
            onChange={(e) =>
              setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })
            }
            className="border p-2 rounded w-full"
          />
          <button
            onClick={() => placeOrder(orderForm.productId, orderForm.quantity)}
            className="bg-[#31694E] text-white px-4 py-2 rounded hover:bg-[#2a5a42] w-full"
            disabled={loading}
          >
            {loading ? "Placing..." : "Confirm Order"}
          </button>
        </div>
      </Modal>

      {/* Cancel Order Confirmation Modal */}
      <Modal
        isOpen={!!cancelOrderId}
        onClose={() => setCancelOrderId(null)}
        title="Cancel Order"
        size="sm"
      >
        <p className="mb-6">Are you sure you want to cancel this order?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const id = cancelOrderId;
              setCancelOrderId(null);
              cancelOrder(id);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => setCancelOrderId(null)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
          >
            Keep Order
          </button>
        </div>
      </Modal>
    </div>
  );
}
