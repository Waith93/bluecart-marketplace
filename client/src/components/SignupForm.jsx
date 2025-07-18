import React, { useState } from "react";

function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation or API call here
    console.log("Signup submitted:", formData);
  };

  return (
    <div className="signup-container">
      <h2>Create your account today!</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Username<br />
          <input 
            type="text" 
            name="username" 
            value={formData.username}
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Email<br />
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Password<br />
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Confirm Password<br />
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword}
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default SignupForm;
