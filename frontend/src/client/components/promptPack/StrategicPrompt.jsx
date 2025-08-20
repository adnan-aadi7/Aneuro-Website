import React, { useState } from "react";
import { ChevronDown, Copy } from "lucide-react";

export default function StrategicPrompt({ categories = [] }) {
  const [showFirstPrompt, setShowFirstPrompt] = useState(true);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [emailTooltipPos, setEmailTooltipPos] = useState({ x: 0, y: 0 });

  const firstPromptText = `Hi [Name],\n\nHere's a strategic insight to help you plan ahead:\n1. [Key objective]\n2. [Tactical step]\n3. [Expected outcome]\n\nWant a full strategic roadmap? Click here for more.\n\nBest,\n[Your Name]`;

  const secondPromptText = `Hi [Name],\n\nI've identified a strategic challenge for your team:\nProblem: [Describe the challenge]\nAnalysis: [Why this is a strategic issue]\n• [Reason 1]\n• [Reason 2]\n• [Reason 3]\nSolution: [Strategic solution steps]\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\nResults: [Expected strategic outcomes]\n\nWant to discuss your strategy? Let's connect!\n\nBest,\n[Your Name]`;

  const handleCopy = (text, which) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    setTimeout(() => setCopiedPrompt(0), 1500);
  };

  const renderDropdown = () => {
    return (
      <div className="relative mb-8">
        <select className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
          <option>Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">Reflector Brain Type Prompts</h1>
        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">Email Prompts for Reflector Types</h2>

        <div
          className="bg-[#23232F] p-6 mb-4 relative"
          onMouseEnter={() => setShowEmailTooltip(true)}
          onMouseLeave={() => setShowEmailTooltip(false)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setEmailTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
        >
          {showEmailTooltip && (
            <div
              className="pointer-events-none bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap"
              style={{ position: "absolute", left: emailTooltipPos.x + 10, top: emailTooltipPos.y + 10, minWidth: "max-content", maxWidth: 180 }}
            >
              This section generates a strategic social media caption email
              prompt, including subject, copy button, and example message.
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">
                Strategic Social Media Caption Generator
              </h3>
              <p className="text-cyan-400 text-sm mb-4">
                Subject: Plan for success with this strategy!
              </p>
            </div>
            <button
              className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
              onClick={() => handleCopy(firstPromptText, 1)}
            >
              <Copy className="w-4 h-4" />
              {copiedPrompt === 1 ? "Copied!" : "Copy"}
            </button>
          </div>
          {showFirstPrompt && (
            <div className="text-sm text-gray-300 space-y-3">
              <p>Hi [Name],</p>
              <p>Here's a strategic insight to help you plan ahead:</p>
              <div className="ml-4 space-y-1">
                <p>1. [Key objective]</p>
                <p>2. [Tactical step]</p>
                <p>3. [Expected outcome]</p>
              </div>
              <p>Want a full strategic roadmap? Click here for more.</p>
              <div className="mt-4">
                <p>Best,</p>
                <p>[Your Name]</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowFirstPrompt(!showFirstPrompt)}
            className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showFirstPrompt ? "rotate-180" : ""}`} />
            {showFirstPrompt ? "Show Less" : "Show More"}
          </button>
        </div>

        <div className="bg-[#23232F] p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">
                Strategic Problem-Solution Framework
              </h3>
              <p className="text-cyan-400 text-sm mb-4">
                Subject: Solving strategic challenges with proven methods...
              </p>
            </div>
            <button
              className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
              onClick={() => handleCopy(secondPromptText, 2)}
            >
              <Copy className="w-4 h-4" />
              {copiedPrompt === 2 ? "Copied!" : "Copy"}
            </button>
          </div>
          {showFullPrompt && (
            <div className="mt-4 text-sm text-gray-300 space-y-3">
              <p>Hi [Name],</p>
              <p>I've identified a strategic challenge for your team:</p>
              <p><strong>Problem:</strong> [Describe the challenge]</p>
              <p><strong>Analysis:</strong> [Why this is a strategic issue]</p>
              <div className="ml-4 space-y-1">
                <p>• [Reason 1]</p>
                <p>• [Reason 2]</p>
                <p>• [Reason 3]</p>
              </div>
              <p><strong>Solution:</strong> [Strategic solution steps]</p>
              <div className="ml-4 space-y-1">
                <p>1. [Step 1]</p>
                <p>2. [Step 2]</p>
                <p>3. [Step 3]</p>
              </div>
              <p><strong>Results:</strong> [Expected strategic outcomes]</p>
              <p>Want to discuss your strategy? Let's connect!</p>
              <div className="mt-4">
                <p>Best,</p>
                <p>[Your Name]</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowFullPrompt(!showFullPrompt)}
            className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showFullPrompt ? "rotate-180" : ""}`} />
            {showFullPrompt ? "Show Less" : "View Full Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
