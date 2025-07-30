import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer"; 

const UserProfileDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user_data")) || null);
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    username: userData?.username || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    navigate("/login"); 
  };

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
      const response = await fetch("https://bluecart-marketplace-mjzs.onrender.com/auth/profile", {
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
      setIsEditing(false); // Exit edit mode after successful save 
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
        const response = await fetch("https://bluecart-marketplace-mjzs.onrender.com/auth/profile", {
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
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 flex items-center justify-center relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>


        <div className="relative w-full max-w-4xl">

          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-300 to-amber-400 rounded-3xl blur-sm opacity-75"></div>
          <div className="absolute inset-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-sm opacity-50"></div>
          

          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl border-4 border-white/50 backdrop-blur-sm">
            

            <div className="absolute inset-4 border-2 border-blue-200/50 rounded-2xl"></div>
            <div className="absolute inset-6 border border-indigo-200/30 rounded-xl"></div>
            

            <div className="absolute top-6 left-6 w-8 h-8 border-l-4 border-t-4 border-blue-400/60 rounded-tl-lg"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-r-4 border-t-4 border-blue-400/60 rounded-tr-lg"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-l-4 border-b-4 border-blue-400/60 rounded-bl-lg"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-r-4 border-b-4 border-blue-400/60 rounded-br-lg"></div>
            

            <div className="relative p-8">
              <div className="w-full max-w-2xl mx-auto">

                <div className="text-center mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-4xl font-bold text-blue-600">
                      {userData?.username ? userData.username.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{userData?.username || "Loading..."}</h1>
                  <p className="text-gray-500 break-all">{userData?.email || "Loading..."}</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 mb-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Information</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded mb-4"></div>
                  </div>

                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Username</label>
                        <div className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 text-gray-700">
                          {userData?.username || "Loading..."}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <div className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 text-gray-700 break-all">
                          {userData?.email || "Loading..."}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
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
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                      >
                        Edit Profile
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium border border-red-500 hover:shadow-lg transform hover:scale-105"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isLoading 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-green-700 hover:shadow-lg transform hover:scale-105"
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormErrors({});
                          setSuccessMessage("");
                          setFormData({
                            email: userData?.email || "",
                            username: userData?.username || "",
                          });
                        }}
                        disabled={isLoading}
                        className={`bg-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isLoading 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-gray-600 hover:shadow-lg transform hover:scale-105"
                        }`}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileDashboard;