import React, { useEffect, useState } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [downloadProgress, setDownloadProgress] = useState({}); // Track progress per file

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
    setStatus(""); // Clear previous status
    setDownloadProgress((prev) => ({
      ...prev,
      [fileId]: { progress: 0, status: "Downloading..." },
    }));

    try {
      const response = await axios.get(
        `http://localhost:3000/api/file/download/${fileId}`,
        {
          responseType: "blob",
          withCredentials: true, // Include session cookies
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            ) || 0; // Ensure progress is never NaN
            setDownloadProgress((prev) => ({
              ...prev,
              [fileId]: { progress: percentCompleted, status: "Downloading..." },
            }));
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        response.headers["content-disposition"]?.split("filename=")[1] || "file"
      );
      document.body.appendChild(link);
      link.click();

      setDownloadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 100, status: "Download Complete!" },
      }));
    } catch (error) {
      setStatus("Error downloading file: " + error.response?.data.message);
      setDownloadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 0, status: "Download Failed" },
      }));
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
            <div>
              <span>{file.fileName}</span>
              <button onClick={() => handleDownload(file._id)}>Download</button>
              <button onClick={() => handleDelete(file._id)}>Delete</button>
            </div>
            {downloadProgress[file._id] && (
              <div>
                <progress
                  value={downloadProgress[file._id].progress || 0} // Default to 0
                  max="100"
                />
                <span>
                  {downloadProgress[file._id].status} (
                  {downloadProgress[file._id].progress || 0}%)
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
