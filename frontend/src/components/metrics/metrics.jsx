import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import NavBar from "../Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LinearScale,
} from "chart.js";

// Register components once, including LinearScale
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StorageMetrics = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Fetching storage metrics from the backend API
    const fetchStorageStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/file/get-metrics",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching storage metrics:", error);
      }
    };

    fetchStorageStats(); // Call the fetch function when the component mounts
  }, []);

  if (!metrics) return <div>Loading...</div>; // Show loading state while data is being fetched

  // Prepare Bar chart data
  const barData = {
    labels: ["HDFS", "MongoDB", "S3"],
    datasets: [
      {
        label: "File Count",
        data: [
          metrics.hdfs.fileCount,
          metrics.mongo.fileCount,
          metrics.s3.fileCount,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Prepare Pie chart data
  const pieData = {
    labels: ["HDFS", "MongoDB", "S3"],
    datasets: [
      {
        data: [
          metrics.hdfs.totalSize,
          metrics.mongo.totalSize,
          metrics.s3.totalSize,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
        <NavBar/>
      <h1>Storage Metrics</h1>
      <div style={{ width: "600px", margin: "0 auto" }}>
        <Bar data={barData} options={{ responsive: true }} />
      </div>
      <div style={{ width: "600px", margin: "20px auto" }}>
        <Pie data={pieData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default StorageMetrics;
