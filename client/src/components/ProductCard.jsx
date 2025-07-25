import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Star, ChevronLeft, Loader2 } from 'lucide-react';
import Footer from "../components/footer";

export const ProductCard = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get platform from query parameters
  const queryParams = new URLSearchParams(location.search);
  const platform = queryParams.get('platform');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          throw new Error('Missing product ID');
        }

        let platformToUse = platform;
        if (!platformToUse && id) {
          const parts = id.split('-');
          if (parts.length >= 2) {
            platformToUse = parts[0]; 
          }
        }

        // Default to amazon if still no platform found
        if (!platformToUse) {
          platformToUse = 'amazon';
          console.warn('No platform specified, defaulting to amazon');
        }

        console.log(`Fetching ${platformToUse} product with ID: ${id}`);
        
        let productId = id;
        if (id.includes('-') && platformToUse) {
          const parts = id.split('-');
          if (parts[0].toLowerCase() === platformToUse.toLowerCase()) {
            productId = parts.slice(1).join('-');
          }
        }
        
        console.log(`Using product ID: ${productId} for platform: ${platformToUse}`);
        const url = `http://127.0.0.1:8000/products/${productId}?platform=${platformToUse}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        console.log('API Response:', data); // Debug log
        
        if (!data.success) {
          throw new Error(data.detail || 'Failed to fetch product details');
        }

        // Check if product data exists
        if (!data.product || Object.keys(data.product).length === 0) {
          throw new Error('No product data found in API response');
        }

        // Transform API response to match  component expected format
        const transformedProduct = {
          id: id,
          product_name: data.product.name || data.product.title || 'Unknown Product',
          platform: platformToUse,
          image_url: data.product.images?.[0] || data.product.image || 'https://via.placeholder.com/300x200?text=Product+Image',
          specs: {
            Price: data.product.price ? `${data.product.price.toFixed(2)}` : 'Price not available',
            Rating: data.product.rating || 'Not rated',
            ...(data.product.specifications || {}),
            ...(data.product.specs || {})
          },
          rawData: data // 
        };

        setProduct(transformedProduct);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, platform]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4 flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2">Loading product details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4 flex-grow">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800">Error Loading Product</h2>
            <p className="text-red-600">{error}</p>
            <p className="mt-2 text-sm text-gray-600">
              Product ID: {id} | Platform: {platform || 'Not specified'}
            </p>
            <p className="text-sm text-gray-500">
              API URL: http://127.0.0.1:8000/products/{id}?platform={platform || 'amazon'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4 flex-grow">
          <h2 className="text-lg font-semibold">Product Not Found</h2>
          <p>We couldn't find details for this product.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 flex-grow">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="mr-1" size={20} />
            Back to results
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image_url}
              alt={product.product_name}
              className="w-full rounded-lg shadow-md"
              onError={(e) => (e.target.src = "https://via.placeholder.com/500x500?text=Product+Image")}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.floor(product.specs.Rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.specs.Rating || 'No ratings'}
              </span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {product.specs.Price || 'Price not available'}
              </h2>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                View on {product.platform}
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <ul className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li key={key} className="border-b pb-2 last:border-b-0">
                    <strong className="text-gray-700">{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Debug section - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <details>
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                Debug Information
              </summary>
              <pre className="mt-2 text-xs overflow-auto max-h-60 p-2 bg-white rounded">
                {JSON.stringify(product.rawData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductCard;