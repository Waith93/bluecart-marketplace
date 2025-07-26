import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Wireless noise cancelling headphones",
    price: "$3.99",
    store: "Amazon",
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT166jvzSgZqoDKwqG3pQrTDAPg8fJdHnjGoHaVcZo-3W9KZUIb-7Pv_pXFvkovyn6oqEqwAh4mbnx5eP8HnscocvYIS4KScBaT_HJMkAIEvYwVO7xUFCBlKBjtligSrZEp85Q39Kj5LbM&usqp=CAc",
  },
  {
    id: 2,
    name: "Samsung phone",
    price: "$598",
    store: "Ebay",
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR3WI6630giNBxcYdCF0EcbEEDvj0zbTlFCsqaeM_0ymRfmvOVBRrvvzVsPk-7OuiMaMgz78oZYTx2mHWqx8yfSsiOnX6scFi08SvGF2IdNJFms8EUPcdsQCd9HvIMDxyKTOMznNrfE4do&usqp=CAc",
  },
  {
    id: 3,
    name: "Airforce shoes",
    price: "$99",
    store: "Ebay",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHXpofzECS768Ea5aEQWJX_cuN_MwIvzv5XA&s",
    timestamp: "1 week ago",
  },
  {
    id: 4,
    name: "HP Laptop",
    price: "$399",
    store: "Amazon",
    image: "data:image/jpeg;base64,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",
    timestamp: "2 days ago",
  },
  {
    id: 5,
    name: "makeup kit",
    price: "$99",
    store: "Amazon",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeUVvvWVJ_3kXN1kFnxNWjLewhMdObILxjpA&s",
  },
  {
    id: 6,
    name: "suit",
    price: "$199",
    store: "Ebay",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyeAJtAJvKpZbK4xHVfKBFyqSWkHrfYWw0ew&s",
  },
];

const Sidebar = ({ setActiveTab, userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
        <p className="font-bold">{userData?.username || "User"}</p>
        <p className="text-sm text-gray-500">{userData?.email || ""}</p>
        <p className="mt-2 font-semibold">Shipping address</p>
        <p>{userData?.address || "Not provided"}</p>
      </div>
      <div className="flex flex-col space-y-2">
        {["Favorites", "Recent searches", "Edit profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {tab}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Signout
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-md transition group relative">
    <img src={product.image} alt={product.name} className="mb-2 w-full h-40 object-cover rounded" />
    {product.timestamp && (
      <p className="text-xs text-gray-400 absolute top-2 right-2 bg-white px-2 py-1 rounded shadow">
        {product.timestamp}
      </p>
    )}
    <p className="font-semibold">{product.name}</p>
    <p className="text-sm">{product.price}</p>
    <p className="text-sm text-gray-500">{product.store}</p>
    <button className="opacity-0 group-hover:opacity-100 text-blue-600 mt-2 hover:underline">View</button>
  </div>
);

const EditProfileForm = ({ userData, setUserData }) => {
  const [formData, setFormData] = useState(userData);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  // Form validation function here
  const validate = () => {
    const errors = {};
    if (!formData.username?.trim()) errors.username = "Name is required.";
    if (!formData.email?.trim()) errors.email = "Email is required.";
    if (!formData.address?.trim()) errors.address = "Address is required.";
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Profile update failed");

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setSuccessMessage("");
    }
  };

  return (
        <div className="bg-white p-6 rounded shadow max-w-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.full_name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {formErrors.full_name && <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              formErrors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="John Doe"
          />
          {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="johndoe@example.com"
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
        {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
      </form>
    </div>
  );
};

export default function UserProfileDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Favorites");
  const [userData, setUserData] = useState({});

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error:", error);
      
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-blue-50 p-4 md:flex md:space-x-4">
        <Sidebar setActiveTab={setActiveTab} userData={userData} />
        <div className="w-full md:w-3/4 p-4">
          <h2 className="text-xl font-bold mb-4">{activeTab}</h2>
          {activeTab === "Favorites" || activeTab === "Recent searches" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : activeTab === "Edit profile" ? (
            <EditProfileForm userData={userData} setUserData={setUserData} />
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}