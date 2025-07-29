import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Home, Search, Clock, Phone } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user_data");
      
      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUsername(user.username || "User");
          } catch (error) {
            setUsername("User");
          }
        }
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkAuth();
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setIsLoggedIn(false);
    setUsername("");
    setIsMenuOpen(false);
    navigate("/");
  };

  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const ContactItem = ({ children, icon: Icon, mobile = false, onClick }) => {
    if (mobile) {
      return (
        <button
          onClick={onClick}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 w-full text-left"
        >
          <Icon size={18} />
          <span className="font-medium">{children}</span>
        </button>
      );
    }

    return (
      <button
        onClick={onClick}
        className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:text-blue-600 hover:shadow-md hover:scale-105"
      >
        <Icon size={16} />
        <span>{children}</span>
      </button>
    );
  };

  const NavItem = ({ to, children, icon: Icon, mobile = false }) => {
    const active = isActive(to);
    
    if (mobile) {
      return (
        <Link
          to={to}
          onClick={() => setIsMenuOpen(false)}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
              : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
          }`}
        >
          <Icon size={18} />
          <span className="font-medium">{children}</span>
        </Link>
      );
    }

    return (
      <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
          active
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-110"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:text-blue-600 hover:shadow-md hover:scale-105"
        }`}
      >
        <Icon size={16} />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-purple-50 shadow-xl sticky top-0 z-50 border-b-2 border-blue-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Far Left */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🛒</span>
            </div>
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110"
            >
              BlueCart
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <NavItem to="/" icon={Home}>Home</NavItem>
            <NavItem to="/search" icon={Search}>Search</NavItem>
            <NavItem to="/history" icon={Clock}>History</NavItem>
            <ContactItem icon={Phone} onClick={scrollToFooter}>Contact Us</ContactItem>
          </div>

          {/* Auth Section - Far Right */}
          <div className="hidden md:flex items-center ml-auto">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive("/profile")
                      ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg transform scale-110"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100 hover:text-green-600 hover:shadow-md hover:scale-105"
                  }`}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span>{username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2 border-2 border-blue-400 rounded-full text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 font-medium hover:shadow-lg hover:scale-105 transform"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full hover:from-blue-700 hover:to-purple-800 transition-all duration-300 font-medium hover:shadow-lg hover:scale-105 transform"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button  */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 hover:scale-110 transform ml-auto"
          >
            {isMenuOpen ? <X size={24} className="text-purple-600" /> : <Menu size={24} className="text-blue-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-blue-200 py-4 bg-gradient-to-br from-white to-purple-50">
            <div className="space-y-3">
              <NavItem to="/" icon={Home} mobile>Home</NavItem>
              <NavItem to="/search" icon={Search} mobile>Search</NavItem>
              <NavItem to="/history" icon={Clock} mobile>History</NavItem>
              <ContactItem icon={Phone} mobile onClick={scrollToFooter}>Contact Us</ContactItem>
              
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive("/profile")
                        ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 hover:text-green-600"
                    }`}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">Profile ({username})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="px-4 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 border-2 border-blue-400 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;