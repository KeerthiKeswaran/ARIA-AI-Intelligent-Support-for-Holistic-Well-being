import React from 'react';
import { Leaf } from 'lucide-react';

const NaturalRemedies = ({ remedies }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <Leaf className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Natural Remedies</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {remedies.map((remedy, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg"
          >
            <h3 className="font-semibold text-gray-800 mb-2">{remedy.condition}</h3>
            <p className="text-gray-700 font-medium mb-2">{remedy.remedy}</p>
            <p className="text-gray-600 text-sm">{remedy.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NaturalRemedies;
