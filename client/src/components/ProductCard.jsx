import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Star, ChevronLeft, Loader2, ThumbsUp, ShieldCheck } from 'lucide-react';
import Footer from "../components/footer";

const getProductName = (product, platform) => {
  switch (platform) {
    case 'alibaba':
      return product.product_title || product.title || 'Unknown Product';
    case 'amazon':
      return product.name || product.title || 'Unknown Product';
    default:
      return product.name || product.title || 'Unknown Product';
  }
};

const getProductImage = (product, platform) => {
  switch (platform) {
    case 'alibaba':
      return product.image_url || product.images?.[0] || 'https://via.placeholder.com/300x200?text=Product+Image';
    case 'amazon':
      return product.images?.[0] || product.image || 'https://via.placeholder.com/300x200?text=Product+Image';
    default:
      return product.images?.[0] || product.image || 'https://via.placeholder.com/300x200?text=Product+Image';
  }
};

const getProductSpecs = (product, platform) => {
  const baseSpecs = {};
  
  switch (platform) {
    case 'alibaba':
      baseSpecs.Price = product.app_sale_price || product.price || 'Price not available';
      baseSpecs.Rating = product.evaluate_rate || 'Not rated';
      baseSpecs['Original Price'] = product.original_price || 'N/A';
      baseSpecs['Sales'] = product.volume || 'N/A';
      baseSpecs['Store Name'] = product.store_name || 'N/A';
      break;
    case 'amazon':
      baseSpecs.Price = product.price ? `${product.price.toFixed(2)}` : 'Price not available';
      baseSpecs.Rating = product.rating || 'Not rated';
      break;
    default:
      baseSpecs.Price = product.price ? `${product.price.toFixed(2)}` : 'Price not available';
      baseSpecs.Rating = product.rating || 'Not rated';
  }
  
  return {
    ...baseSpecs,
    ...(product.specifications || {}),
    ...(product.specs || {})
  };
};

// Review component for displaying individual reviews
const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={
          star <= Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className="flex mr-2">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm font-medium text-gray-900">{review.author}</span>
          {review.verified_purchase && (
            <div className="ml-2 flex items-center text-green-600">
              <ShieldCheck size={14} />
              <span className="text-xs ml-1">Verified Purchase</span>
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      
      {review.title && (
        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
      )}
      
      <p className="text-gray-700 text-sm leading-relaxed mb-2">{review.text}</p>
      
      {review.helpful_votes > 0 && (
        <div className="flex items-center text-sm text-gray-500">
          <ThumbsUp size={14} />
          <span className="ml-1">{review.helpful_votes} people found this helpful</span>
        </div>
      )}
    </div>
  );
};

export const ProductCard = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const queryParams = new URLSearchParams(location.search);
  const platformFromQuery = queryParams.get('platform');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          throw new Error('Missing product ID');
        }

        let platformToUse = platformFromQuery;
        let productId = id;

        if (id.includes('-')) {
          const parts = id.split('-');
          const potentialPlatform = parts[0].toLowerCase();
          
          if (['alibaba', 'amazon', 'walmart'].includes(potentialPlatform)) {
            platformToUse = potentialPlatform;
            productId = parts.slice(1).join('-'); 
          }
        }

        if (!platformToUse) {
          platformToUse = 'amazon';
          console.warn('No platform specified, defaulting to amazon');
        }

        console.log(`Fetching ${platformToUse} product with ID: ${productId}`);
        
        const url = `https://bluecart-marketplace-mjzs.onrender.com/products/${productId}?platform=${platformToUse}`;
        console.log('API URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        console.log('API Response:', data); 
        
        if (!data.success) {
          throw new Error(data.detail || 'Failed to fetch product details');
        }

        if (!data.product || Object.keys(data.product).length === 0) {
          throw new Error('No product data found in API response');
        }

        // Transform API response based on platform
        let transformedProduct;
        
        if (platformToUse === 'alibaba') {
          transformedProduct = {
            id: id,
            product_name: data.product.product_title || data.product.title || 'Unknown Product',
            platform: platformToUse,
            image_url: data.product.image_url || data.product.images?.[0] || 'https://via.placeholder.com/300x200?text=Product+Image',
            specs: {
              Price: data.product.app_sale_price || data.product.price || 'Price not available',
              Rating: data.product.evaluate_rate || 'Not rated',
              'Original Price': data.product.original_price || 'N/A',
              'Sales Volume': data.product.volume || 'N/A',
              'Store Name': data.product.store_name || 'N/A',
              ...(data.product.specifications || {}),
              ...(data.product.specs || {})
            },
            reviews: data.product.reviews || [],
            rawData: data
          };
        } else {
          transformedProduct = {
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
            reviews: data.product.reviews || [],
            rawData: data
          };
        }

        setProduct(transformedProduct);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, platformFromQuery]);

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
              Product ID: {id} | Platform: {id.split('-')[0] || 'Not specified'}
            </p>
            <p className="text-sm text-gray-500">
              API URL: https://bluecart-marketplace-mjzs.onrender.com/products/{id.includes('-') ? id.split('-').slice(1).join('-') : id}?platform={id.split('-')[0] || 'amazon'}
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

  const hasReviews = product.platform === 'amazon' && product.reviews && product.reviews.length > 0;

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

        <div className="grid md:grid-cols-2 gap-8 mb-8">
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
            
            {/* Platform badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.platform === 'alibaba' ? 'bg-orange-100 text-orange-800' :
                product.platform === 'amazon' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
              </span>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.floor(parseFloat(product.specs.Rating) || 0)
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
                View on {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
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

        {hasReviews && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Customer Reviews ({product.reviews.length})
                </button>
              </nav>
            </div>
          </div>
        )}

        {hasReviews && activeTab === 'reviews' ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <ReviewCard key={review.id || index} review={review} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.rawData?.product?.description || 
                 product.rawData?.product?.product_description ||
                 'No description available for this product.'}
              </p>
            </div>
          </div>
        )}

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