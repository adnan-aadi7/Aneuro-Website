import React, { useState } from "react";
import { ChevronDown, Copy } from "lucide-react";

export default function AnalyticalPrompt({ activeTab = "Analytical" }) {
  // Analytical tab logic (existing)
  const [showFirstPrompt, setShowFirstPrompt] = useState(true);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0); // 0: none, 1: first, 2: second

  const firstPromptText = `Hi [Name],\n\nI analyzed the latest industry data and found 3 insights that could transform your approach:\n1. [Specific statistic with source]\n2. [Trend analysis with numbers]\n3. [Actionable recommendation based on data]\n\nWant the full breakdown? Click here to access the complete analysis.\n\nBest,\n[Your Name]`;

  const secondPromptText = `Hi [Name],\n\nI've identified a specific challenge that [industry/target audience] faces:\nProblem: [Clear problem statement with data/evidence]\nAnalysis: Based on [research/data source], this problem occurs because:\n• [Root cause 1 with supporting data]\n• [Root cause 2 with supporting data]\n• [Root cause 3 with supporting data]\nSolution: I've developed a methodology that addresses each root cause:\n1. [Solution step 1 with measurable outcome]\n2. [Solution step 2 with measurable outcome]\n3. [Solution step 3 with measurable outcome]\nResults: Companies using this approach have seen [specific metrics and improvements].\nWant to see how this applies to your specific situation? Let's schedule a brief analysis call.\n\nBest,\n[Your Name]`;

  const handleCopy = (text, which) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    setTimeout(() => setCopiedPrompt(0), 1500);
  };

  // Dropdown for each tab
  const renderDropdown = (tab) => {
    switch (tab) {
      case "Analytical":
        return (
          <div className="relative mb-8">
            <select className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
              <option>Analytical dropdown</option>
              <option>Architect</option>
              <option>Challenger</option>
              <option>Catalyst</option>
              <option>Reflector</option>
              <option>Synthesizer</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );
      case "Creative":
        return (
          <div className="relative mb-8">
            <select className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
              <option>Creative dropdown</option>
              <option>Innovator</option>
              <option>Visionary</option>
              <option>Storyteller</option>
              <option>Designer</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );
      case "Empathetic":
        return (
          <div className="relative mb-8">
            <select className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
              <option>Empathetic dropdown</option>
              <option>Connector</option>
              <option>Supporter</option>
              <option>Listener</option>
              <option>Motivator</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );
      case "Strategic":
        return (
          <div className="relative mb-8">
            <select className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
              <option>Strategic dropdown</option>
              <option>Planner</option>
              <option>Organizer</option>
              <option>Evaluator</option>
              <option>Coordinator</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );
      case "Practical":
        return (
          <div className="relative mb-8">
            <select className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
              <option>Practical dropdown</option>
              <option>Implementer</option>
              <option>Operator</option>
              <option>Fixer</option>
              <option>Producer</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );
      default:
        return null;
    }
  };

  // Content for each tab
  const renderContent = (tab) => {
    if (tab === "Analytical") {
      return (
        <>
          {/* Email Prompts Section */}
          <h2 className="text-lg font-medium mb-6">
            Email Prompts for Analytical Types
          </h2>
          {/* Social Media Caption Generator */}
          <div className="bg-[#23232F] p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-base font-medium mb-2">
                  Social Media Caption Generator
                </h3>
                <p className="text-cyan-400 text-sm mb-4">
                  Subject: The numbers don't lie - here's what your data reveals
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
                <p>
                  I analyzed the latest industry data and found 3 insights that
                  could transform your approach:
                </p>
                <div className="ml-4 space-y-1">
                  <p>1. [Specific statistic with source]</p>
                  <p>2. [Trend analysis with numbers]</p>
                  <p>3. [Actionable recommendation based on data]</p>
                </div>
                <p>
                  Want the full breakdown? Click here to access the complete
                  analysis.
                </p>
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
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFirstPrompt ? "rotate-180" : ""
                }`}
              />
              {showFirstPrompt ? "Show Less" : "Show More"}
            </button>
          </div>
          {/* Problem-Solution Framework */}
          <div className="bg-[#23232F] p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-base font-medium mb-2">
                  Problem-Solution Framework
                </h3>
                <p className="text-cyan-400 text-sm mb-4">
                  Subject: Solving [specific problem] with proven methodology...
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
                <p>
                  I've identified a specific challenge that [industry/target
                  audience] faces:
                </p>
                <p>
                  <strong>Problem:</strong> [Clear problem statement with
                  data/evidence]
                </p>
                <p>
                  <strong>Analysis:</strong> Based on [research/data source],
                  this problem occurs because:
                </p>
                <div className="ml-4 space-y-1">
                  <p>• [Root cause 1 with supporting data]</p>
                  <p>• [Root cause 2 with supporting data]</p>
                  <p>• [Root cause 3 with supporting data]</p>
                </div>
                <p>
                  <strong>Solution:</strong> I've developed a methodology that
                  addresses each root cause:
                </p>
                <div className="ml-4 space-y-1">
                  <p>1. [Solution step 1 with measurable outcome]</p>
                  <p>2. [Solution step 2 with measurable outcome]</p>
                  <p>3. [Solution step 3 with measurable outcome]</p>
                </div>
                <p>
                  <strong>Results:</strong> Companies using this approach have
                  seen [specific metrics and improvements].
                </p>
                <p>
                  Want to see how this applies to your specific situation? Let's
                  schedule a brief analysis call.
                </p>
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
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFullPrompt ? "rotate-180" : ""
                }`}
              />
              {showFullPrompt ? "Show Less" : "View Full Prompt"}
            </button>
          </div>
        </>
      );
    } else if (tab === "Creative") {
      return (
        <div className="bg-[#23232F] p-6">
          <h2 className="text-lg font-medium mb-6">Creative Prompts</h2>
          <p className="text-gray-400 mb-4">
            This is the Creative tab. Add your creative prompts here.
          </p>
        </div>
      );
    } else if (tab === "Empathetic") {
      return (
        <div className="bg-[#23232F] p-6">
          <h2 className="text-lg font-medium mb-6">Empathetic Prompts</h2>
          <p className="text-gray-400 mb-4">
            This is the Empathetic tab. Add your empathetic prompts here.
          </p>
        </div>
      );
    } else if (tab === "Strategic") {
      return (
        <div className="bg-[#23232F] p-6">
          <h2 className="text-lg font-medium mb-6">Strategic Prompts</h2>
          <p className="text-gray-400 mb-4">
            This is the Strategic tab. Add your strategic prompts here.
          </p>
        </div>
      );
    } else if (tab === "Practical") {
      return (
        <div className="bg-[#23232F] p-6">
          <h2 className="text-lg font-medium mb-6">Practical Prompts</h2>
          <p className="text-gray-400 mb-4">
            This is the Practical tab. Add your practical prompts here.
          </p>
        </div>
      );
    } else {
      return (
        <div className="bg-[#23232F] p-6">
          <h2 className="text-lg font-medium mb-6">{tab} Prompts</h2>
          <p className="text-gray-400 mb-4">
            Dropdown and content for {tab} brain type will appear here.
          </p>
        </div>
      );
    }
  };

  return (
    <div className=" bg-[#303041] text-white mt-10">
      {/* Header */}
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">
          {activeTab} Brain Type Prompts
        </h1>
        {/* Dropdown changes by tab */}
        {renderDropdown(activeTab)}
        {/* Content changes by tab */}
        {renderContent(activeTab)}
      </div>
    </div>
  );
}
