import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/footer";

const ProductCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        // Try different possible endpoint patterns
        const response = await fetch(`http://127.0.0.1:8000/products/${id}`);
        
        console.log('Response status:', response.status);
        console.log('Response URL:', response.url);
        
        const responseText = await response.text();
        console.log('Raw response (first 200 chars):', responseText.substring(0, 200));
        
        if (!response.ok) {
          console.error('API Error:', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Try to parse as JSON only if response looks like JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          const data = JSON.parse(responseText);
          setProduct(data);
        } else {
          throw new Error('Response is not JSON - received HTML page');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Only fetch if id exists
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found.</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 flex-grow">
        <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>
        <p className="text-sm text-gray-500 mb-4">Platform: {product.platform}</p>

        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Product+Image")}
        />

        <div className="bg-white shadow p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">Product Details</h2>
          <ul className="list-disc pl-5">
            {Object.entries(product.specs || {}).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCard;