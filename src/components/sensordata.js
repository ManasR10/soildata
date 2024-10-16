import React, { useEffect, useState } from 'react';
import { fetchSoilData } from '../services/api';

const SensorData = () => {
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);  // Track errors
  const [loading, setLoading] = useState(true);

  // Function to fetch sensor data from the backend API
  const fetchSensorData = async () => {
    try {
      const { latestReading } = await fetchSoilData();  // Use your API to fetch the latest data
      setSensorData(latestReading);  // Update the state with the sensor data
    } catch (error) {
      setError('Failed to fetch sensor data.');
      console.error("Error fetching sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sensor data every 5 seconds
  useEffect(() => {
    fetchSensorData();  // Initial fetch
    const interval = setInterval(fetchSensorData, 5000);  // Fetch every 5 seconds
    return () => clearInterval(interval);  // Cleanup interval on unmount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Live Sensor Data</h1>
      {sensorData ? (
        <div>
          <p><strong>Moisture:</strong> {sensorData.moisture}%</p>
          <p><strong>Temperature:</strong> {sensorData.temperature}°C</p>
          <p><strong>pH Level:</strong> {sensorData.pH}</p>
          <p><strong>Timestamp:</strong> {new Date(sensorData.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default SensorData;