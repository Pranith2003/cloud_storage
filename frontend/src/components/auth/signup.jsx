import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './signup.css'; // Import the CSS file
import SignupImage from './image.png'; // Replace with the path to your image

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", formData);
      console.log(response.data);
      alert("Signup successful!");
      navigate("/signin"); // Redirect to signin page
    } catch (error) {
      setError(error.response?.data?.errors || "An error occurred.");
    }
  };

  return (
    <div className="signup-container">
      {/* Left Section with Image */}
      <div className="signup-image">
        <img src={SignupImage} alt="Signup" />
      </div>

     
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <h2>Signup</h2>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
            <a href="/signin" style={{ fontSize: "14px", color: "#007bff" }}>
            Existing User : SignIn
            </a>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
