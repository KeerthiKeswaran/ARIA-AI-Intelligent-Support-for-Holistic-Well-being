import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import WeatherCard from './components/DashBoard/WeatherCard';
import HealthMetrics from './components/DashBoard/HealthMetrics';
import RecommendationCard from './components/DashBoard/RecommendationCard';
import AirQualityCard from './components/DashBoard/AirQualityCard';
import DailySuggestions from './components/DashBoard/DailySuggestions';
import RelocationAdvice from './components/DashBoard/RelocationAdvice';
import Chatbot from './components/DashBoard/Chatbot';
import NaturalRemedies from './components/DashBoard/NaturalRemedies';

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('New York, USA');
  const [showProfilePage, setShowProfilePage] = useState(false);

  // Mock data (in production, this would come from your APIs)
  const userData = {
    name: "Alex Johnson",
    location: currentLocation,
    since: "January 2024",
    email: "alex.johnson@example.com",
    healthScore: 92,
    checkIns: 156
  };

  const weatherData = {
    temp: 24,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
  };

  const airQualityData = {
    aqi: 42,
    status: 'Good',
    pollutants: {
      pm25: 15,
      pm10: 25,
      o3: 35,
    },
  };

  const healthMetrics = {
    steps: 8432,
    calories: 420,
    distance: 5.2,
    heartRate: 72,
    bmi: 22.5,
    lastCheckup: '2024-03-15',
  };

  const dailySuggestions = {
    soup: {
      name: 'Immune Boosting Vegetable Soup',
      benefits: 'High in Vitamin C, perfect for current weather',
    },
    mentalHealth: {
      activity: 'Morning Meditation',
      duration: '15 minutes',
    },
    exercise: {
      recommendation: 'Indoor Yoga',
      reason: 'Due to moderate AQI levels',
    },
  };

  const remedies = [
    {
      condition: 'Seasonal Allergies',
      remedy: 'Local honey and nettle tea',
      instructions: 'Take 1 tablespoon honey with nettle tea twice daily',
    },
    {
      condition: 'Stress Relief',
      remedy: 'Lavender and chamomile blend',
      instructions: 'Drink as tea before bedtime',
    },
  ];

  const historyData = {
    weather: [
      { date: '2024-03-15', temp: 24, condition: 'Sunny' },
      { date: '2024-03-14', temp: 22, condition: 'Cloudy' },
      { date: '2024-03-13', temp: 23, condition: 'Partly Cloudy' },
    ],
    airQuality: [
      { date: '2024-03-15', aqi: 42, status: 'Good' },
      { date: '2024-03-14', aqi: 45, status: 'Good' },
      { date: '2024-03-13', aqi: 48, status: 'Good' },
    ],
    health: [
      { date: '2024-03-15', steps: 8432, heartRate: 72, calories: 420 },
      { date: '2024-03-14', steps: 7654, heartRate: 75, calories: 380 },
      { date: '2024-03-13', steps: 9123, heartRate: 70, calories: 450 },
    ],
  };

  const historyEntries = [
    {
      date: '2024-03-15',
      weather: { temp: 24, condition: 'Sunny' },
      airQuality: { aqi: 42, status: 'Good' },
      health: { steps: 8432, heartRate: 72 },
    },
    {
      date: '2024-03-14',
      weather: { temp: 22, condition: 'Cloudy' },
      airQuality: { aqi: 45, status: 'Good' },
      health: { steps: 7654, heartRate: 75 },
    },
    {
      date: '2024-03-13',
      weather: { temp: 23, condition: 'Partly Cloudy' },
      airQuality: { aqi: 48, status: 'Good' },
      health: { steps: 9123, heartRate: 70 },
    },
  ];

  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
  };

  if (showProfilePage) {
    return (
      <UserProfilePage
        userData={userData}
        history={historyData}
        onBack={() => setShowProfilePage(false)}
        onLocationChange={handleLocationChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Section */}
        <div className="mb-8">
          <div onClick={() => setShowProfilePage(true)} className="cursor-pointer">
            
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <WeatherCard data={weatherData} />
          <AirQualityCard data={airQualityData} />
          <HealthMetrics data={healthMetrics} />
        </div>

        {/* History Log Section */}
        <div className="mb-8">
        
        </div>

        {/* Daily Suggestions Section */}
        <div className="mb-8">
          <DailySuggestions data={dailySuggestions} />
        </div>

        {/* Natural Remedies Section */}
        <div className="mb-8">
          <NaturalRemedies remedies={remedies} />
        </div>

        {/* Relocation Advice */}
        <div className="mb-8">
          <RelocationAdvice currentAqi={airQualityData.aqi} />
        </div>

        {/* Chatbot */}
        <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
        
        {/* Chatbot Toggle Button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-3 right-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;