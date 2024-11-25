import React from "react";
import FileUpload from "./file/FileUpload";
import FileList from "./file/FileList";
import Navbar from "./Navbar"
const Dashboard = () => {
  return (
    <div>
      <Navbar/>
      <FileList />
    </div>
  );
};

export default Dashboard;
