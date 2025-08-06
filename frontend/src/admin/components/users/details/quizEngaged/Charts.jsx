import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
} from "recharts";

const donutData = [
  {
    name: "Analytical",
    value: 40,
    color: "#22D3EE",
    desc: "Thinks logically, values data, and focuses on problem-solving.",
  },
  {
    name: "Creative",
    value: 30,
    color: "#A78BFA",
    desc: "Driven by imagination, innovation, and original ideas.",
  },
  {
    name: "Balanced",
    value: 60,
    color: "#2DD4BF",
    desc: "Blends logic and creativity for well-rounded decision-making.",
  },
];

// Each bar is a different color per group, and the line overlays all
const barData = [
  { date: "12/2025", value: 500, color: "#A78BFA", line: 320 },
  { date: "13/2025", value: 300, color: "#2DD4BF", line: 340 },
  { date: "14/2025", value: 670, color: "#22D3EE", line: 400 },
  { date: "15/2025", value: 430, color: "#A78BFA", line: 280 },
  { date: "16/2025", value: 90, color: "#22D3EE", line: 260 },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={20}
      fontWeight="bold"
      className="drop-shadow-lg"
    >
      {`${donutData[index].value}%`}
    </text>
  );
};

const Charts = () => {
  return (
    <div className="relative w-full max-w-full mx-auto   bg-[#2A2A39] text-white font-inter overflow-visible flex flex-col md:flex-row gap-8 items-start  overflow-x-auto">
      {/* Left: Donut chart and floating labels */}
      <div className="w-[320px] md:flex-1 md:min-w-[340px] flex flex-col items-center relative">
        <div className="text-2xl font-medium mb-2 self-start">
          Brain Types Analytic
        </div>
        {/* Legend */}
        <div className="flex gap-8 mb-8 self-start z-20 relative ">
          {donutData.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: d.color }}
              />
              <span
                className="text-base font-medium"
                style={{ color: d.color }}
              >
                {d.name}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex items-center justify-center min-h-[340px] mt-10">
          <PieChart width={315} height={340} className="z-10">
            <Pie
              data={donutData}
              cx={170}
              cy={170}
              innerRadius={90}
              outerRadius={140}
              startAngle={180}
              endAngle={-180}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
              isAnimationActive={false}
            >
              {donutData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          {/* Analytical label (left) */}
          <div
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
            style={{
              background: "#232432cc",
              
            }}
          >
            <div className="font-semibold text-white mb-1">Analytical</div>
            <div className="text-xs text-gray-200 leading-snug">
              Thinks logically, values data, and focuses on problem-solving.
            </div>
          </div>
          {/* Creative label (top right) */}
          <div
            className="hidden md:block absolute right-0 top-0 translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
            style={{
              background: "#232432cc",
              
            }}
          >
            <div className="font-semibold text-white mb-1">Creative</div>
            <div className="text-xs text-gray-200 leading-snug">
              Driven by imagination, innovation, and original ideas.
            </div>
          </div>
          {/* Balanced label (bottom right) */}
          <div
            className="hidden md:block absolute right-0 bottom-0 translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
            style={{
              background: "#232432cc",
             
            }}
          >
            <div className="font-semibold text-white mb-1">Balanced</div>
            <div className="text-xs text-gray-200 leading-snug">
              Blends logic and creativity for well-rounded decision-making.
            </div>
          </div>
        </div>
      </div>
      {/* Right: Single bar per group, colored, with cyan line overlay */}
      <div className="w-[320px] md:flex-1 md:min-w-[340px] flex items-center justify-center mt-8">
        <BarChart
          width={370}
          height={370}
          data={barData}
          className="bg-transparent"
        >
          <CartesianGrid
            stroke="#E5E7EB22"
            strokeDasharray="0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#fff", fontSize: 15, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#fff", fontSize: 15, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" barSize={60} isAnimationActive={false}>
            {barData.map((entry, idx) => (
              <Cell key={`cell-bar-${idx}`} fill={entry.color} />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="line"
            stroke="#22D3EE"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </BarChart>
      </div>
    </div>
  );
};

export default Charts;
