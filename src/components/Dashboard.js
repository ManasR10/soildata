import React, { useEffect, useState } from 'react';
import { fetchSoilData } from '../services/api';
import './Dashboard.css';

// Helper function to calculate daily average
const calculateDailyAverage = (data) => {
  if (data.length === 0) return null;

  const total = data.reduce(
    (acc, reading) => {
      return {
        temperature: acc.temperature + reading.temperature,
        moisture: acc.moisture + reading.moisture,
        pH: acc.pH + reading.pH,
      };
    },
    { temperature: 0, moisture: 0, pH: 0 }
  );

  return {
    temperature: (total.temperature / data.length).toFixed(2),
    moisture: (total.moisture / data.length).toFixed(2),
    pH: (total.pH / data.length).toFixed(2),
  };
};

// Vegetables data with optimal temp, moisture, and pH levels
const veggiesData = [
  { name: 'Tomatoes', temperature: '18-25°C', moisture: '70-85%', pH: '6.0-6.8' },
  { name: 'Cucumbers', temperature: '18-24°C', moisture: '75-90%', pH: '6.0-7.0' },
  { name: 'Carrots', temperature: '16-21°C', moisture: '60-70%', pH: '6.0-7.0' },
  { name: 'Lettuce', temperature: '15-18°C', moisture: '60-75%', pH: '6.0-6.8' },
  { name: 'Spinach', temperature: '10-16°C', moisture: '60-70%', pH: '6.0-7.0' },
  { name: 'Potatoes', temperature: '15-18°C', moisture: '65-80%', pH: '5.0-6.5' },
];

const Dashboard = () => {
  const [latestReading, setLatestReading] = useState(null); // State to hold the latest reading
  const [dailyAvg, setDailyAvg] = useState(null); // State to hold the daily average
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch and process data
  const getSoilData = async () => {
    setLoading(true); // Set loading state when fetching new data
    try {
      const { latestReading, allReadings } = await fetchSoilData();  // Fetch the latest reading and all historical data

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      let dailyData = [];

      // Process each reading from `allReadings`
      allReadings.forEach((reading) => {
        const readingDate = new Date(reading.timestamp);

        // Collect data for daily average
        if (readingDate >= oneDayAgo) {
          dailyData.push(reading);
        }
      });

      // Set the latest reading
      setLatestReading(latestReading);

      // Calculate daily average
      if (dailyData.length > 0) {
        const avgDaily = calculateDailyAverage(dailyData);
        setDailyAvg(avgDaily);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Reset loading state when data is fetched
    }
  };

  // Polling function to get live data every 5 seconds
  useEffect(() => {
    // Initial fetch
    getSoilData();

    // Polling every 5 seconds
    const interval = setInterval(() => {
      getSoilData();
    }, 50000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Soil Health Dashboard</h1>

      {/* Refresh Button */}
      <button className="refresh-button" onClick={getSoilData}>
        Refresh Latest Readings
      </button>

      {/* Display Latest Readings */}
      {latestReading && (
        <div className="summary">
          <div className="card">
            <h3>Latest Temperature</h3>
            <p>{latestReading.temperature}°C</p>
          </div>
          <div className="card">
            <h3>Latest Moisture</h3>
            <p>{latestReading.moisture}%</p>
          </div>
          <div className="card">
            <h3>Latest pH Level</h3>
            <p>{latestReading.pH}</p>
          </div>
        </div>
      )}

      {/* Display Daily Average */}
      {dailyAvg && (
        <div className="averages">
          <div className="card">
            <h3>Average Temperature (Last 24h)</h3>
            <p>{dailyAvg.temperature}°C</p>
          </div>
          <div className="card">
            <h3>Average Moisture (Last 24h)</h3>
            <p>{dailyAvg.moisture}%</p>
          </div>
          <div className="card">
            <h3>Average pH Level (Last 24h)</h3>
            <p>{dailyAvg.pH}</p>
          </div>
        </div>
      )}

      {/* Vegetables Optimal Levels Table */}
      <div className="veggies-table">
        <h2>Vegetables Optimal Temperature, Moisture, and pH Levels</h2>
        <table>
          <thead>
            <tr>
              <th>Vegetable</th>
              <th>Optimal Temperature</th>
              <th>Optimal Moisture</th>
              <th>Optimal pH</th>
            </tr>
          </thead>
          <tbody>
            {veggiesData.map((veggie, index) => (
              <tr key={index}>
                <td>{veggie.name}</td>
                <td>{veggie.temperature}</td>
                <td>{veggie.moisture}</td>
                <td>{veggie.pH}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;