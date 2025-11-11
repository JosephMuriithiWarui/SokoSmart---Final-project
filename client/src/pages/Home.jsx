import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Home() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Check if user has token (is logged in)
    const token = localStorage.getItem("token");
    
    if (token) {
      // User is logged in, redirect to their dashboard
      if (role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/buyer");
      }
    } else {
      // User not logged in, redirect to login
      // Store the selected role in localStorage to remember it
      localStorage.setItem("selectedRole", role);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="SokoSmart Logo" className="h-10 w-auto" />
              <span className="ml-3 text-2xl font-bold text-[#31694E]">SokoSmart</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-[#31694E] transition">Home</a>
              <a href="#about" className="text-gray-700 hover:text-[#31694E] transition">About</a>
              <a href="#services" className="text-gray-700 hover:text-[#31694E] transition">Services</a>
              <button
                onClick={() => navigate("/login")}
                className="bg-[#31694E] text-white px-4 py-2 rounded-lg hover:bg-[#2a5a42] transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-[#31694E]">SokoSmart</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Your trusted marketplace connecting farmers and buyers. 
              Fresh produce, fair prices, seamless transactions.
            </p>
            
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
              <div 
                onClick={() => handleRoleSelection("farmer")}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#31694E]"
              >
                <div className="text-6xl mb-4">🌾</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">I'm a Farmer/Seller</h2>
                <p className="text-gray-600 mb-6">
                  List your products, manage inventory, and reach more customers. 
                  Grow your business with SokoSmart.
                </p>
                <button className="bg-[#31694E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a42] transition w-full">
                  Get Started as Farmer
                </button>
              </div>

              <div 
                onClick={() => handleRoleSelection("buyer")}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#31694E]"
              >
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">I'm a Buyer</h2>
                <p className="text-gray-600 mb-6">
                  Browse fresh produce, compare prices, and order directly from farmers. 
                  Quality products delivered to you.
                </p>
                <button className="bg-[#31694E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a42] transition w-full">
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About SokoSmart</h2>
            <div className="w-24 h-1 bg-[#31694E] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Bridging the Gap Between Farmers and Buyers
              </h3>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                SokoSmart is a revolutionary platform designed to connect local farmers 
                directly with buyers, eliminating middlemen and ensuring fair prices for both parties.
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Our mission is to empower farmers by providing them with a direct channel 
                to market their produce while giving buyers access to fresh, quality products 
                at competitive prices.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                With SokoSmart, you can trust that you're getting the best value, whether 
                you're selling your harvest or buying fresh produce for your family.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Active Farmers</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-gray-600">Happy Buyers</div>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">10K+</div>
                <div className="text-gray-600">Products Listed</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">
              Everything you need for a seamless marketplace experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Product Management</h3>
              <p className="text-gray-600">
                Easy-to-use dashboard for farmers to list, update, and manage their products 
                with real-time inventory tracking.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Search</h3>
              <p className="text-gray-600">
                Advanced search and filter options help buyers find exactly what they're 
                looking for quickly and efficiently.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure Transactions</h3>
              <p className="text-gray-600">
                Safe and secure payment processing ensures that all transactions are 
                protected and reliable.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive analytics help farmers track sales, understand customer 
                behavior, and grow their business.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Management</h3>
              <p className="text-gray-600">
                Streamlined order processing from placement to delivery, keeping both 
                farmers and buyers informed every step of the way.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Rating System</h3>
              <p className="text-gray-600">
                Build trust with our rating and review system, helping buyers make 
                informed decisions and farmers improve their service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="SokoSmart Logo" className="h-8 w-auto rounded-full" />
                <span className="ml-2 text-xl font-bold">SokoSmart</span>
              </div>
              <p className="text-gray-400">
                Connecting farmers and buyers for a better marketplace experience.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><button onClick={() => navigate("/login")} className="hover:text-white transition">Login</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Farmers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleRoleSelection("farmer")} className="hover:text-white transition">Get Started</button></li>
                <li><a href="#services" className="hover:text-white transition">Features</a></li>
                <li><a href="#about" className="hover:text-white transition">Learn More</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleRoleSelection("buyer")} className="hover:text-white transition">Start Shopping</button></li>
                <li><a href="#services" className="hover:text-white transition">Browse Products</a></li>
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SokoSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
