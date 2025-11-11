import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/Notification.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Read and clear selected role
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setSelectedRole(role);
      localStorage.removeItem("selectedRole");
    }
  }, []);

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

      showNotification("Login successful!", "success");
      
      // Redirect based on role
      if (role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/buyer");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      showNotification(errorMessage, "error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-[#eaf2ed]">
      <div className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Login</h2>
        {selectedRole && (
          <p className="text-center text-sm text-gray-600 mb-4">
            Continue as {selectedRole === "farmer" ? "Farmer/Seller" : "Buyer"}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-gray-200 p-3 mb-4 w-full rounded-lg focus:outline-none focus:border-green-500 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-gray-200 p-3 mb-4 w-full rounded-lg focus:outline-none focus:border-green-500 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-[#31694E] text-white w-full py-3 rounded-lg hover:bg-[#2a5a42] transition font-semibold text-lg"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#31694E] cursor-pointer hover:text-[#2a5a42] font-semibold"
          >
            Sign up
          </span>
        </p>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
