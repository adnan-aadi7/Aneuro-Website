import React from "react";
import { ChevronDown, Copy } from "lucide-react";

const CustomSelect = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      className="w-full bg-[#232334] border border-[#45455a] text-white px-4 py-3 rounded appearance-none focus:outline-none pr-10"
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className={opt.bold ? "font-semibold" : ""}
        >
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

const funnelPages = [
  {
    title: "Landing Page",
    subtitle: "High-converting landing page with compelling headline and CTA",
  },
  {
    title: "Lead Magnet Page",
    subtitle: "Value-packed lead magnet to capture visitor information",
  },
];

const Filters = () => {
  return (
    <>
      <div className="bg-[#353545] p-6 rounded mb-8">
        <div className="text-cyan-400 text-xl font-semibold mb-6">
          Filter Templates
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brain Type */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Brain Type
            </label>
            <CustomSelect
              options={[
                { value: "all", label: "All Brain Types", bold: true },
                { value: "analytical", label: "Analytical" },
                { value: "creative", label: "Creative" },
                { value: "practical", label: "Practical" },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
          {/* Use Case */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Use Case</label>
            <CustomSelect
              options={[
                { value: "all", label: "All Use Cases" },
                { value: "marketing", label: "Marketing" },
                { value: "sales", label: "Sales" },
                { value: "education", label: "Education" },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
          {/* Tier */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Tier</label>
            <CustomSelect
              options={[
                { value: "all", label: "All Tiers" },
                { value: "basic", label: "Basic" },
                { value: "premium", label: "Premium" },
                { value: "enterprise", label: "Enterprise" },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Funnel Structure Section */}
      <div className="bg-[#353545] p-6 rounded mb-8">
        <div className="text-white text-xl font-semibold mb-6">
          Funnel Structure
        </div>
        <div className="flex flex-col gap-4">
          {funnelPages.map((page, idx) => (
            <div
              key={idx}
              className="bg-[#232334] border border-[#353545] rounded px-6 py-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white text-base font-semibold">
                  {page.title}
                </div>
                <div className="text-cyan-400 text-sm mt-1">
                  {page.subtitle}
                </div>
              </div>
              <button className="border border-cyan-400 text-white text-xs px-4 py-1 rounded flex items-center gap-1 hover:bg-cyan-900 transition">
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-2 mb-8">
        <button className="border border-cyan-400 text-white text-xs px-8 py-2 rounded hover:bg-cyan-900 transition">
          View All 5 Pages
        </button>
      </div>
    </>
  );
};

export default Filters;
