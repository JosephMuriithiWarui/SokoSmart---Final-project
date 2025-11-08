import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    role: "buyer",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint;
      let payload;

      if (form.role === "farmer") {
        // Farmer registration
        endpoint = "/farmers/auth/register";
        payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          password: form.password,
        };
      } else {
        // Buyer registration
        endpoint = "/buyers/register";
        payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        };
      }

      await api.post(endpoint, payload);
      alert("✅ Signup successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      alert(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 mb-3 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          className="border p-2 mb-3 w-full rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <select
          className="border p-2 mb-3 w-full rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>
        {form.role === "farmer" && (
          <input
            type="text"
            placeholder="Location"
            className="border p-2 mb-3 w-full rounded"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
