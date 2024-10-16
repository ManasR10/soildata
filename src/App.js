import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SoilDataForm from './components/SoilDataForm';
import SoilDataList from './components/SoilDataList';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap is included


function App() {
  return (
    <Router>
      <div>
        <Header />  {/* Header component that stays consistent across pages */}
        <div className="container mt-4">  {/* Bootstrap container for layout */}
          <Routes>
            {/* Route to the Dashboard as the home page */}
            <Route path="/" element={<Dashboard />} />





            {/* Route for viewing soil data list */}
            <Route path="/soil-data" element={<SoilDataList />} />

            {/* Route for the form to fetch soil data */}
            <Route path="/soil-data-form" element={<SoilDataForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;