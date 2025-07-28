import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, ShoppingCart, Award } from "lucide-react";
import Footer from "../components/footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const platforms = [
    { name: "Amazon", logo: "🛒" },
    { name: "eBay", logo: "🏪" },
    { name: "Alibaba", logo: "🏬" },
    { name: "Target", logo: "🎯" },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Compare, Choose & <span className="text-yellow-300">Save</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Find the best deals across multiple ecommerce platforms in seconds
          </p>
          
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for any product..."
              className="w-full px-8 py-5 text-lg text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl placeholder-gray-500 pr-16"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Search size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-gray-600">Products Compared</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">$2M+</div>
              <div className="text-gray-600">Money Saved</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why choose BlueCart?</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Discover the advantages that make us the smart choice for savvy shoppers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group p-8 rounded-3xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Search across multiple platforms simultaneously with our advanced algorithm
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Real-time Prices</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Get live price updates and comprehensive comparisons instantly
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Best Deals</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Compare total cost including shipping to find the best deals available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms section*/}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Across Top Platforms</h2>
          <p className="text-gray-600 mb-12">We compare prices from all major ecommerce sites</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                <div className="text-4xl mb-4">{platform.logo}</div>
                <h3 className="font-semibold text-gray-800">{platform.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start saving?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of smart shoppers who use BlueCart to find the best deals
          </p>
          <button 
            onClick={() => navigate('/search')}
            className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center space-x-2"
          >
            <ShoppingCart size={24} />
            <span>Start Shopping Now</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;