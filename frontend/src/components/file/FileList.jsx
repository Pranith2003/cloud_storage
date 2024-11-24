import React, { useEffect, useState } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/file/list", {
        withCredentials: true, // Include session cookies
      });
      setFiles(response.data.files);
    } catch (error) {
      setStatus("Error fetching files: " + error.response?.data.message);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/file/download/${fileId}`,
        {
          responseType: "blob",
          withCredentials: true, // Include session cookies
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        response.headers["content-disposition"].split("filename=")[1]
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setStatus("Error downloading file: " + error.response?.data.message);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3000/api/file/delete/${fileId}`, {
        withCredentials: true, // Include session cookies
      });
      setStatus("File deleted successfully.");
      fetchFiles(); // Refresh file list
    } catch (error) {
      setStatus("Error deleting file: " + error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>File List</h2>
      {status && <p>{status}</p>}
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            {file.fileName}
            <button onClick={() => handleDownload(file._id)}>Download</button>
            <button onClick={() => handleDelete(file._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
