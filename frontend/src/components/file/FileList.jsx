import React, { useEffect, useState } from "react";
import "./fileupload.css"
const FileList = () => {
  const [files, setFiles] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState({}); // Track progress per file

  // Simulated response from the server
  const response = {
    success: true,
    files: [
      {
        _id: "6743b50a0bcf61e40b715117",
        fileName: "100mb.rar",
        fileType: "application/x-compressed",
        fileSize: 29293412,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/100mb.rar",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-24T23:21:46.553Z",
        updatedAt: "2024-11-24T23:21:46.553Z",
        __v: 0,
      },
      {
        _id: "6743b5110bcf61e40b71511b",
        fileName: "hello.txt",
        fileType: "text/plain",
        fileSize: 15,
        storageType: "mongo",
        filePath: "6743b5110bcf61e40b715119",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-24T23:21:53.207Z",
        updatedAt: "2024-11-24T23:21:53.207Z",
        __v: 0,
      },
      {
        _id: "6743b5200bcf61e40b71511f",
        fileName: "80mb.pdf",
        fileType: "application/pdf",
        fileSize: 83968430,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/80mb.pdf",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-24T23:22:08.892Z",
        updatedAt: "2024-11-24T23:22:08.892Z",
        __v: 0,
      },
      {
        _id: "6743b5960bcf61e40b715124",
        fileName: "OBS-Studio-30.2.3-Windows-Installer.exe",
        fileType: "application/x-msdownload",
        fileSize: 139799880,
        storageType: "s3",
        filePath:
          "https://cloud-storage-1603.s3.eu-north-1.amazonaws.com/uploads/OBS-Studio-30.2.3-Windows-Installer.exe",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-24T23:24:06.530Z",
        updatedAt: "2024-11-24T23:24:06.530Z",
        __v: 0,
      },
      {
        _id: "6743b6000bcf61e40b71512b",
        fileName: "80mb.pdf",
        fileType: "application/pdf",
        fileSize: 83968430,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/80mb.pdf",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-24T23:25:52.216Z",
        updatedAt: "2024-11-24T23:25:52.216Z",
        __v: 0,
      },
      {
        _id: "67440a5174b6699cab1a5814",
        fileName: "90mb.pdf",
        fileType: "application/pdf",
        fileSize: 94486836,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/90mb.pdf",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-25T05:25:37.562Z",
        updatedAt: "2024-11-25T05:25:37.562Z",
        __v: 0,
      },
      {
        _id: "674411990460286bf3b49cc9",
        fileName: "80mb (1).pdf",
        fileType: "application/pdf",
        fileSize: 83968430,
        storageType: "hdfs",
        filePath:
          "http://localhost:9870/webhdfs/v1/user/hadoop/uploads/80mb (1).pdf?po=OPEN",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-25T05:56:41.900Z",
        updatedAt: "2024-11-25T05:56:41.900Z",
        __v: 0,
      },
      {
        _id: "67441590854baf903636ab6a",
        fileName: "80mb (1).pdf",
        fileType: "application/pdf",
        fileSize: 83968430,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/80mb (1).pdf",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-25T06:13:36.163Z",
        updatedAt: "2024-11-25T06:13:36.163Z",
        __v: 0,
      },
      {
        _id: "67441f5d2149b14052756214",
        fileName: "80mb.pdf",
        fileType: "application/pdf",
        fileSize: 83968430,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/80mb.pdf",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-25T06:55:25.321Z",
        updatedAt: "2024-11-25T06:55:25.321Z",
        __v: 0,
      },
      {
        _id: "674433aeebf1be413ff21fe0",
        fileName: "80mb (2).pdf",
        fileType: "application/pdf",
        fileSize: 83968430,
        storageType: "hdfs",
        filePath: "/user/hadoop/uploads/80mb (2).pdf",
        uploadedBy: "6743a722276653b11009e3ed",
        createdAt: "2024-11-25T08:22:06.346Z",
        updatedAt: "2024-11-25T08:22:06.346Z",
        __v: 0,
      },
    ],
  };

  // Fetch files from the given response
  const fetchFiles = () => {
    if (response.success) {
      setFiles(response.files);
    }
  };

  const handleDownload = async (fileId) => {
    setDownloadProgress((prev) => ({
      ...prev,
      [fileId]: { progress: 0, status: "Downloading..." },
    }));

    try {
      // Simulated download process
      const selectedFile = files.find((file) => file._id === fileId);
      if (selectedFile) {
        console.log(`Downloading file: ${selectedFile.fileName}`);
        setDownloadProgress((prev) => ({
          ...prev,
          [fileId]: { progress: 100, status: "Download Complete!" },
        }));
      }
    } catch (error) {
      setDownloadProgress((prev) => ({
        ...prev,
        [fileId]: { progress: 0, status: "Download Failed" },
      }));
    }
  };

  const handleDelete = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    console.log(`Deleted file with ID: ${fileId}`);
  };

  useEffect(() => {
    fetchFiles(); // Load files on component mount
  }, []);

  return (
    <div>
      <br />
      <br />
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
                <button onClick={() => handleDownload(file._id)}>
                  Download
                </button>
                <button onClick={() => handleDelete(file._id)}>Delete</button>
                {downloadProgress[file._id] && (
                  <div>
                    <progress
                      value={downloadProgress[file._id].progress || 0}
                      max="100"
                    />
                    <span>
                      {downloadProgress[file._id].status} (
                      {downloadProgress[file._id].progress || 0}%)
                    </span>
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
