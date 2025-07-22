// import React from "react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ReferenceLine,
//   CartesianGrid,
// } from "recharts";

// const data = [
//   { month: "Jan", thisWeek: 90, lastWeek: 110 },
//   { month: "Feb", thisWeek: 20, lastWeek: 105 },
//   { month: "Mar", thisWeek: 220, lastWeek: 130 },
//   { month: "Apr", thisWeek: 250, lastWeek: 180 },
//   { month: "May", thisWeek: 140, lastWeek: 160 },
//   { month: "Jun", thisWeek: 180, lastWeek: 120 },
//   { month: "Jul", thisWeek: 140, lastWeek: 110 },
//   { month: "Aug", thisWeek: 200, lastWeek: 140 },
//   { month: "Sep", thisWeek: 80, lastWeek: 90 },
//   { month: "Oct", thisWeek: 120, lastWeek: 100 },
//   { month: "Nov", thisWeek: 160, lastWeek: 130 },
//   { month: "Dec", thisWeek: 90, lastWeek: 50 },
// ];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length && label === "Aug") {
//     return (
//       <div className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600">
//         <div className="text-xs font-medium mb-1">This Week</div>
//         <div className="text-base font-semibold">Downloads</div>
//       </div>
//     );
//   }
//   return null;
// };

// const EngagedBrainTypeChart = () => {
//   return (
//     <div className="w-full bg-[#232432]  p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-white text-xl font-semibold">Engaged Brain Type</h2>
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-white rounded-full"></div>
//             <span className="text-white text-sm">This Week</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
//             <span className="text-white text-sm">Last Week</span>
//           </div>
//         </div>
//       </div>
//       {/* Chart */}
//       <div className="h-64 relative">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={data}
//             margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
//           >
//             <CartesianGrid
//               stroke="#4B5563"
//               strokeDasharray="4 4"
//               vertical={false}
//             />
//             <XAxis
//               dataKey="month"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#9CA3AF", fontSize: 12 }}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#9CA3AF", fontSize: 12 }}
//               domain={[0, 400]}
//               ticks={[0, 100, 200, 300, 400]}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={false} />
//             <ReferenceLine x="Aug" stroke="#9CA3AF" strokeDasharray="4 4" />
//             <Line
//               type="monotone"
//               dataKey="thisWeek"
//               stroke="#fff"
//               strokeWidth={3}
//               dot={false}
//               activeDot={{ r: 6, fill: "#fff" }}
//             />
//             <Line
//               type="monotone"
//               dataKey="lastWeek"
//               stroke="#22D3EE"
//               strokeWidth={3}
//               dot={false}
//               activeDot={{ r: 6, fill: "#22D3EE" }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default EngagedBrainTypeChart;
