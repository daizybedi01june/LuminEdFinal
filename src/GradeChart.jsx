import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const GradeChart = ({ subjects }) => {
  if (!subjects || subjects.length === 0) return <p className="text-gray-400 italic">No data to display chart.</p>;

  // Transform data: group by subject, create arrays of marks for each exam type
  const groupedData = {};

  subjects.forEach((subj) => {
    if (!groupedData[subj.name]) groupedData[subj.name] = { subject: subj.name };
    groupedData[subj.name][subj.examType] = subj.marks;
  });

  const chartData = Object.values(groupedData);

  // Collect all exam types for lines
  const allExamTypes = [...new Set(subjects.map((s) => s.examType))];

  const colors = ["#1E90FF", "#FF6347", "#32CD32", "#FFD700", "#FF69B4"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        {allExamTypes.map((exam, index) => (
          <Line
            key={exam}
            type="monotone"
            dataKey={exam}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GradeChart;

