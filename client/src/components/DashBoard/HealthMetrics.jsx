import React from 'react';
import { FootprintsIcon, Heart, Trophy, Activity } from 'lucide-react';

const HealthMetrics = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Health Metrics</h3>
        <Activity className="w-8 h-8" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
          <FootprintsIcon className="w-8 h-8 text-purple-200" />
          <div>
            <div className="text-sm text-purple-200">Steps</div>
            <div className="text-xl font-bold">{data.steps.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-purple-200" />
          <div>
            <div className="text-sm text-purple-200">Calories</div>
            <div className="text-xl font-bold">{data.calories}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8 text-purple-200" />
          <div>
            <div className="text-sm text-purple-200">Distance</div>
            <div className="text-xl font-bold">{data.distance} km</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Heart className="w-8 h-8 text-purple-200" />
          <div>
            <div className="text-sm text-purple-200">Heart Rate</div>
            <div className="text-xl font-bold">{data.heartRate} bpm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;
