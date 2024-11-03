import React from 'react';
import { MapPin, ThumbsUp, AlertTriangle } from 'lucide-react';

const RelocationAdvice = ({ currentAqi }) => {
  const getAdvice = () => {
    if (currentAqi <= 50) {
      return {
        status: 'Excellent',
        message: 'Your current location has great air quality. No relocation needed.',
        icon: ThumbsUp,
        color: 'text-green-500',
      };
    }
    return {
      status: 'Consider Relocation',
      message: 'Air quality in your area could be better. Consider exploring nearby neighborhoods with better AQI ratings.',
      icon: AlertTriangle,
      color: 'text-yellow-500',
    };
  };

  const advice = getAdvice();
  const AdviceIcon = advice.icon;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <MapPin className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Location Analysis</h2>
      </div>
      <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <AdviceIcon className={`w-6 h-6 ${advice.color}`} />
          <h3 className={`font-semibold ${advice.color}`}>{advice.status}</h3>
        </div>
        <p className="text-gray-700">{advice.message}</p>
      </div>
    </div>
  );
};

export default RelocationAdvice;
