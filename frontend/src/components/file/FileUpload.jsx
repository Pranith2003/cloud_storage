import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar"; // Ensure this path is correct based on your folder structure
import './File.css';


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0); // Track upload progress

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus(""); // Clear previous status
    setProgress(0); // Reset progress
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Include session cookies
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted); // Update progress state
          },
        }
      );
      setStatus(`File uploaded successfully: ${response.data.file.fileName}`);
      setProgress(100); // Set progress to 100% after success
    } catch (error) {
      setStatus(
        error.response?.data.message ||
          "An error occurred while uploading the file."
      );
      setProgress(0); // Reset progress on error
    }
  };

  return (
    <div>
      {/* Add Navbar at the top */}
      <Navbar />

      {/* File Upload Content */}
      <div className="file-upload-container">
        <h2>Upload File</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        {file && (
          <div>
            <progress value={progress} max="100" />
            <span>{progress}%</span>
          </div>
        )}
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
