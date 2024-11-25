import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signin.css'; // Import the CSS file
import DesignImage from './image.png'; // Update the path to the saved image

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        formData,
        {
          withCredentials: true, // This ensures cookies are sent and stored
        }
      );

      console.log(response.data);
      alert("Signin successful!");
      navigate("/dashboard"); 
    } catch (error) {
      // Ensure error is a string
      const errorMessage =
        error.response?.data?.message || "An error occurred during sign-in.";
      setError(errorMessage);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-image">
        <img src={DesignImage} alt="Sign-in design" />
      </div>

      <div className="signin-form">
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Sign In</h2>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <a href="/signup" style={{ fontSize: "14px", color: "#007bff" }}>
              New User : SignUp
            </a>
          </div>
          {/* Safely render the error */}
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
