import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-slate-50 to-gray-100 text-gray-700 mt-16 border-t border-gray-200"
    >
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
        {/* Supported Sites */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">Supported Sites</h4>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6 opacity-80 hover:opacity-100" />
            </a>
            <a href="https://www.alibaba.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <img src="https://cdn.worldvectorlogo.com/logos/alibaba-2.svg" alt="Alibaba" className="h-6 opacity-80 hover:opacity-100" />
            </a>
            <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-6 opacity-80 hover:opacity-100" />
            </a>
           <a href="https://www.target.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
  <span className="text-3xl">🎯</span>
</a>


          </div>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:support@bluecart.com" className="text-blue-600 hover:underline">support@bluecart.com</a></li>
            <li>Phone: <a href="tel:+254723456933" className="text-blue-600 hover:underline">+254723456933</a></li>
            <li>Address: Nairobi, Kenya</li>
            <li>Hours: Mon - Fri, 9am - 5pm</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-blue-600 transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="hover:text-blue-600 transition-colors"
                >
                  History
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-blue-600 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          {/* Social Icons */}
          <div className="flex mt-4 space-x-4 text-gray-500">
            <a href="https://github.com/bluecart" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 text-xl">
              <FaGithub />
            </a>
            <a href="https://twitter.com/bluecart" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 text-xl">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com/company/bluecart" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 text-xl">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">Subscribe to Newsletter</h4>
          <p className="text-sm mb-3 text-gray-600">Get the latest deals and updates right in your inbox.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 border border-gray-300 rounded-l-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 rounded-r-md text-sm hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 text-xs border-t border-gray-200 bg-white/50">
        <p className="text-gray-600">
          © 2025 <span className="font-medium text-blue-600">Bluecart</span>. All Rights Reserved
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;