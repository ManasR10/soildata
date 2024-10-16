import React, { useState, useEffect } from 'react';
import { fetchSoilData } from '../services/api';

const SoilDataForm = () => {
  const [soilData, setSoilData] = useState({ moisture: '', temperature: '', pH: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the latest soil data instead of submitting new data
  const fetchLatestSoilData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { latestReading } = await fetchSoilData();
      if (latestReading) {
        setSoilData({
          moisture: latestReading.moisture,
          temperature: latestReading.temperature,
          pH: latestReading.pH,
        });
      }
    } catch (error) {
      setErrorMessage('Failed to fetch soil data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestSoilData();  // Fetch latest data when the component mounts
  }, []);

  return (
    <form>
      <div>
        <label>Moisture:</label>
        <input
          type="text"
          name="moisture"
          value={soilData.moisture}
          readOnly
        />
      </div>
      <div>
        <label>Temperature (°C):</label>
        <input
          type="text"
          name="temperature"
          value={soilData.temperature}
          readOnly
        />
      </div>
      <div>
        <label>pH Level:</label>
        <input
          type="text"
          name="pH"
          value={soilData.pH}
          readOnly
        />
      </div>

      {loading ? <p>Loading...</p> : null}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default SoilDataForm;