import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">BlueCart</Link>
      </div>

      <div className="space-x-6 text-gray-700 font-medium hidden md:flex">
        <Link to="/">Home</Link>
        <Link to="/Product Categories">Products</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/search">Search</Link>
      </div>

      <div className="space-x-4">
        <Link
          to="/profile"
          className="text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
