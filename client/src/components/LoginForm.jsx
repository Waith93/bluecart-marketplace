import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError(null);

  try {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      localStorage.setItem("access_token", data.access_token);

      localStorage.setItem("user_data", JSON.stringify({
        username: formData.username,  
        email: formData.email
      }));

      navigate("/profile"); 
    } else {
      const errorData = await response.json();
      setError(errorData.detail || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    setError("An error occurred. Please try again.");
  }
};


  return (
    <div className="bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log into your account
        </h2>

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            disabled={loading}  // Disable button while loading
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
          <p>
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Signup
            </a>
          </p>
          <p>
            Forgot password?{" "}
            <a href="/reset-password" className="text-blue-600 hover:underline">
              Reset Password
            </a>
          </p>
        </div>
      </div>

      <div className="mt-10 w-full">
        <Footer />
      </div>
    </div>
  );
}

export default LoginForm;
