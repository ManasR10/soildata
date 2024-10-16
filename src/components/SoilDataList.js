import React, { useEffect, useState } from 'react';
import { fetchSoilData } from '../services/api';

const SoilDataList = () => {
  const [soilDataList, setSoilDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSoilData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { allReadings } = await fetchSoilData();  // Fetch all readings
        setSoilDataList(allReadings);  // Set the list with fetched data
      } catch (err) {
        setError('Failed to fetch soil data.');
      } finally {
        setLoading(false);
      }
    };
    getSoilData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Soil Health Data</h2>
      {soilDataList.length === 0 ? (
        <p>No soil data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Moisture (%)</th>
              <th>Temperature (°C)</th>
              <th>pH Level</th>
            </tr>
          </thead>
          <tbody>
            {soilDataList.map(({ timestamp, moisture, temperature, pH }) => (
              <tr key={timestamp}>
                <td>{new Date(timestamp).toLocaleString()}</td>
                <td>{moisture}</td>
                <td>{temperature}</td>
                <td>{pH}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SoilDataList;