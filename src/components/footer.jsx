import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-gray-100 text-gray-700 mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
        <div className="flex flex-col">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">Supported Sites</h4>
          <div className="flex flex-wrap items-center gap-6">
            <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="https://www.alibaba.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
              <img
                src="https://cdn.worldvectorlogo.com/logos/alibaba-2.svg"
                alt="Alibaba"
                className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"
                alt="eBay"
                className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
              <img
                src="https://cdn.worldvectorlogo.com/logos/shopify.svg"
                alt="Shopify"
                className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">Products</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Electronics</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Books</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Beauty</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Shoes</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Clothes</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Home</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Favorites</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Profile</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-6 text-xs border-t border-gray-200 bg-white/50">
        <p className="text-gray-600">
          © 2025 <span className="font-medium text-blue-600">Bluecart</span>. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
