import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import NavLogo from "./NavLogo.png"; // Import your logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and text */}
        <div className="navbar-logo">
          <img src={NavLogo} alt="Logo" className="navbar-logo-image" />
          <h1>Cloud Sphere</h1>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/file/fileupload">Upload Files</Link>
          </li>
          <li>
            <Link to="/metrics/StorageMetrics">Stats</Link>
          </li>
          <li>
            <Link to="/file/health">System Check</Link>
          </li>
          <li>
            <Link to="/Dashboard">View Files</Link>
          </li>
          <li>
            <Link to="/auth">Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
