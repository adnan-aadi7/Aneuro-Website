import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Reflector", value: 60, color: "#2DE1C2" },
  { name: "Architect", value: 30, color: "#A78BFA" },
  { name: "Catalyst", value: 50, color: "#22D3EE" },
  { name: "Synthesizer", value: 10, color: "#F59E42" },
];

const legend = [
  { label: "Architect", color: "#A78BFA" },
  { label: "Catalyst", color: "#22D3EE" },
  { label: "Reflector", color: "#2DE1C2" },
  { label: "Synthesizer", color: "#F59E42" },
];

const tableRows = [
  { type: "Catalyst", percent: 30 },
  { type: "Synthesizer", percent: 10 },
  { type: "Reflector", percent: 40 },
  { type: "Architect", percent: 20 },
];

const DetailsChart = () => (
  <div className="flex flex-col md:flex-row gap-8 w-full mt-15 bg-[#2A2A39] p-8">
    {/* Left: Legend and Table */}
    <div className="flex-1 min-w-[320px] max-w-lg">
      {/* Legend */}
      <div className="flex gap-8 mb-8">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-base text-gray-200">{item.label}</span>
          </div>
        ))}
      </div>
      {/* Table */}
      <table className="w-full text-left mt-4">
        <thead>
          <tr className="text-gray-200 text-lg">
            <th className="py-3 font-medium">Brain Type</th>
            <th className="py-3 font-medium">Percentage%</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr
              key={row.type}
              className="border-b border-gray-500 last:border-b-0"
            >
              <td className="py-5 text-white text-lg font-normal">
                {row.type}
              </td>
              <td className="py-5 text-white text-lg font-bold">
                {row.percent}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Right: Bar Chart */}
    <div className="flex-1 min-w-[320px] flex items-center justify-center">
      <BarChart
        width={420}
        height={340}
        data={data}
        className="bg-transparent"
        margin={{ left: 0, right: 0, top: 20, bottom: 20 }}
      >
        <CartesianGrid
          stroke="#E5E7EB22"
          strokeDasharray="0"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#fff", fontSize: 16, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#fff", fontSize: 16, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 60]}
          ticks={[0, 10, 20, 30, 40, 50, 60]}
          tickFormatter={(v) => `${v}%`}
        />
        <Bar dataKey="value" barSize={60} isAnimationActive={false}>
          {data.map((entry, idx) => (
            <Cell key={`cell-bar-${idx}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </div>
  </div>
);

export default DetailsChart;
