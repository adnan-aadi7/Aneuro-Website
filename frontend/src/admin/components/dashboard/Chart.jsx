import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewSubscribersPerWeek,
  selectNewSubscribersPerWeek,
  selectAdminDashboardLoading,
} from "../../../store/Slice/DashboardSliceAdmin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getDateOfISOWeek(isoWeek, year) {
  const simple = new Date(year, 0, 1 + (isoWeek - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
}

export default function Chart() {
  const dispatch = useDispatch();
  const weeklySubs = useSelector(selectNewSubscribersPerWeek);
  const loading = useSelector(selectAdminDashboardLoading);

  useEffect(() => {
    dispatch(fetchNewSubscribersPerWeek());
  }, [dispatch]);

  const data = useMemo(() => {
    // Initialize months with 0
    const monthTotals = new Array(12).fill(0);
    if (Array.isArray(weeklySubs)) {
      weeklySubs.forEach((item) => {
        const year = item?._id?.year;
        const week = item?._id?.week;
        const count = item?.count || 0;
        if (year && week) {
          const d = getDateOfISOWeek(week, year);
          const m = d.getMonth();
          monthTotals[m] += count;
        }
      });
    }
    return MONTH_LABELS.map((label, idx) => ({ month: label, value: monthTotals[idx] }));
  }, [weeklySubs]);

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
            domain={[0, 'dataMax + 10']}
            className="text-slate-400"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#5eead4"
            strokeWidth={2}
            fill="url(#chartGradient)"
            fillOpacity={1}
            isAnimationActive={!loading.newSubscribers}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
