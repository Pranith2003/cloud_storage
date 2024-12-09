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
  const [metrics, setMetrics] = useState(null); // Metrics from /get-metrics
  const [hdfsMetrics, setHdfsMetrics] = useState(null); // Metrics from /get-hdfs-metrics

  // Fetch Storage Metrics
  useEffect(() => {
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

    const fetchHdfsStats = async () => {
      try {
        // const response = await fetch(
        //   "http://localhost:3000/api/file/get-hdfs-metrics",
        //   {
        //     method: "GET",
        //     credentials: "include",
        //   }
        // );
        const response = {
          fileMetrics: [
            {
              filePath: "/user/hadoop/uploads/80mb.pdf",
              fileStatus: "Healthy",
              blockInfo: { blockCount: 3, blockSize: 25 },
            },
            {
              filePath: "/user/hadoop/uploads/90mb.pdf",
              fileStatus: "Healthy",
              blockInfo: { blockCount: 2, blockSize: 45 },
            },
          ],
        };

        const data = response;
        console.log(data);
        setHdfsMetrics(data.fileMetrics); // Store HDFS-specific file metrics
      } catch (error) {
        console.error("Error fetching HDFS metrics:", error);
      }
    };

    fetchStorageStats(); // Fetch storage metrics when the component mounts
    fetchHdfsStats(); // Fetch HDFS metrics when the component mounts
  }, []);

  if (!metrics || !hdfsMetrics) return <div>Loading...</div>; // Show loading state while data is being fetched

  // Prepare Bar chart data for storage metrics
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

  // Prepare Pie chart data for storage size
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

  // Prepare HDFS-specific file metrics
  const hdfsFileData = hdfsMetrics.map((file) => ({
    filePath: file.filePath,
    blockCount: file.blockInfo ? file.blockInfo.blockCount : 0,
    blockSize: file.blockInfo ? file.blockInfo.blockSize : 0,
  }));

  return (
    <div>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Storage Metrics</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={{ width: "45%" }}>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
        <div style={{ width: "30%" }}>
          {/* Reduced the width for Pie Chart */}
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
        HDFS File Metrics
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                File Path
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Block Count
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Block Size (MB)
              </th>
            </tr>
          </thead>
          <tbody>
            {hdfsFileData.map((file, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {file.filePath}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {file.blockCount}
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {file.blockSize}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StorageMetrics;
