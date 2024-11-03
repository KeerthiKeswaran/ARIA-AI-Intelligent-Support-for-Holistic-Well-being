import React from 'react';
import { Sun, Wind, Droplets } from 'lucide-react';

const WeatherCard = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Weather</h3>
        <Sun className="w-8 h-8" />
      </div>
      
      <div className="mb-6">
        <div className="text-5xl font-bold mb-2">{data.temp}°C</div>
        <div className="text-blue-100">{data.condition}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-5 h-5 text-blue-200" />
          <div>
            <div className="text-sm text-blue-100">Humidity</div>
            <div className="font-semibold">{data.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-blue-200" />
          <div>
            <div className="text-sm text-blue-100">Wind Speed</div>
            <div className="font-semibold">{data.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
