import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLOR_MAP = {
  Architect: "#A78BFA",
  Catalyst: "#22D3EE",
  Reflector: "#2DE1C2",
  Synthesizer: "#F59E42",
  Challenger: "#F43F5E",
};

const DetailsChart = ({ chartData }) => {
  const data = useMemo(() => {
    const types = ["Architect", "Catalyst", "Reflector", "Synthesizer", "Challenger"];
    return types.map((t) => ({ name: t, value: chartData?.[t] ?? 0, color: COLOR_MAP[t] }));
  }, [chartData]);

  const tableRows = useMemo(() => {
    return [
      { type: "Catalyst", percent: chartData?.Catalyst ?? 0 },
      { type: "Synthesizer", percent: chartData?.Synthesizer ?? 0 },
      { type: "Reflector", percent: chartData?.Reflector ?? 0 },
      { type: "Architect", percent: chartData?.Architect ?? 0 },
      { type: "Challenger", percent: chartData?.Challenger ?? 0 },
    ];
  }, [chartData]);

  const legend = useMemo(() => {
    return [
      { label: "Architect", color: COLOR_MAP.Architect },
      { label: "Catalyst", color: COLOR_MAP.Catalyst },
      { label: "Reflector", color: COLOR_MAP.Reflector },
      { label: "Synthesizer", color: COLOR_MAP.Synthesizer },
      { label: "Challenger", color: COLOR_MAP.Challenger },
    ];
  }, []);

  return (
  <div className="flex flex-col md:flex-row gap-8 w-full mt-15 bg-[#2A2A39] lg:p-8 p-2">
    {/* Left: Legend and Table */}
    <div className="flex-1 min-w-[0] md:min-w-[320px] md:max-w-lg w-full">
      {/* Legend */}
      <div className="flex gap-8 mb-8 flex-wrap">
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
    <div className="flex-1 min-w-[0] md:min-w-[320px] flex items-center justify-center w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Bar dataKey="value" barSize={60} isAnimationActive={false}>
            {data.map((entry, idx) => (
              <Cell key={`cell-bar-${idx}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default DetailsChart;
