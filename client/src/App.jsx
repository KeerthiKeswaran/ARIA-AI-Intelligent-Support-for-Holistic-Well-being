import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Location from './components/Location';
import Questionnaire from './components/Questionnaire'
import Response from './components/Response';
import DashboardComp from './components/DashBoard/DashboardPage'
import Login from './components/Login'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/location" element={<Location />} />
        <Route path="/response" element={<Response />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/dashboard" element={<DashboardComp />} />
      </Routes>
    </Router>
  );
}

export default App;
