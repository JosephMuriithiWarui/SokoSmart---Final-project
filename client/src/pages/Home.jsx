import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-700">SokoSmart Market</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="p-4 bg-white shadow rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600">Price: KSh {p.price}</p>
            <p className="text-gray-500 text-sm">Qty: {p.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
