import React from 'react';
import { Soup, Brain, Activity } from 'lucide-react';

const DailySuggestions = ({ data }) => 
  {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daily Suggestions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Soup className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Today's Soup</h3>
          </div>
          <p className="text-gray-700 font-medium">{data.soup.name}</p>
          <p className="text-gray-600 text-sm mt-2">{data.soup.benefits}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="w-6 h-6 text-indigo-500" />
            <h3 className="font-semibold text-gray-800">Mental Wellness</h3>
          </div>
          <p className="text-gray-700 font-medium">{data.mentalHealth.activity}</p>
          <p className="text-gray-600 text-sm mt-2">Duration: {data.mentalHealth.duration}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Activity className="w-6 h-6 text-emerald-500" />
            <h3 className="font-semibold text-gray-800">Exercise</h3>
          </div>
          <p className="text-gray-700 font-medium">{data.exercise.recommendation}</p>
          <p className="text-gray-600 text-sm mt-2">{data.exercise.reason}</p>
        </div>
      </div>
    </div>
  );
};

export default DailySuggestions;
