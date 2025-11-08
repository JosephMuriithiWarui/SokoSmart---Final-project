import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orderForm, setOrderForm] = useState({ productId: "", quantity: 1 });

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
      alert("Failed to fetch products");
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
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      await api.post("/orders", { productId, quantity });
      alert("✅ Order placed successfully!");
      await fetchOrders();
      await fetchProducts(); // Refresh to update stock
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to place order";
      alert(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setOrdersLoading(true);
      await api.delete(`/orders/${orderId}`);
      alert("✅ Order cancelled successfully!");
      // Refresh orders list
      await fetchOrders();
      // Refresh products to update stock
      await fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to cancel order";
      alert(errorMessage);
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6">
          Buyer Dashboard 🛒
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setShowOrders(false)}
            className={`px-4 py-2 font-semibold ${
              !showOrders
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setShowOrders(true)}
            className={`px-4 py-2 font-semibold ${
              showOrders
                ? "text-blue-600 border-b-2 border-blue-600"
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
                      <input
                        type="number"
                        min="1"
                        max={p.quantity}
                        value={orderForm.productId === p._id ? orderForm.quantity : 1}
                        onChange={(e) =>
                          setOrderForm({
                            productId: p._id,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                        className="border p-2 rounded w-20 text-sm"
                      />
                      <button
                        onClick={() => placeOrder(p._id, orderForm.productId === p._id ? orderForm.quantity : 1)}
                        disabled={loading || p.quantity === 0}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1 text-sm sm:text-base"
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
                            onClick={() => cancelOrder(order._id)}
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
    </div>
  );
}
