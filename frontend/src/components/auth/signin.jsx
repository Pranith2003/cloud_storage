import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      setError(error.response?.data || "An error occurred.");
    }
  };

  return (
    <div className="signin">
      <h2>Signin</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Signin</button>
      </form>
    </div>
  );
};

export default Signin;
