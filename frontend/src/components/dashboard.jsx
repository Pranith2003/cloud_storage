import React from "react";
import FileUpload from "./file/FileUpload";
import FileList from "./file/FileList";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <FileUpload />
      <FileList />
    </div>
  );
};

export default Dashboard;
