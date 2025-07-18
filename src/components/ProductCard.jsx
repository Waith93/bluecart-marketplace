import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../store/favoritesSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const isFavorited = favorites.some((fav) => fav.id === product.id);

  const toggleFavorite = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain mb-4 rounded-xl"
      />
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h3>
      <p className="text-gray-600 mb-2">${product.price}</p>
      <p className="text-sm text-gray-500 mb-4">{product.platform}</p>
      <button
        onClick={toggleFavorite}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          isFavorited
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isFavorited ? "❤️ Remove Favorite" : "🤍 Add to Favorites"}
      </button>
    </div>
  );
}

export default ProductCard;
