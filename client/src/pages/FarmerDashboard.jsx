import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal.jsx";
import { useNotification } from "../components/Notification.jsx";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
  });
  const { showNotification } = useNotification();

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
      showNotification("Failed to load products. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load orders for farmer's products
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Please login first", "warning");
      return;
    }

    // Check if user is a farmer
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role !== "farmer") {
        showNotification("You must be logged in as a farmer to view orders", "warning");
        return;
      }
    } catch {
      showNotification("Invalid token. Please login again.", "error");
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
        showNotification("Access denied. Please make sure you're logged in as a farmer.", "error");
      } else {
        showNotification(errorMessage, "error");
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
      showNotification("Please login first", "warning");
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
        showNotification("Product updated successfully!", "success");
      } else {
        // Create product
        const res = await api.post("/products", {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
        setProducts([...products, res.data]);
        showNotification("Product added successfully!", "success");
      }
      setForm({ name: "", price: "", category: "", quantity: "" });
      setEditingProduct(null);
      setIsProductModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error saving product";
      showNotification(errorMessage, "error");
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
    setIsProductModalOpen(true);
  };

  // Delete product
  const handleDelete = async (productId) => {

    try {
      setLoading(true);
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      showNotification("Product deleted successfully!", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error deleting product";
      showNotification(errorMessage, "error");
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
      showNotification("Order status updated!", "success");
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update order status", "error");
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#31694E] mb-6">
          Farmer Dashboard 🌾
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
            My Products
          </button>
          <button
            onClick={() => {
              setShowOrders(true);
              fetchOrders();
            }}
            className={`px-4 py-2 font-semibold ${
              showOrders
                ? "text-[#31694E] border-b-2 border-[#31694E]"
                : "text-gray-500"
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {!showOrders ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setForm({ name: "", price: "", category: "", quantity: "" });
                  setIsProductModalOpen(true);
                }}
                className="bg-[#31694E] text-white px-4 py-2 rounded hover:bg-[#2a5a42]"
              >
                + Add New Product
              </button>
            </div>

            <Modal
              isOpen={isProductModalOpen}
              onClose={() => setIsProductModalOpen(false)}
              title={editingProduct ? "Edit Product" : "Add New Product"}
              size="md"
            >
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Product Name"
                  className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#31694E]"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Price (KSh)"
                  className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#31694E]"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#31694E]"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#31694E]"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#31694E] text-white px-4 py-2 rounded hover:bg-[#2a5a42] disabled:opacity-50 flex-1"
                  >
                    {loading ? "Saving..." : editingProduct ? "Update" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>

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
                        className="bg-[#31694E] text-white px-3 py-1 rounded text-sm hover:bg-[#2a5a42] flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteProductId(p._id)}
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

            <Modal
              isOpen={!!deleteProductId}
              onClose={() => setDeleteProductId(null)}
              title="Confirm Delete"
              size="sm"
            >
              <p className="mb-6">Are you sure you want to delete this product?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const id = deleteProductId;
                    setDeleteProductId(null);
                    handleDelete(id);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteProductId(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                >
                  Cancel
                </button>
              </div>
            </Modal>
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
