

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";

const prompts = [
  {
    id: 1,
    title: "Social Media Caption Generator",
    subject: "The numbers don't lie - here's what your data reveals",
    body: `Hi [Name],\n\nI analyzed the latest industry data and found 3 insights that could transform your approach:\n\n1. [Specific statistic with source]\n2. [Trend analysis with numbers]\n3. [Actionable recommendation based on data]\n\nWant the full breakdown? Click here to access the complete analysis.\n\nBest,\n[Your Name]`,
    expanded: true,
  },
  {
    id: 2,
    title: "Problem-Solution Framework",
    subject: "Solving [specific problem] with proven methodology...",
    body: `Hi [Name],\n\nHere's how you can solve [specific problem] using our proven framework...\n\n[Step-by-step solution]\n\nLet me know if you'd like the full details!\n\nBest,\n[Your Name]`,
    expanded: false,
  },
];

const Promptype = () => {
  const [expandedId, setExpandedId] = useState(1);

  return (
    <div className="bg-[#2A2A39]  p-8 mt-10">
      {/* Title */}
      <h2 className="text-white text-2xl font-semibold mb-2">
        Analytical Brain Type Prompts
      </h2>
      {/* Dropdown */}
      <select className="w-full bg-[#181A20] text-white p-3 rounded mb-8 border border-[#3A3A4A] focus:outline-none">
        <option>Select a prompt category</option>
        <option>Email</option>
        <option>Social Media</option>
        <option>Blog</option>
      </select>
      {/* Section Title */}
      <h3 className="text-white text-lg font-medium mb-4">
        Email Prompts for Analytical Types
      </h3>
      {/* Prompt Cards */}
      {prompts.map((prompt) => (
        <div key={prompt.id} className="bg-[#23232F] rounded p-6 mb-6 relative">
          {/* Edit Button */}
          <button className="absolute top-4 right-4 flex items-center gap-1 text-cyan-400 border border-cyan-400 px-3 py-1 rounded text-xs font-medium hover:bg-cyan-400 hover:text-[#23253A] transition">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          {/* Title */}
          <div className="text-white text-base font-semibold mb-1">
            {prompt.title}
          </div>
          {/* Subject */}
          <div className="text-cyan-400 text-sm mb-3">
            Subject: {prompt.subject}
          </div>
          {/* Body (expand/collapse) */}
          {expandedId === prompt.id ? (
            <>
              <pre className="text-cyan-200 text-sm whitespace-pre-wrap mb-2 bg-transparent border-0 p-0">
                {prompt.body}
              </pre>
              <button
                className="flex items-center gap-1 text-xs text-gray-300 mt-2"
                onClick={() => setExpandedId(null)}
              >
                <ChevronUp className="w-4 h-4" /> Show Less
              </button>
            </>
          ) : (
            <>
              <div className="text-cyan-200 text-sm mb-2 truncate">
                Subject: {prompt.subject}
              </div>
              <button
                className="flex items-center gap-1 text-xs text-gray-300 mt-2"
                onClick={() => setExpandedId(prompt.id)}
              >
                <ChevronDown className="w-4 h-4" /> View Full Prompt
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Promptype;
