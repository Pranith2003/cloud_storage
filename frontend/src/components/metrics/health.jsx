import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./Health.css"; // Ensure this path is correct

const Health = () => {
  const [storageHealth, setStorageHealth] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [serviceHealth, setServiceHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStorageType, setSelectedStorageType] = useState("hdfs");

  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/monitoring/system-health"
        );
        const data = await response.json();
        setSystemHealth(data);
      } catch (error) {
        console.error("Error fetching system health:", error);
      }
    };

    const fetchServiceHealth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/monitoring/service-health"
        );
        const data = await response.json();
        setServiceHealth(data);
      } catch (error) {
        console.error("Error fetching service health:", error);
      }
    };

    fetchSystemHealth();
    fetchServiceHealth();
  }, []);

  const fetchStorageHealth = async (storageType) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/monitoring/storage-health",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storageType }),
        }
      );
      const data = await response.json();
      setStorageHealth(data);
    } catch (error) {
      console.error("Error fetching storage health:", error);
    }
  };

  useEffect(() => {
    if (selectedStorageType) fetchStorageHealth(selectedStorageType);
  }, [selectedStorageType]);

  useEffect(() => {
    if (systemHealth && serviceHealth && storageHealth) {
      setLoading(false);
    }
  }, [systemHealth, serviceHealth, storageHealth]);

  const handleStorageTypeChange = (event) => {
    setSelectedStorageType(event.target.value);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="health-container">
        <h1>System Health Monitoring</h1>

        {/* Dropdown */}
        <div className="health-dropdown">
          <select
            value={selectedStorageType}
            onChange={handleStorageTypeChange}
          >
            <option value="hdfs">HDFS</option>
            <option value="mongo">MongoDB</option>
            <option value="s3">S3</option>
          </select>
        </div>

        {/* Cards Container */}
        <div className="card-container">
          {/* Storage Health */}
          <div className="card">
            <h2>Storage Health</h2>
            {storageHealth ? (
              <>
                <p>
                  <strong>Status:</strong> {storageHealth.status}
                </p>
                <p>
                  <strong>Message:</strong> {storageHealth.data.message}
                </p>
                <p>
                  <strong>Storage Type:</strong>{" "}
                  {storageHealth.data.storageType}
                </p>
              </>
            ) : (
              <p>Failed to fetch storage health.</p>
            )}
          </div>

          {/* System Health */}
          <div className="card">
            <h2>System Health</h2>
            {systemHealth ? (
              <>
                <p>
                  <strong>Status:</strong> {systemHealth.status}
                </p>
                <p>
                  <strong>Uptime:</strong> {systemHealth.data.uptime} seconds
                </p>
                <div>
                  <h3>Memory</h3>
                  <p>
                    <strong>Total:</strong> {systemHealth.data.memory.total}{" "}
                    bytes
                  </p>
                  <p>
                    <strong>Free:</strong> {systemHealth.data.memory.free} bytes
                  </p>
                </div>
                <div>
                  <h3>CPU</h3>
                  {systemHealth.data.cpu.map((cpu, index) => (
                    <div key={index}>
                      <p>
                        <strong>Model:</strong> {cpu.model}
                      </p>
                      <p>
                        <strong>Speed:</strong> {cpu.speed} MHz
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Failed to fetch system health.</p>
            )}
          </div>

          {/* Service Health */}
          <div className="card">
            <h2>Service Health</h2>
            {serviceHealth ? (
              <>
                <p>
                  <strong>Database:</strong> {serviceHealth.data.database}
                </p>
                <p>
                  <strong>HDFS:</strong> {serviceHealth.data.hdfs}
                </p>
                <p>
                  <strong>S3:</strong> {serviceHealth.data.s3}
                </p>
              </>
            ) : (
              <p>Failed to fetch service health.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Health;
