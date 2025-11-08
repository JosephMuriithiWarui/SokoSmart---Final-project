import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
  });

  // Load farmer's products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please login first.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/products");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;
      
      const farmerProducts = res.data.filter(
        (p) => p.farmer && (p.farmer._id === userId || p.farmer === userId)
      );
      setProducts(farmerProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load orders for farmer's products
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    // Check if user is a farmer
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role !== "farmer") {
        alert("You must be logged in as a farmer to view orders");
        return;
      }
    } catch {
      alert("Invalid token. Please login again.");
      return;
    }

    try {
      setOrdersLoading(true);
      const res = await api.get("/orders/farmer");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message || err.message || "Failed to load orders";
      
      if (status === 401 || status === 403) {
        alert("Access denied. Please make sure you're logged in as a farmer.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  // Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      if (editingProduct) {
        // Update product
        const res = await api.put(`/products/${editingProduct._id}`, {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
        setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
        alert("✅ Product updated successfully!");
      } else {
        // Create product
        const res = await api.post("/products", {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
        setProducts([...products, res.data]);
        alert("✅ Product added successfully!");
      }
      setForm({ name: "", price: "", category: "", quantity: "" });
      setEditingProduct(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error saving product";
      alert(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      alert("✅ Product deleted successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error deleting product";
      alert(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setOrdersLoading(true);
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      alert("✅ Order status updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">
          Farmer Dashboard 🌾
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setShowOrders(false)}
            className={`px-4 py-2 font-semibold ${
              !showOrders
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => {
              setShowOrders(true);
              fetchOrders();
            }}
            className={`px-4 py-2 font-semibold ${
              showOrders
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {!showOrders ? (
          <>
            {/* Add/Edit Product Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <input
                type="text"
                placeholder="Product Name"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price (KSh)"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex-1"
                >
                  {loading ? "Saving..." : editingProduct ? "Update" : "Add Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setForm({ name: "", price: "", category: "", quantity: "" });
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Product List */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">My Products</h2>
            {loading && !products.length ? (
              <Loader />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="p-4 bg-white shadow rounded-lg border border-gray-100 hover:shadow-lg transition"
                  >
                    <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                    <p className="text-gray-600 mb-1">Price: KSh {p.price}</p>
                    <p className="text-gray-600 mb-1">Qty: {p.quantity}</p>
                    <p className="text-sm text-gray-400 mb-3">{p.category}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No products yet.</p>
            )}
          </>
        ) : (
          <>
            {/* Orders List */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Orders for My Products</h2>
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
                        <p className="text-gray-600">
                          Buyer: {order.buyer?.name || "Unknown"} ({order.buyer?.email})
                        </p>
                        <p className="text-gray-600">Quantity: {order.quantity}</p>
                        <p className="text-gray-600">Total: KSh {order.totalPrice}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
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
                          <select
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="border p-2 rounded text-sm"
                            disabled={ordersLoading}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No orders yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
