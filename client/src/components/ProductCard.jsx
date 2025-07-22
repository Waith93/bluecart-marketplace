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
        const res = await fetch(`https://bluecart-marketplace-mjzs.onrender.com/api/products/${id}`);

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
        />

        <div className="bg-white shadow p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">Product Specs</h2>
          <ul className="list-disc pl-5">
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Cost-Benefit Analysis</h2>
          <p>
            CB Score: {product.cb_score} (
            <span className="font-bold">{product.cb_level}</span>)
          </p>
          <p>MB Score: {product.mb_score}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Compare with Other Retailers</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Platform</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Delivery</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Cost Benefit</th>
                <th className="border px-4 py-2">Marginal Benefit</th>
              </tr>
            </thead>
            <tbody>
              {product.retailers.map((retailer, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{retailer.platform}</td>
                  <td className="border px-4 py-2">${retailer.price}</td>
                  <td className="border px-4 py-2">${retailer.delivery_cost}</td>
                  <td className="border px-4 py-2">{retailer.rating} ⭐</td>
                  <td className="border px-4 py-2">
                    {retailer.cb_score} ({retailer.cb_level})
                  </td>
                  <td className="border px-4 py-2">
                    {retailer.mb_score} ({retailer.mb_level})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     <Footer />
    </div>
  );
};

export default ProductCard;