// import React from "react";

// const COLORS = ["#7B3FF2", "#B46CFA", "#2ED8DF"];
// const LABELS = ["Analyst", "Explorer", "Navigator"];
// const PERCENT = 75;

// const AudienceChart = () => {
//   // Arc angles for 3 segments (each 60deg, 180deg total)
//   const arcs = [
//     { start: 180, end: 240 }, // Analyst
//     { start: 240, end: 300 }, // Explorer
//     { start: 300, end: 360 }, // Navigator
//   ];

//   // Helper to describe an SVG arc
//   const describeArc = (cx, cy, r, startAngle, endAngle) => {
//     const rad = (deg) => (Math.PI * deg) / 180;
//     const x1 = cx + r * Math.cos(rad(startAngle));
//     const y1 = cy + r * Math.sin(rad(startAngle));
//     const x2 = cx + r * Math.cos(rad(endAngle));
//     const y2 = cy + r * Math.sin(rad(endAngle));
//     const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
//     return [
//       `M ${x1} ${y1}`,
//       `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
//       `L ${cx} ${cy}`,
//       "Z",
//     ].join(" ");
//   };

//   return (
//     <div className="bg-[#2A2A39] w-full sm:w-[360px] xl:w-[480px] p-2 text-white text-center font-inter shadow-lg ">
//       <div className="text-[28px] font-medium mb-2">Audience Breakdown</div>
//       <svg width={300} height={160} className="block mx-auto">
//         <defs>
//           <filter id="glow0" x="-40%" y="-40%" width="180%" height="180%">
//             <feDropShadow
//               dx="0"
//               dy="0"
//               stdDeviation="6"
//               floodColor="#7B3FF2"
//               floodOpacity="0.8"
//             />
//           </filter>
//           <filter id="glow1" x="-40%" y="-40%" width="180%" height="180%">
//             <feDropShadow
//               dx="0"
//               dy="0"
//               stdDeviation="6"
//               floodColor="#B46CFA"
//               floodOpacity="0.8"
//             />
//           </filter>
//           <filter id="glow2" x="-40%" y="-40%" width="180%" height="180%">
//             <feDropShadow
//               dx="0"
//               dy="0"
//               stdDeviation="6"
//               floodColor="#2ED8DF"
//               floodOpacity="0.8"
//             />
//           </filter>
//         </defs>
//         {arcs.map((arc, i) => (
//           <path
//             key={i}
//             d={describeArc(150, 130, 120, arc.start, arc.end)}
//             fill={COLORS[i]}
//             opacity={0.95}
//             stroke="#232432"
//             strokeWidth={6}
//             filter={`url(#glow${i})`}
//           />
//         ))}
//         {/* Center circle for cutout effect */}
//         <circle cx={150} cy={130} r={85} fill="#232432" />
//         {/* Percentage text */}
//         <text
//           x="150"
//           y="130"
//           textAnchor="middle"
//           dominantBaseline="middle"
//           fontSize="36"
//           fontWeight="bold"
//           fill="#fff"
//         >
//           {PERCENT}%
//         </text>
//       </svg>
//       <div className="flex justify-center gap-7 mt-13">
//         {LABELS.map((label, i) => (
//           <div key={label} className="flex items-center gap-2">
//             <span
//               className="inline-block w-[14px] h-[14px] rounded-full"
//               style={{ background: COLORS[i] }}
//             />
//             <span className="text-base text-gray-300">{label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AudienceChart;
