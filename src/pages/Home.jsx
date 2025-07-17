import Footer from "../components/footer";  

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      

      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Compare, choose and save
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Find the best deals across multiple ecommerce platforms
          </p>
          
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search a product"
              className="w-full px-8 py-5 text-lg text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl placeholder-gray-500"
            />
            <button className="absolute right-3 top-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="text-xl">🔍</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why choose BlueCart?</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Discover the advantages that make us the smart choice for savvy shoppers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🔎</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Search across multiple platforms simultaneously with our advanced algorithm
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Multiple Results</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Search for products and get comprehensive price comparisons instantly
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Cost Benefit</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Compare total cost including shipping to find the best deals available
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start saving?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of smart shoppers who use BlueCart to find the best deals
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Get Started Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;