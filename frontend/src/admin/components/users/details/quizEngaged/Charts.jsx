import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectBrainTypeBreakdown } from "../../../../../store/Slice/QuizSlice";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  Analytical: "#22D3EE",
  Creative: "#A78BFA",
  Balanced: "#2DD4BF",
  Architect: "#22D3EE",
  Reflector: "#A78BFA",
  Catalyst: "#2DD4BF",
  Synthesizer: "#60A5FA",
  Challenger: "#F59E0B",
};
const KNOWN_TYPES = ["Architect", "Reflector", "Catalyst", "Synthesizer", "Challenger"];

// Right-side bar chart removed

const RADIAN = Math.PI / 180;

const Charts = () => {
  const breakdownObj = useSelector(selectBrainTypeBreakdown);

  const data = useMemo(() => {
    const baseNames = breakdownObj ? Object.keys(breakdownObj) : KNOWN_TYPES;
    const computed = baseNames.map((name) => {
      const display = Math.round(breakdownObj?.[name]?.percentage ?? 0);
      return {
        name,
        display,
        // Render value ensures chart is visible even when all zeros
        value: display,
        color: COLORS[name] || "#64748B",
      };
    });
    const sum = computed.reduce((s, d) => s + (Number.isFinite(d.display) ? d.display : 0), 0);
    if (sum === 0) {
      // Use minimal non-zero values to render the ring, but keep labels at 0%
      return computed.map((d) => ({ ...d, value: 1 }));
    }
    return computed;
  }, [breakdownObj]);

  // totalValue retained via fallback; no need for separate overlay

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
        {`${data[index].display}%`}
      </text>
    );
  };

  return (
    <div className="relative w-full max-w-full mx-auto   bg-[#2A2A39] text-white font-inter overflow-visible flex flex-col gap-8 items-start">
      {/* Left: Donut chart and floating labels */}
      <div className="w-[320px] md:flex-1 md:min-w-[340px] flex flex-col items-center relative">
        <div className="text-2xl font-medium mb-2 self-start">
          Brain Types Analytic
        </div>
        {/* Legend */}
        <div className="flex gap-8 mb-8 self-start z-20 relative ">
          {data.map((d) => (
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
        <div className="relative flex items-center justify-center min-h-[340px] mt-10 pl-24 md:pl-32">
          {/* Always render chart; fallback data ensures visibility */}
          <PieChart width={315} height={340} className="z-10">
            <Pie
              data={data}
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
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          {/* Analytical label (left) */}
          <div
            className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-56 rounded-lg px-4 py-3 shadow-lg z-30"
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
            <div className="font-semibold text-white mb-1">Balanced</div>
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
      {/* Right-side chart removed */}
    </div>
  );
};

export default Charts;
