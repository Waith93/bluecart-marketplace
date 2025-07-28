import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer"; 

const Sidebar = ({ setActiveTab, userData, activeTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    navigate("/login"); 
  };

  const tabs = ["Recent searches", "Edit profile"];

  return (
    <div className="w-full md:w-1/4 p-6 bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-white shadow-md">
          <span className="text-2xl font-bold text-blue-600">
            {userData?.username ? userData.username.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <p className="font-bold text-gray-800 text-lg">{userData?.username || "Loading..."}</p>
        <p className="text-sm text-gray-500 break-all">{userData?.email || "Loading..."}</p>
      </div>
      
      <div className="flex flex-col space-y-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md transform scale-105"
                : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium mt-4 border border-red-500 hover:shadow-md"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const Content = ({ activeTab, userData, setUserData }) => {
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    username: userData?.username || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email || "",
        username: userData.username || "",
      });
    }
  }, [userData]);

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
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

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      localStorage.setItem("user_data", JSON.stringify(updatedData));
      setUserData(updatedData);

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000); 
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
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
    <div className="w-full md:w-3/4 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeTab}</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
      </div>
      
      {activeTab === "Edit profile" && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Update Your Information</h3>
            <p className="text-gray-500 text-sm">Make changes to your profile information below.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                  formErrors.username 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400 focus:border-blue-400"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Enter your username"
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {formErrors.username}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                  formErrors.email 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400 focus:border-blue-400"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Enter your email address"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {formErrors.email}
                </p>
              )}
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isLoading 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <span className="mr-2">✓</span>
                {successMessage}
              </div>
            )}
            
            {formErrors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <span className="mr-2">⚠</span>
                {formErrors.submit}
              </div>
            )}
          </form>
        </div>
      )}

      {activeTab === "Recent searches" && (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-gray-400">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No recent searches yet</h3>
            <p className="text-gray-500 mb-6">Your recent searches will be displayed here.</p>
            <button
              onClick={() => navigate("/history")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium hover:shadow-lg transform hover:scale-105"
            >
              Start Searching
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("Recent searches");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user_data")) || null);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:flex md:space-x-6">
        <Sidebar setActiveTab={setActiveTab} userData={userData} activeTab={activeTab} />
        <Content activeTab={activeTab} userData={userData} setUserData={setUserData} />
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileDashboard;