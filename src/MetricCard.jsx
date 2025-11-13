import React from "react";

const MetricCard = ({ label, value }) => {
  return (
    <div className="flex flex-col bg-gray-900/50 border border-blue-700/50 rounded-xl p-4 w-full text-center shadow-md">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-2xl font-semibold text-blue-400 mt-1">{value}</span>
    </div>
  );
};

export default MetricCard;
