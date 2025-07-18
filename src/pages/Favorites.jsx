// src/components/Favorites.jsx
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

function Favorites() {
  const favorites = useSelector((state) => state.favorites);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600 text-lg">No favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
