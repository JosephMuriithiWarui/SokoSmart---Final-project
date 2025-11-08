import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Try farmer login first, then buyer login
      let res;
      let role;

      try {
        res = await api.post("/farmers/auth/login", form);
        role = "farmer";
        // Farmer login returns: { message, token }
        localStorage.setItem("token", res.data.token);
      } catch {
        // If farmer login fails, try buyer login
        res = await api.post("/buyers/login", form);
        role = "buyer";
        // Buyer login returns: { token, buyer }
        localStorage.setItem("token", res.data.token);
      }

      alert("✅ Login successful!");
      
      // Redirect based on role
      if (role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/buyer");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      alert(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-600 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
