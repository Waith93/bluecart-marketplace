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
      const response = await fetch("http://127.0.0.1:8000/auth/profile", {
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
      setIsEditing(false);
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
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-12">
          
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {userData?.username ? userData.username.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{userData?.username || "Loading..."}</h1>
            <p className="text-gray-500">{userData?.email || "Loading..."}</p>
          </div>

          <div className="mb-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Username</label>
                  <div className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50">
                    {userData?.username || "Loading..."}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <div className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50">
                    {userData?.email || "Loading..."}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      formErrors.username ? "border-red-500" : "border-gray-300"
                    } ${isLoading ? "opacity-50" : ""}`}
                  />
                  {formErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } ${isLoading ? "opacity-50" : ""}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {successMessage}
                  </div>
                )}
                
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.submit}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`bg-green-600 text-white px-6 py-2 rounded-lg ${
                    isLoading ? "opacity-50" : "hover:bg-green-700"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
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
                  className={`bg-gray-500 text-white px-6 py-2 rounded-lg ${
                    isLoading ? "opacity-50" : "hover:bg-gray-600"
                  }`}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileDashboard;