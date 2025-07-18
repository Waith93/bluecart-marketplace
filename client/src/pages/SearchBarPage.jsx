import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ChevronDown, Search, Loader2 } from 'lucide-react';
import Footer from "../components/footer";

const SearchBarPage = () => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Best Rating");
  const [searchQuery, setSearchQuery] = useState("laptop");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const USE_MOCK_DATA = true; // Set to false mockdata and replace with real APIs

  const sortOptions = [
    'Best Rating',
    'High Price',
    'Low Price'
  ];

  const platforms = [
    { id: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { id: 'shopify', name: 'Shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    { id: 'ebay', name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg' },
    { id: 'alibaba', name: 'Alibaba', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Alibaba_Group_Logo.svg' }
  ];

  // Mock data for development
  const mockProducts = [
    {
      id: 1,
      name: "Gaming Laptop 15.6\" RTX 4060",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
      rating: 4.5,
      reviews: 328,
      platform: 'amazon',
      url: 'https://amazon.com/example'
    },
    {
      id: 2,
      name: "MacBook Pro 14\" M3 Chip",
      price: 1999.00,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop",
      rating: 1.0,
      reviews: 756,
      platform: 'shopify',
      url: 'https://shopify.com/example'
    },
    {
      id: 3,
      name: "Dell XPS 13 Ultrabook",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=200&fit=crop",
      rating: 3.0,
      reviews: 89,
      platform: 'ebay',
      url: 'https://ebay.com/example'
    },
    {
      id: 4,
      name: "Business Laptop 15.6\" Intel i7",
      price: 649.99,
      image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=300&h=200&fit=crop",
      rating: 4.1,
      reviews: 234,
      platform: 'alibaba',
      url: 'https://alibaba.com/example'
    }
  ];

  // API call functions 
  const apiService = {
    // Amazon API 
    fetchAmazonProducts: async (query, page = 1) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          products: mockProducts.filter(p => p.platform === 'amazon'),
          totalCount: mockProducts.filter(p => p.platform === 'amazon').length,
          hasMore: false
        };
      }

      try {
        const response = await fetch('/api/amazon/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query, 
            page,
            limit: 20 
          })
        });
        
        if (!response.ok) throw new Error('Amazon API error');
        return await response.json();
      } catch (error) {
        console.error('Amazon fetch error:', error);
        return { products: [], error: error.message };
      }
    },

    // eBay API call
    fetchEbayProducts: async (query, page = 1) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
          products: mockProducts.filter(p => p.platform === 'ebay'),
          totalCount: mockProducts.filter(p => p.platform === 'ebay').length,
          hasMore: false
        };
      }

      try {
        const response = await fetch('/api/ebay/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query, 
            page,
            limit: 20 
          })
        });
        
        if (!response.ok) throw new Error('eBay API error');
        return await response.json();
      } catch (error) {
        console.error('eBay fetch error:', error);
        return { products: [], error: error.message };
      }
    },

    // Shopify API call
    fetchShopifyProducts: async (query, page = 1) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return {
          products: mockProducts.filter(p => p.platform === 'shopify'),
          totalCount: mockProducts.filter(p => p.platform === 'shopify').length,
          hasMore: false
        };
      }

      try {
        const response = await fetch('/api/shopify/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query, 
            page,
            limit: 20 
          })
        });
        
        if (!response.ok) throw new Error('Shopify API error');
        return await response.json();
      } catch (error) {
        console.error('Shopify fetch error:', error);
        return { products: [], error: error.message };
      }
    },

    // Alibaba API call
    fetchAlibabaProducts: async (query, page = 1) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 900));
        return {
          products: mockProducts.filter(p => p.platform === 'alibaba'),
          totalCount: mockProducts.filter(p => p.platform === 'alibaba').length,
          hasMore: false
        };
      }

      try {
        const response = await fetch('/api/alibaba/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query, 
            page,
            limit: 20 
          })
        });
        
        if (!response.ok) throw new Error('Alibaba API error');
        return await response.json();
      } catch (error) {
        console.error('Alibaba fetch error:', error);
        return { products: [], error: error.message };
      }
    }
  };

  const fetchProducts = async (query, selectedPlatforms = [], page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Platform selection for search
      const platformsToSearch = selectedPlatforms.length > 0 
        ? selectedPlatforms 
        : platforms.map(p => p.id);

      // Create promises for each platform
      const platformPromises = platformsToSearch.map(async (platformId) => {
        switch (platformId) {
          case 'amazon':
            return apiService.fetchAmazonProducts(query, page);
          case 'ebay':
            return apiService.fetchEbayProducts(query, page);
          case 'shopify':
            return apiService.fetchShopifyProducts(query, page);
          case 'alibaba':
            return apiService.fetchAlibabaProducts(query, page);
          default:
            return { products: [], error: 'Unknown platform' };
        }
      });

      // Wait for all API calls to complete and see results from all platforms
      const results = await Promise.allSettled(platformPromises);
      
      const allProducts = [];
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { products: platformProducts, error } = result.value;
          if (error) {
            errors.push(`${platformsToSearch[index]}: ${error}`);
          } else {
            allProducts.push(...platformProducts);
          }
        } else {
          errors.push(`${platformsToSearch[index]}: ${result.reason}`);
        }
      });

      setProducts(allProducts);
      if (errors.length > 0) {
        setError(`Some platforms failed: ${errors.join(', ')}`);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(searchQuery, selectedPlatforms, 1);
  };

  useEffect(() => {
    fetchProducts(searchQuery, selectedPlatforms, 1);
  }, []);

  // Effect to refetch when filters change
  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      fetchProducts(searchQuery, selectedPlatforms, 1);
    }
  }, [selectedPlatforms]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(searchQuery, selectedPlatforms, page);
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    setSortDropdownOpen(false);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const isPriceInRange = (price, range) => {
    switch(range) {
      case 'under100': return price < 100;
      case '100-200': return price >= 100 && price <= 200;
      case '200-300': return price >= 200 && price <= 300;
      case 'over300': return price > 300;
      default: return true;
    }
  };

  const filteredProducts = products.filter(product => {
    // Rating filter
   if (selectedRating !== null && Math.floor(product.rating) !== selectedRating) {
  return false;
}


    // Price range filter
    if (selectedPriceRanges.length > 0) {
      const matchesPrice = selectedPriceRanges.some(range => 
        isPriceInRange(product.price, range)
      );
      if (!matchesPrice) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'Best Rating':
        return b.rating - a.rating;
      case 'High Price':
        return b.price - a.price;
      case 'Low Price':
        return a.price - b.price;
      default:
        return b.rating - a.rating;
    }
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Search section here */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Search
            </button>
          </div>
        </div>

        {/* Error handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        <div className="flex gap-6">
          <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="font-semibold mb-4">Filter</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price range</h4>
              <div className="space-y-2">
                {[
                  { id: 'under100', label: 'Under $100' },
                  { id: '100-200', label: '$100 - $200' },
                  { id: '200-300', label: '$200 - $300' },
                  { id: 'over300', label: 'Over $300' }
                ].map(range => (
                  <div key={range.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={range.id} 
                      className="mr-2"
                      checked={selectedPriceRanges.includes(range.id)}
                      onChange={() => handlePriceRangeChange(range.id)}
                    />
                    <label htmlFor={range.id} className="text-sm">{range.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Ratings</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating}`} className="flex items-center text-sm cursor-pointer">
                      <div className="flex mr-1">
                        {renderStars(rating)}
                      </div>
                      <span className="text-gray-600"></span>
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-all"
                    name="rating"
                    checked={selectedRating === null}
                    onChange={() => setSelectedRating(null)}
                    className="mr-2"
                  />
                  <label htmlFor="rating-all" className="text-sm cursor-pointer">All ratings</label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Electronics platform</h4>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={platform.id} 
                      className="mr-3"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => handlePlatformChange(platform.id)}
                    />
                    <img 
                      src={platform.logo} 
                      alt={platform.name}
                      className="w-6 h-6 mr-2"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <label htmlFor={platform.id} className="text-sm cursor-pointer">{platform.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Search result for "{searchQuery}"</h2>
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-blue-600 font-medium">{selectedSort}</span>
                    <ChevronDown size={16} className={`transform transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleSortChange(option)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                            selectedSort === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                  {loading ? '...' : sortedProducts.length}
                </span>
                <span className="text-gray-600 text-sm">results found</span>
                {(selectedRating || selectedPriceRanges.length > 0 || selectedPlatforms.length > 0) && (
                  <button 
  onClick={() => {
    setSelectedRating(null);
    setSelectedPriceRanges([]);
    setSelectedPlatforms([]);
    fetchProducts(searchQuery, [], 1); 
    setCurrentPage(1);
  }}

                    className="text-blue-600 text-sm hover:underline ml-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {loading && (
                <div className="text-center py-12">
                  <Loader2 size={48} className="animate-spin mx-auto text-blue-600 mb-4" />
                  <div className="text-gray-600">Searching products...</div>
                </div>
              )}

              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm">{product.name}</h3>
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating)}
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-lg">${product.price}</div>
                            <div className="flex items-center gap-1">
                              <img 
                                src={platforms.find(p => p.id === product.platform)?.logo} 
                                alt={platforms.find(p => p.id === product.platform)?.name}
                                className="w-5 h-5"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <span className="text-xs text-gray-500">
                                {platforms.find(p => p.id === product.platform)?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 text-lg mb-2">No products found</div>
                      <div className="text-gray-400 text-sm">Try adjusting your filters or search terms</div>
                    </div>
                  )}
                </div>
              )}

              {!loading && sortedProducts.length > 0 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg border ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === 3}
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchBarPage;