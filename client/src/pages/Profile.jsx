import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer"; 

const Sidebar = ({ setActiveTab, userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    navigate("/login"); 
  };

  return (
    <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
        <p className="font-bold">{userData?.username || "Loading..."}</p>
        <p className="text-sm text-gray-500">{userData?.email || "Loading..."}</p>
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

// Content Component
const Content = ({ activeTab, userData, setUserData }) => {
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    username: userData?.username || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Form validation function here
  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
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

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8000/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network error");

const updatedData = await response.json();
localStorage.setItem("user_data", JSON.stringify(updatedData));
setUserData(updatedData);
      setUserData(formData);

      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.log("No token found, redirecting to login");
    navigate("/login");
    return;
  }

  console.log("Token found:", token.substring(0, 20) + "..."); 

  try {
    const response = await fetch("http://localhost:8000/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      if (response.status === 401) {
        console.log("Token expired or invalid, clearing storage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        navigate("/login");
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User data received:", data);
    setUserData(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
   
  }
};

    fetchUserData();
  }, [setUserData, navigate]);

  return (
    <div className="w-full md:w-3/4 p-4">
      <h2 className="text-xl font-bold mb-4">{activeTab}</h2>
      {activeTab === "Edit profile" && (
        <div className="bg-white p-6 rounded shadow max-w-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  formErrors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your username"
              />
              {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
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
      )}

      {(activeTab === "Favorites" || activeTab === "Recent searches") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p>{activeTab} content will go here.</p>
        </div>
      )}
    </div>
  );
};

const UserProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("Favorites");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user_data")) || null);

  return (
    <div>
      <div className="min-h-screen bg-blue-50 p-4 md:flex md:space-x-4">
        <Sidebar setActiveTab={setActiveTab} userData={userData} />
        <Content activeTab={activeTab} userData={userData} setUserData={setUserData} />
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileDashboard;