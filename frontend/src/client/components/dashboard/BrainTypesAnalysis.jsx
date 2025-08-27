import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../store/axiosInstance"; // adjust path if needed
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
  Tooltip,
} from "recharts";

// --- static BAR stays unchanged ---
// const barData = [
//   { date: "12/2025", value: 500, color: "#A78BFA", line: 320 },
//   { date: "13/2025", value: 300, color: "#2DD4BF", line: 340 },
//   { date: "14/2025", value: 670, color: "#22D3EE", line: 400 },
//   { date: "15/2025", value: 430, color: "#A78BFA", line: 280 },
//   { date: "16/2025", value: 90, color: "#22D3EE", line: 260 },
// ];

// Updated brain type meta with the five specified types
const TYPE_META = {
  Architect: {
    color: "#22D3EE", // Light blue
    desc: "Thinks logically, values data, and focuses on problem-solving.",
  },
  Catalyst: {
    color: "#F59E0B", // Orange
    desc: "Action‑oriented, energizes teams and drives outcomes.",
  },
  Reflector: {
    color: "#60A5FA", // Blue
    desc: "Observes patterns and makes thoughtful, measured decisions.",
  },
  Synthesizer: {
    color: "#A78BFA", // Purple
    desc: "Driven by imagination, innovation, and original ideas.",
  },
  Challenger: {
    color: "#02D193", // Updated Challenger color
    desc: "Direct, bold, and confident—moves things forward fast.",
  },
};

// Fallback palette for any additional/unknown brain types
const PALETTE = [
  "#22D3EE", "#A78BFA", "#2DD4BF", "#60A5FA", "#F59E0B",
  "#F97316", "#10B981", "#EF4444", "#84CC16", "#D946EF",
];

function getUserIdFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      return (
        u?.id || u?._id || u?.userId || u?.user?.id || u?.user?._id || null
      );
    }
  } catch {
    // ignore
  }
  return (
    localStorage.getItem("userId") ||
    localStorage.getItem("_id") ||
    "6899c91e63df31445aa9485a"
  );
}

// Parse "50.00%" -> 50 (number). If it's already a number, use it.
function parsePercent(v) {
  if (typeof v === "string") {
    return parseFloat(v.replace("%", "")) || 0;
  }
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
}

// Map API -> donut array [{name, value, color, desc}]
function toDonutFromAudienceStats(apiData) {
  const dist =
    apiData?.stats?.brainTypeDistribution ||
    apiData?.brainTypeDistribution ||
    apiData?.data?.stats?.brainTypeDistribution ||
    {};

  const entries = Object.entries(dist); // [["Reflector","50.00%"], ...]
  if (!entries.length) return [];

  let paletteIdx = 0;
  return entries.map(([name, raw]) => {
    const meta = TYPE_META[name] || {};
    const color = meta.color || PALETTE[paletteIdx++ % PALETTE.length];
    return {
      name,
      value: parsePercent(raw),
      color,
      desc: meta.desc || "Audience segment",
    };
  });
}

const RADIAN = Math.PI / 180;

const BrainTypesAnalysis = () => {
  const [{ donut, loading, error }, setState] = useState({
    donut: [],
    loading: true,
    error: null,
  });

  // label renderer uses current donut data
  const renderCustomizedLabel = useMemo(() => {
    return ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      const pct = donut?.[index]?.value ?? 0;
      return (
        <text
          x={x}
          y={y}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={24}
          fontWeight="bold"
          className="drop-shadow-lg"
        >
          {`${Math.round(pct)}%`}
        </text>
      );
    };
  }, [donut]);

  useEffect(() => {
    let cancelled = false;
    const userId = getUserIdFromStorage();

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const { data } = await axiosInstance.get(
          `/user-analytics/user/${userId}/audience-stats`
        );
        const donutData = toDonutFromAudienceStats(data);
        if (!cancelled) setState({ donut: donutData, loading: false, error: null });
      } catch (e) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error:
              e?.response?.data?.message ||
              e?.message ||
              "Failed to load audience stats",
          }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full max-w-full mx-auto p-4 md:p-8 bg-[#2A2A39] text-white font-inter overflow-visible flex flex-col md:flex-row gap-8 items-start mt-10 overflow-x-auto">
      {/* Left: Donut chart and floating labels */}
      <div className="w-[320px] md:flex-1 md:min-w-[340px] flex flex-col items-start relative ">
        <div className="text-2xl font-medium mb-2 self-start">
          Brain Types Analytic
        </div>

        {error && <div className="text-red-400 text-sm mb-3">{String(error)}</div>}

        {/* Legend */}
        <div className="flex gap-8 mb-8 self-start z-20 relative">
          {donut.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: d.color }}
              />
              <span className="text-base font-medium" style={{ color: d.color }}>
                {d.name}
              </span>
            </div>
          ))}
        </div>

        <div
          className="relative flex items-start justify-start ml-20"
          style={{ minHeight: donut.length ? 340 : 120 }}
        >
          {loading ? (
            <div className="text-sm text-gray-300">Loading chart…</div>
          ) : donut.length === 0 ? (
            <div className="text-sm text-gray-300">No audience stats yet.</div>
          ) : (
            <PieChart width={340} height={340} className="z-10">
              <Pie
                data={donut}
                cx={170}
                cy={170}
                innerRadius={90}
                outerRadius={150}
                startAngle={180}
                endAngle={-180}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={false}
              >
                {donut.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>


            </PieChart>
          )}

          {/* Floating info cards positioned around the chart like in the image */}
          {donut.find((d) => d.name === "Architect") && (
            <div
              className="hidden md:block absolute left-0 top-[50px] -translate-y-1/2 -translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
              style={{
                background: "#2A2A39",
                boxShadow: "0 0 80px 3px #12DCF055, 0 1px 4px #0006",
              }}
            >
              <div className="font-semibold text-white mb-1">Architect</div>
              <div className="text-xs text-gray-200 leading-snug">
                {TYPE_META.Architect.desc}
              </div>
            </div>
          )}
          {donut.find((d) => d.name === "Synthesizer") && (
            <div
              className="hidden md:block absolute right-0 top-0 translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
              style={{
                background: "#2A2A39",
                boxShadow: "0 0 80px 3px #12DCF055, 0 1px 4px #0006",
              }}
            >
              <div className="font-semibold text-white mb-1">Synthesizer</div>
              <div className="text-xs text-gray-200 leading-snug">
                {TYPE_META.Synthesizer.desc}
              </div>
            </div>
          )}
          {donut.find((d) => d.name === "Catalyst") && (
            <div
              className="hidden md:block absolute right-0 bottom-0 translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
              style={{
                background: "#2A2A39",
                boxShadow: "0 0 80px 3px #12DCF055, 0 1px 4px #0006",
              }}
            >
              <div className="font-semibold text-white mb-1">Catalyst</div>
              <div className="text-xs text-gray-200 leading-snug">
                {TYPE_META.Catalyst.desc}
              </div>
            </div>
          )}
          {donut.find((d) => d.name === "Reflector") && (
            <div
              className="hidden md:block absolute left-0 top-0 -translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
              style={{
                background: "#2A2A39",
                boxShadow: "0 0 80px 3px #12DCF055, 0 1px 4px #0006",
              }}
            >
              <div className="font-semibold text-white mb-1">Reflector</div>
              <div className="text-xs text-gray-200 leading-snug">
                {TYPE_META.Reflector.desc}
              </div>
            </div>
          )}
          {donut.find((d) => d.name === "Challenger") && (
            <div
              className="hidden md:block absolute left-0 bottom-0 -translate-x-[60%] w-48 rounded-lg px-4 py-3 shadow-lg z-30"
              style={{
                background: "#2A2A39",
                boxShadow: "0 0 80px 3px #12DCF055, 0 1px 4px #0006",
              }}
            >
              <div className="font-semibold text-white mb-1">Challenger</div>
              <div className="text-xs text-gray-200 leading-snug">
                {TYPE_META.Challenger.desc}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: keep your existing bar + line */}
      {/* <div className="w-[320px] md:flex-1 md:min-w-[340px] flex items-center justify-center mt-8">
        <BarChart width={370} height={370} data={barData} className="bg-transparent">
          <CartesianGrid stroke="#E5E7EB22" strokeDasharray="0" vertical={false} />
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
      </div> */}
    </div>
  );
};

export default BrainTypesAnalysis;
