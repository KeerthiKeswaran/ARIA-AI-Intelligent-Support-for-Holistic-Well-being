import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Location from './components/Location';
import Questionnaire from './components/Questionnaire'
import Response from './components/Response';
import Dashboard from './components/Dashboard'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Location />} />
        <Route path="/response" element={<Response />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
