import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", value: 180 },
  { month: "Feb", value: 220 },
  { month: "Mar", value: 200 },
  { month: "Apr", value: 320 },
  { month: "May", value: 350 },
  { month: "Jun", value: 480 },
  { month: "Jul", value: 280 },
  { month: "Aug", value: 240 },
  { month: "Sep", value: 350 },
  { month: "Oct", value: 220 },
  { month: "Nov", value: 380 },
  { month: "Dec", value: 420 },
];

export default function Chart() {
  return (
    <div className="w-full h-96 bg-[#2A2A39] p-6 mt-10 pb-15">
      <h2 className="text-white text-xl font-semibold mb-6">MRR</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FD1C5" stopOpacity="0.54" />
              <stop offset="100%" stopColor="#4FD1C5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            className="text-slate-400"
          />
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="#374151"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            domain={[0, 500]}
            ticks={[0, 100, 200, 300, 400, 500]}
            className="text-slate-400"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#5eead4"
            strokeWidth={2}
            fill="url(#chartGradient)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
