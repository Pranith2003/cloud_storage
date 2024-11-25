import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, ArcElement, LinearScale } from 'chart.js';

// Register components once, including LinearScale
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const response = {
  hdfs: {
    fileCount: 13,
    totalSize: 94486836,
  },
  s3: {
    fileCount: 10,
    totalSize: 94486800,
  },
  mongo: {
    fileCount: 7,
    totalSize: 94486000,
  },
};

const StorageMetrics = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Simulate API response with the static data
    setMetrics(response);
  }, []);

  if (!metrics) return <div>Loading...</div>;

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
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
        hoverBackgroundColor: ["#FF6384A0", "#36A2EBA0", "#FFCE56A0"],
        hoverBorderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

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
        hoverBackgroundColor: ["#FF6384A0", "#36A2EBA0", "#FFCE56A0"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(0, 0, 0, 0.87)',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Storage Metrics',
        font: {
          size: 20,
          weight: 'bold',
        },
        color: 'rgba(0, 0, 0, 0.87)',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(0, 0, 0, 0.87)',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: 'rgba(0, 0, 0, 0.87)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div>
      <h1>Storage Metrics</h1>
      <div style={{ width: "100%", maxWidth: "700px", margin: "20px auto" }}>
        <Bar data={barData} options={options} height={400} />
      </div>
      <div style={{ width: "100%", maxWidth: "600px", margin: "20px auto" }}>
        <Pie data={pieData} options={options} />
      </div>
    </div>
  );
};

export default StorageMetrics;
