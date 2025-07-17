// 

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = [
  {
    id: 1,
    title: 'Electronics',
    imageUrl:
      'https://www.shutterstock.com/shutterstock/photos/738107467/display_1500/stock-photo-collection-of-consumer-electronics-flying-in-the-air-d-render-on-grey-background-738107467.jpg',
  },
  {
    id: 2,
    title: 'Clothes',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ23_4_2CVc03mHCERs-sjwaHxExbbzSu4kFw&s',
  },
  {
    id: 3,
    title: 'Books',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6mMg8EQAvHmsc0pHDWSnasYbfsTjkHXOaDQ&s',
  },
  {
    id: 4,
    title: 'Beauty & Personal Care',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWDH0l5p6M3t69813kD657FMOIITO1iPsEcg&s',
  },
  {
    id: 5,
    title: 'Shoes',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpaEht6ZUPLdWdlsS8Nofggc9tUrwaH8hTQ&s',
  },
  {
    id: 6,
    title: 'Toys',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhYl1Ed1Qt6nxQQ9mMaPi9Ob6VICgXl6rVw&s',
  },
];

const ProductCategories = () => {
  const [loadingId, setLoadingId] = useState(null);

  const handleCategoryClick = async (category) => {
    setLoadingId(category.id);

    try {
      const response = await axios.post('/api/categories', {
        category: category.title,
      });

      toast.success(`Fetched ${category.title} products successfully!`);
      console.log('Category sent:', response.data);
    } catch (error) {
      toast.error(`Failed to fetch ${category.title} products.`);
      console.error('Error sending category:', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-center mb-8">Shop by category</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="h-48 overflow-hidden rounded-t-lg">
              <img
                src={category.imageUrl}
                alt={category.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <button
                onClick={() => handleCategoryClick(category)}
                disabled={loadingId === category.id}
                className={`${
                  loadingId === category.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded transition duration-200`}
              >
                {loadingId === category.id ? 'Loading...' : 'View Products'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
