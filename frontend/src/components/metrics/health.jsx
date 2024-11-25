import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";

const Health = () => {
  const [storageHealth, setStorageHealth] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [serviceHealth, setServiceHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStorageType, setSelectedStorageType] = useState("hdfs");

  useEffect(() => {
    // Fetching system health and service health
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
          method: "POST", // Use POST method to send storageType in the body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storageType }), // Sending storageType in the request body
        }
      );
      const data = await response.json();
      setStorageHealth(data);
    } catch (error) {
      console.error("Error fetching storage health:", error);
    }
  };

  // Trigger storage health fetch whenever the selected storage type changes
  useEffect(() => {
    if (selectedStorageType) {
      fetchStorageHealth(selectedStorageType);
    }
  }, [selectedStorageType]);

  // Handle dropdown change
  const handleStorageTypeChange = (event) => {
    setSelectedStorageType(event.target.value);
  };

  // Show loading state until all data is fetched
  useEffect(() => {
    if (systemHealth && serviceHealth && storageHealth) {
      setLoading(false);
    }
  }, [systemHealth, serviceHealth, storageHealth]);

  // Render the health status UI
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="health-container">
        <h1>System Health Monitoring</h1>

        {/* Dropdown to select storage type */}
        <section className="health-section">
          <h2>Select Storage Type</h2>
          <select
            value={selectedStorageType}
            onChange={handleStorageTypeChange}
          >
            <option value="hdfs">HDFS</option>
            <option value="mongo">MongoDB</option>
            <option value="s3">S3</option>
          </select>
        </section>

        {/* Storage Health */}
        <section className="health-section">
          <h2>Storage Health</h2>
          {storageHealth ? (
            <div>
              <p>
                <strong>Status:</strong> {storageHealth.status}
              </p>
              <p>
                <strong>Message:</strong> {storageHealth.data.message}
              </p>
              <p>
                <strong>Storage Type:</strong> {storageHealth.data.storageType}
              </p>
            </div>
          ) : (
            <p>Failed to fetch storage health status.</p>
          )}
        </section>

        {/* System Health */}
        <section className="health-section">
          <h2>System Health</h2>
          {systemHealth ? (
            <div>
              <p>
                <strong>Status:</strong> {systemHealth.status}
              </p>
              <p>
                <strong>Uptime:</strong> {systemHealth.data.uptime} seconds
              </p>
              <div>
                <h3>Memory</h3>
                <p>
                  <strong>Total:</strong> {systemHealth.data.memory.total} bytes
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
                      <strong>CPU {index + 1} Model:</strong> {cpu.model}
                    </p>
                    <p>
                      <strong>Speed:</strong> {cpu.speed} MHz
                    </p>
                    <p>
                      <strong>User Time:</strong> {cpu.times.user}
                    </p>
                    <p>
                      <strong>System Time:</strong> {cpu.times.sys}
                    </p>
                    <p>
                      <strong>Idle Time:</strong> {cpu.times.idle}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <h3>Load Average</h3>
                <p>{systemHealth.data.loadAverage.join(", ")}</p>
              </div>
            </div>
          ) : (
            <p>Failed to fetch system health status.</p>
          )}
        </section>

        {/* Service Health */}
        <section className="health-section">
          <h2>Service Health</h2>
          {serviceHealth ? (
            <div>
              <p>
                <strong>Database(MongoDB):</strong>{" "}
                {serviceHealth.data.database}
              </p>
              <p>
                <strong>HDFS:</strong> {serviceHealth.data.hdfs}
              </p>
              <p>
                <strong>S3:</strong> {serviceHealth.data.s3}
              </p>
            </div>
          ) : (
            <p>Failed to fetch service health status.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default Health;
