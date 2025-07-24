import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

function SearchBarPage() {
  const [filters, setFilters] = useState({
    rating: null,
    priceRanges: [],
    platforms: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ open: false, selected: "Best Rating" });
  const [search, setSearch] = useState({ query: "laptop", loading: false, error: null });
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://127.0.0.1:8000';
  const ITEMS_PER_PAGE = 9;
  
  const sortOptions = ['Best Rating', 'High Price', 'Low Price', 'Best Cost-Benefit'];// add cost benefit option
  const priceRanges = [
    { id: 'under100', label: 'Under $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: '200-300', label: '$200 - $300' },
    { id: 'over300', label: 'Over $300' }
  ];
  const platforms = [
    { id: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { id: 'walmart', name: 'Walmart', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg' },
    { id: 'shopify', name: 'Shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    { id: 'ebay', name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg' }
  ];

  const apiService = {
    fetchProducts: async (platform, query) => {
      try {
        const url = new URL(`${API_BASE_URL}/search`);
        url.searchParams.append('query', encodeURIComponent(query));
        url.searchParams.append('platform', platform);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Server error for ${platform}:`, errorData);
          throw new Error(`HTTP error! status: ${response.status}: ${errorData.detail || JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log(`API response for platform ${platform}:`, data);

        let products = [];
        
        if (data.data && Array.isArray(data.data.products)) {
          products = data.data.products;
        } else if (Array.isArray(data.products)) {
          products = data.products;
        } else if (Array.isArray(data.search_results)) {
          products = data.search_results;
        } else if (data.ItemArray && Array.isArray(data.ItemArray.Item)) {
          products = data.ItemArray.Item;
        } else {
          console.warn(`Unexpected API response structure for ${platform}:`, data);
          products = [];
        }

        products = products.map(product => {
          let price = 0;
          const rawPrice = product.price?.value || product.price || product.product_price || product.final_price;
          if (rawPrice !== undefined && rawPrice !== null) {
            const parsedPrice = parseFloat(rawPrice.toString().replace(/[^0-9.]/g, ''));
            price = isNaN(parsedPrice) ? 0 : parsedPrice;
          }

          const rating = parseFloat(
            product.rating || 
            product.ratings?.average || 
            product.product_star_rating ||
            product.review_rating ||
            0
          );

          const costBenefit = price > 0 ? rating / price : 0; //cost benefitfunction

          return {
            id: product.asin || product.itemId || product.id || product.product_id || `product-${Math.random().toString(36).slice(2)}`,
            name: product.title || product.name || product.product_title || 'Unknown Product',
            price: price,
            rating: rating,
            costBenefit: costBenefit,
            platform,
            image: product.image || 
                   product.thumbnail || 
                   product.product_photo || 
                   product.main_image ||
                   'https://via.placeholder.com/300x200?text=Product+Image',
            url: product.url || 
                 product.link || 
                 product.product_url ||
                 product.product_page_url ||
                 '#'
          };
        });

        return {
          products,
          totalCount: data.data?.total_products || data.total || data.total_results || data.totalCount || products.length,
          hasMore: data.hasMore || products.length >= 20
        };
      } catch (error) {
        console.error(`${platform} fetch error:`, error);
        return { 
          products: [], 
          error: error.message,
          totalCount: 0,
          hasMore: false
        };
      }
    }
  };

  const fetchProducts = async (query = search.query, selectedPlatforms = filters.platforms) => {
    setSearch(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // If no platforms are selected, use all platforms
      const platformsToSearch = selectedPlatforms.length > 0 ? selectedPlatforms : platforms.map(p => p.id);
      
      console.log('Searching platforms:', platformsToSearch);
      
      // Fetch from each platform individually
      const results = await Promise.allSettled(
        platformsToSearch.map(platform => apiService.fetchProducts(platform, query))
      );

      const allProducts = [];
      const errors = [];
      
      results.forEach((result, i) => {
        const platformName = platformsToSearch[i];
        if (result.status === 'fulfilled') {
          if (result.value.error) {
            errors.push(`${platformName}: ${result.value.error}`);
          } else {
            // Ensure each product has the correct platform assigned
            const productsWithPlatform = result.value.products.map(product => ({
              ...product,
              platform: platformName,
              // Add a unique ID that includes platform to avoid conflicts
              id: `${platformName}-${product.id}`
            }));
            allProducts.push(...productsWithPlatform);
            console.log(`Added ${productsWithPlatform.length} products from ${platformName}`);
          }
        } else {
          errors.push(`${platformName}: ${result.reason}`);
          console.error(`Failed to fetch from ${platformName}:`, result.reason);
        }
      });

      console.log('Total products fetched:', allProducts.length);
      console.log('Products by platform:', allProducts.reduce((acc, product) => {
        acc[product.platform] = (acc[product.platform] || 0) + 1;
        return acc;
      }, {}));

      setProducts(allProducts);
      
      if (errors.length > 0) {
        console.warn('Some platforms failed:', errors);
        if (errors.length === platformsToSearch.length) {
          setSearch(prev => ({ ...prev, error: `Failed to fetch from all platforms: ${errors.join(', ')}` }));
        } else {
          // Show partial success message
          const successfulPlatforms = platformsToSearch.filter((_, i) => results[i].status === 'fulfilled' && !results[i].value.error);
          console.log(`Successfully fetched from: ${successfulPlatforms.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      setSearch(prev => ({ ...prev, error: error.message || 'Failed to fetch products. Please check your search terms or try again later.' }));
      setProducts([]);
    } finally {
      setSearch(prev => ({ ...prev, loading: false }));
      setCurrentPage(1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(search.query, filters.platforms);
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters };
    if (type === 'platform') {
      newFilters.platforms = newFilters.platforms.includes(value) 
        ? newFilters.platforms.filter(p => p !== value) 
        : [...newFilters.platforms, value];
    } else if (type === 'price') {
      newFilters.priceRanges = newFilters.priceRanges.includes(value) 
        ? newFilters.priceRanges.filter(r => r !== value) 
        : [...newFilters.priceRanges, value];
    } else {
      newFilters.rating = value;
    }
    setFilters(newFilters);
    setCurrentPage(1);
    if (type === 'platform') fetchProducts(search.query, newFilters.platforms);
  };

  const handleClearFilters = () => {
    setFilters({ rating: null, priceRanges: [], platforms: [] });
    setCurrentPage(1);
    fetchProducts(search.query, []);
  };

  const handleViewDetails = (product) => {
  navigate(`/products/${product.id}`); // Changed from /product/ to /products/
  console.log('Navigating to product detail page for:', product.id);
}

  useEffect(() => { 
    console.log('Initial fetch on component mount');
    fetchProducts(); 
  }, []);

  const filteredProducts = products.filter(product => {
    if (filters.rating !== null && Math.floor(product.rating) !== filters.rating) return false;
    if (filters.priceRanges.length > 0 && !filters.priceRanges.some(range => {
      switch(range) {
        case 'under100': return product.price < 100;
        case '100-200': return product.price >= 100 && product.price <= 200;
        case '200-300': return product.price >= 200 && product.price <= 300;
        case 'over300': return product.price > 300;
        default: return true;
      }
    })) return false;
    return true;
  });

  const averageCostBenefit = filteredProducts.length > 0 
    ? filteredProducts.reduce((sum, product) => sum + product.costBenefit, 0) / filteredProducts.length
    : 0;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort.selected) {
      case 'Best Rating': return b.rating - a.rating;
      case 'High Price': return b.price - a.price;
      case 'Low Price': return a.price - b.price;
      case 'Best Cost-Benefit': return b.costBenefit - a.costBenefit;
      default: return b.rating - a.rating;
    }
  });

  const topMarginalBenefitProducts = [...filteredProducts] //add marginalbenefitfunction
    .sort((a, b) => (b.costBenefit - averageCostBenefit) - (a.costBenefit - averageCostBenefit))
    .slice(0, 3);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderStars = (rating) => Array(5).fill(0).map((_, i) => (
    <Star key={i} size={12} className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
  ));

  const TopMarginalBenefit = ({ products, averageCostBenefit }) => {
    if (products.length === 0 || search.loading) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Top Value Picks (Marginal Benefit)</h2>
        <p className="text-sm text-gray-600 mb-4">
          These products offer the best rating per dollar compared to the average. Higher marginal benefit means better value.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-3">
                <span className="text-sm font-semibold text-blue-600 mr-2">#{index + 1}</span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded mr-3"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/100x100?text=Product+Image')}
                />
                <div>
                  <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(product.rating)}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Price:</span> ${product.price.toFixed(2)}</div>
                <div><span className="font-medium">Cost-Benefit:</span> {product.costBenefit.toFixed(4)} (Rating/$)</div>
                <div>
                  <span className="font-medium">Marginal Benefit:</span>{' '}
                  <span className={`font-semibold ${product.costBenefit - averageCostBenefit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(product.costBenefit - averageCostBenefit).toFixed(4)} (vs Avg)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src={platforms.find(p => p.id === product.platform)?.logo}
                    alt=""
                    className="w-4 h-4"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <span className="text-xs text-gray-500">
                    {platforms.find(p => p.id === product.platform)?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(product)}
                className="w-full mt-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add platform distribution info for debugging
  const platformDistribution = products.reduce((acc, product) => {
    acc[product.platform] = (acc[product.platform] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search.query}
                onChange={(e) => setSearch(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={search.loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {search.loading && <Loader2 size={16} className="animate-spin" />}
              Search
            </button>
          </div>
        </div>

        {search.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-700 text-sm">{search.error}</div>
          </div>
        )}

        {/* Debug info - remove in production */}
        {Object.keys(platformDistribution).length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-blue-700 text-sm">
              <strong>Platform Distribution:</strong> {Object.entries(platformDistribution).map(([platform, count]) => `${platform}: ${count}`).join(', ')}
            </div>
          </div>
        )}

        <TopMarginalBenefit products={topMarginalBenefitProducts} averageCostBenefit={averageCostBenefit} />

        <div className="flex gap-6">
          <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="font-semibold mb-4">Filter</h3>
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price range</h4>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={range.id} 
                      className="mr-2"
                      checked={filters.priceRanges.includes(range.id)}
                      onChange={() => handleFilterChange('price', range.id)}
                    />
                    <label htmlFor={range.id} className="text-sm">{range.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Ratings</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleFilterChange('rating', rating)}
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                      <div className="flex mr-1">{renderStars(rating)}</div>
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-all"
                    name="rating"
                    checked={filters.rating === null}
                    onChange={() => handleFilterChange('rating', null)}
                    className="mr-2"
                  />
                  <label htmlFor="rating-all" className="text-sm">All ratings</label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Platforms</h4>
              <div className="space-y-3">
                {platforms.map(platform => (
                  <div key={platform.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={platform.id} 
                      className="mr-3"
                      checked={filters.platforms.includes(platform.id)}
                      onChange={() => handleFilterChange('platform', platform.id)}
                    />
                    <img 
                      src={platform.logo} 
                      alt={platform.name}
                      className="w-6 h-6 mr-2"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <label htmlFor={platform.id} className="text-sm">
                      {platform.name}
                      {platformDistribution[platform.id] && (
                        <span className="ml-1 text-xs text-gray-500">({platformDistribution[platform.id]})</span>
                      )}
                    </label>
                  </div>
                ))}
                <div className="mt-3 pt-2 border-t">
                  <button
                    onClick={() => {
                      const allSelected = platforms.every(p => filters.platforms.includes(p.id));
                      if (allSelected) {
                        setFilters(prev => ({ ...prev, platforms: [] }));
                        fetchProducts(search.query, []);
                      } else {
                        const allPlatforms = platforms.map(p => p.id);
                        setFilters(prev => ({ ...prev, platforms: allPlatforms }));
                        fetchProducts(search.query, allPlatforms);
                      }
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {platforms.every(p => filters.platforms.includes(p.id)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Search result for "{search.query}"</h2>
                <div className="relative">
                  <button
                    onClick={() => setSort(prev => ({ ...prev, open: !prev.open }))}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-blue-600 font-medium">{sort.selected}</span>
                    <ChevronDown size={16} className={`transform transition-transform ${sort.open ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {sort.open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      {sortOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => setSort({ open: false, selected: option })}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${sort.selected === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
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
                  {search.loading ? '...' : sortedProducts.length}
                </span>
                <span className="text-gray-600 text-sm">results found</span>
                {(filters.rating || filters.priceRanges.length > 0 || filters.platforms.length > 0) && (
                  <button onClick={handleClearFilters} className="text-blue-600 text-sm hover:underline ml-2">
                    Clear filters
                  </button>
                )}
              </div>

              {search.loading ? (
                <div className="text-center py-12">
                  <Loader2 size={48} className="animate-spin mx-auto text-blue-600 mb-4" />
                  <div className="text-gray-600">Searching products...</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentProducts.length > 0 ? (
                      currentProducts.map(product => (
                        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image'}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-medium text-sm">{product.name}</h3>
                            <div className="flex items-center gap-1">
                              {renderStars(product.rating)}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-lg">${product.price.toFixed(2)}</div>
                              <div className="flex items-center gap-1">
                                <img 
                                  src={platforms.find(p => p.id === product.platform)?.logo} 
                                  alt=""
                                  className="w-5 h-5"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                                <span className="text-xs text-gray-500">
                                  {platforms.find(p => p.id === product.platform)?.name}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Cost-Benefit:</span> {product.costBenefit.toFixed(4)} (Rating/$)
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Marginal Benefit:</span> {(product.costBenefit - averageCostBenefit).toFixed(4)} (vs Avg)
                            </div>
                            <button
                              onClick={() => handleViewDetails(product)}
                              className="w-full mt-2 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              View Details
                            </button>
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

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchBarPage;