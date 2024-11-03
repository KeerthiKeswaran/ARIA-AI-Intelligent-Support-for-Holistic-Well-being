import React from 'react';

const RecommendationCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default RecommendationCard;
