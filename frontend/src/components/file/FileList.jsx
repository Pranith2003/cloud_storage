import React, { useEffect, useState } from "react";
import "./fileupload.css";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [actionStatus, setActionStatus] = useState({}); // To track download/delete status

  // Fetch files from the API
  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/file/list", {
        method: "GET",
        credentials: "include", // Send cookies with request
      });
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      } else {
        console.error("Failed to fetch files.");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDownload = async (fileId) => {
    setActionStatus((prev) => ({
      ...prev,
      [fileId]: { status: "Downloading...", error: null },
    }));

    try {
      const response = await fetch(`http://localhost:3000/api/file/download/${fileId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const selectedFile = files.find((file) => file._id === fileId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = selectedFile.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setActionStatus((prev) => ({
          ...prev,
          [fileId]: { status: "Downloaded successfully", error: null },
        }));
      } else {
        throw new Error("Failed to download file.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setActionStatus((prev) => ({
        ...prev,
        [fileId]: { status: "Download failed", error: error.message },
      }));
    }
  };

  const handleDelete = async (fileId) => {
    setActionStatus((prev) => ({
      ...prev,
      [fileId]: { status: "Deleting...", error: null },
    }));

    try {
      const response = await fetch(`http://localhost:3000/api/file/delete/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
        setActionStatus((prev) => ({
          ...prev,
          [fileId]: { status: "Deleted successfully", error: null },
        }));
      } else {
        throw new Error(data.message || "Failed to delete file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setActionStatus((prev) => ({
        ...prev,
        [fileId]: { status: "Delete failed", error: error.message },
      }));
    }
  };

  useEffect(() => {
    fetchFiles(); // Load files on component mount
  }, []);

  return (
    <div>
      <h2>File List</h2>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>File Name</th>
            <th>File Type</th>
            <th>File Size (MB)</th>
            <th>Storage Type</th>
            <th>Date Uploaded</th>
            <th>Date Modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file._id}>
              <td>{index + 1}</td>
              <td>{file.fileName}</td>
              <td>{file.fileType}</td>
              <td>{(file.fileSize / (1024 * 1024)).toFixed(2)} MB</td>
              <td>{file.storageType}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
              <td>{new Date(file.updatedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDownload(file._id)}>Download</button>
                <button onClick={() => handleDelete(file._id)}>Delete</button>
                {actionStatus[file._id] && (
                  <div>
                    <p>{actionStatus[file._id].status}</p>
                    {actionStatus[file._id].error && (
                      <p style={{ color: "red" }}>{actionStatus[file._id].error}</p>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
