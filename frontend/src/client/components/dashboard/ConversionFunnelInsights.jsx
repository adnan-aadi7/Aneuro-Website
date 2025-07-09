import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", category1: 8, category2: 12 },
  { month: "Feb", category1: 16, category2: 10 },
  { month: "Mar", category1: 18, category2: 6 },
  { month: "Apr", category1: 14, category2: 12 },
  { month: "May", category1: 10, category2: 16 },
  { month: "Jun", category1: 20, category2: 18 },
  { month: "Jul", category1: 24, category2: 22 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2A2A39] text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{`12 completions this week`}</p>
      </div>
    );
  }
  return null;
};

export default function ConversionFunnelInsights() {
  return (
    <div className="bg-[#2A2A39] text-white p-2 md:p-4 w-full max-w-[365px] md:max-w-2xl md:mx-auto ">
      <div className="mb-2 md:mb-3">
        <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
          Conversion Funnel Insights
        </h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-300">
              clicked Category Name
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-300">
              clicked Category Name
            </span>
          </div>
        </div>
      </div>
      <div className="h-40 md:h-52 w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              domain={[0, 30]}
              ticks={[0, 10, 20, 30]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="category1"
              stroke="white"
              strokeWidth={2}
              dot={{ fill: "white", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey="category2"
              stroke="#22D3EE"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#22D3EE", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: "#22D3EE" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
