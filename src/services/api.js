import axios from 'axios';

const API_URL = 'http://localhost:3001/api/s3-data';

// Define the function to fetch data from the backend
export const fetchSoilData = async () => {
  try {
    const response = await axios.get(API_URL);

    // Check if the response data contains both latestReading and allReadings
    if (response.data && response.data.latestReading && response.data.allReadings) {
      return {
        latestReading: response.data.latestReading,
        allReadings: response.data.allReadings
      };
    } else {
      console.error('Unexpected API response structure', response.data);
      return { latestReading: null, allReadings: [] };  // Return empty/fallback data in case of unexpected structure
    }

  } catch (error) {
    console.error('Error fetching data from API:', error);
    return { latestReading: null, allReadings: [] };  // Return empty/fallback data in case of error
  }
};