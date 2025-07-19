import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

const SearchBarPage = () => {
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


  const USE_MOCK_DATA = true;
  const sortOptions = ['Best Rating', 'High Price', 'Low Price'];
  const priceRanges = [
    { id: 'under100', label: 'Under $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: '200-300', label: '$200 - $300' },
    { id: 'over300', label: 'Over $300' }
  ];
  const platforms = [
    { id: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { id: 'shopify', name: 'Shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    { id: 'ebay', name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg' },
    { id: 'alibaba', name: 'Alibaba', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Alibaba_Group_Logo.svg' }
  ];
   const mockProducts = [
    { id: 1, name: "Gaming Laptop 15.6\" RTX 4060", price: 129.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop", rating: 4.5, platform: 'amazon', url: 'https://amazon.com/example' },
    { id: 2, name: "MacBook Pro 14\" M3 Chip", price: 1999.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop", rating: 1.0, platform: 'shopify', url: 'https://shopify.com/example' },
    { id: 3, name: "Dell XPS 13 Ultrabook", price: 899.99, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=200&fit=crop", rating: 3.0, platform: 'ebay', url: 'https://ebay.com/example' },
    { id: 4, name: "Business Laptop 15.6\" Intel i7", price: 649.99, image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=300&h=200&fit=crop", rating: 4.1, platform: 'alibaba', url: 'https://alibaba.com/example' }
  ];
  const apiService = {
    fetchProducts: async (platform, query, page) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
        return {
          products: mockProducts.filter(p => p.platform === platform),
          totalCount: mockProducts.filter(p => p.platform === platform).length,
          hasMore: false
        };
      }
      
      try {
        const response = await fetch(`/api/${platform}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, page, limit: 20 })
        });
        if (!response.ok) throw new Error(`${platform} API error`);
        return await response.json();
      } catch (error) {
        console.error(`${platform} fetch error:`, error);
        return { products: [], error: error.message };
      }
    }
  };

  const fetchProducts = async (query = search.query, selectedPlatforms = filters.platforms, page = 1) => {
    setSearch(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const platformsToSearch = selectedPlatforms.length > 0 ? selectedPlatforms : platforms.map(p => p.id);
      const results = await Promise.allSettled(
        platformsToSearch.map(platform => apiService.fetchProducts(platform, query, page))
      );

      const allProducts = [];
      const errors = results
        .map((result, i) => {
          if (result.status === 'fulfilled') {
            if (result.value.error) return `${platformsToSearch[i]}: ${result.value.error}`;
            allProducts.push(...result.value.products);
          } else {
            return `${platformsToSearch[i]}: ${result.reason}`;
          }
        })
        .filter(Boolean);

      setProducts(allProducts);
      if (errors.length) setSearch(prev => ({ ...prev, error: `failed to fetch platform: ${errors.join(', ')}` }));
    } catch (error) {
      setSearch(prev => ({ ...prev, error: 'Failed to fetch products. Please try again.' }));
      setProducts([]);
    } finally {
      setSearch(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(search.query, filters.platforms, 1);
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
    if (type === 'platform') fetchProducts(search.query, newFilters.platforms, 1);
  };

  const handleClearFilters = () => {
    setFilters({ rating: null, priceRanges: [], platforms: [] });
    setCurrentPage(1);
    fetchProducts(search.query, [], 1);
  };

  const handleViewDetails = (product) => {
  navigate(`/product/${product.id}`);
    console.log('Navigating to product detail page for:', product.id);
  };

  
  useEffect(() => { fetchProducts(); }, []);

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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort.selected) {
      case 'Best Rating': return b.rating - a.rating;
      case 'High Price': return b.price - a.price;
      case 'Low Price': return a.price - b.price;
      default: return b.rating - a.rating;
    }
  });

  const renderStars = (rating) => Array(5).fill(0).map((_, i) => (
    <Star key={i} size={12} className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search section */}
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
                    <label htmlFor={platform.id} className="text-sm">{platform.name}</label>
                  </div>
                ))}
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
                    {sortedProducts.length > 0 ? (
                      sortedProducts.map(product => (
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
                              <div className="font-semibold text-lg">${product.price}</div>
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

                  {sortedProducts.length > 0 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {[1, 2, 3].map(page => (
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
                        disabled={currentPage === 3}
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
};

export default SearchBarPage;