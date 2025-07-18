import React, { useState } from "react";
import { ChevronDown, Copy } from "lucide-react";

export default function PracticalPrompt() {
  const [showFirstPrompt, setShowFirstPrompt] = useState(true);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);

  const firstPromptText = `Hi [Name],\n\nHere's a practical tip to improve your workflow:\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nWant more practical advice? Click here for a full guide.\n\nBest,\n[Your Name]`;

  const secondPromptText = `Hi [Name],\n\nI've identified a practical challenge you might face:\nProblem: [Describe the challenge]\nAnalysis: [Why this is a practical issue]\nSolution: [Practical solution steps]\nResults: [Expected practical outcomes]\n\nWant to discuss more solutions? Let's connect!\n\nBest,\n[Your Name]`;

  const handleCopy = (text, which) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    setTimeout(() => setCopiedPrompt(0), 1500);
  };

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">
          Practical Brain Type Prompts
        </h1>
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
        {/* Practical Social Media Caption Generator */}
        <div className="bg-[#23232F] p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">
                Practical Social Media Caption Generator
              </h3>
              <p className="text-cyan-400 text-sm mb-4">
                Subject: Get things done with this practical tip!
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
              <p>Here's a practical tip to improve your workflow:</p>
              <div className="ml-4 space-y-1">
                <p>1. [Step 1]</p>
                <p>2. [Step 2]</p>
                <p>3. [Step 3]</p>
              </div>
              <p>Want more practical advice? Click here for a full guide.</p>
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
        {/* Practical Problem-Solution Framework */}
        <div className="bg-[#23232F] p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">
                Practical Problem-Solution Framework
              </h3>
              <p className="text-cyan-400 text-sm mb-4">
                Subject: Solving practical challenges efficiently...
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
              <p>I've identified a practical challenge you might face:</p>
              <p>
                <strong>Problem:</strong> [Describe the challenge]
              </p>
              <p>
                <strong>Analysis:</strong> [Why this is a practical issue]
              </p>
              <div className="ml-4 space-y-1">
                <p>• [Reason 1]</p>
                <p>• [Reason 2]</p>
                <p>• [Reason 3]</p>
              </div>
              <p>
                <strong>Solution:</strong> [Practical solution steps]
              </p>
              <div className="ml-4 space-y-1">
                <p>1. [Step 1]</p>
                <p>2. [Step 2]</p>
                <p>3. [Step 3]</p>
              </div>
              <p>
                <strong>Results:</strong> [Expected practical outcomes]
              </p>
              <p>Want to discuss more solutions? Let's connect!</p>
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
      </div>
    </div>
  );
}
