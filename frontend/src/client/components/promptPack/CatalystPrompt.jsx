import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";

export default function CatalystPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFirstPrompt, setShowFirstPrompt] = useState(true);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [emailTooltipPos, setEmailTooltipPos] = useState({ x: 0, y: 0 });

  const isFileContent = (s) => typeof s === "string" && (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));
  const openInNewTab = (url) => { try { window.open(url, "_blank", "noopener,noreferrer"); } catch { /* noop */ } };

  const promptsForCatalyst = useMemo(() => {
    const catalystPrompts = groupedPrompts.Catalyst || [];
    return selectedCategory ? catalystPrompts.filter((p) => p.category === selectedCategory) : catalystPrompts;
  }, [groupedPrompts.Catalyst, selectedCategory]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    const set = new Set();
    (groupedPrompts.Catalyst || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [categories, groupedPrompts.Catalyst]);

  const prompt1 = promptsForCatalyst[0] || null;
  const prompt2 = promptsForCatalyst[1] || null;

  const handleCopy = (text, which) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    setTimeout(() => setCopiedPrompt(0), 1500);
  };

  const renderDropdown = () => (
    <div className="relative mb-8">
      <select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
      >
        <option value="">All Categories</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );

  const renderBody = (text) => {
    if (!text || isFileContent(text)) return null;
    return (
      <div className="text-sm text-gray-300 space-y-3">
        <pre className="whitespace-pre-wrap font-sans">{text}</pre>
      </div>
    );
  };

  const renderButton = (promptObj, which) => {
    const payload = promptObj?.content || promptObj?.fileUrl;
    if (!payload) return null;
    const isFile = isFileContent(payload);
    if (isFile) {
      return (
        <button className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]" onClick={() => openInNewTab(payload)}>View</button>
      );
    }
    return (
      <button className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleCopy(payload, which)} disabled={!payload}>
        <Copy className="w-4 h-4" />{copiedPrompt === which ? "Copied!" : "Copy"}
      </button>
    );
  };

  if (!prompt1 && !prompt2) {
    return (
      <div className="bg-[#303041] text-white mt-10">
        <div className="p-2 lg:p-8">
          <h1 className="text-xl font-medium mb-6">Catalyst Brain Type Prompts</h1>
          {renderDropdown()}
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">No prompts found for Catalyst brain type</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">Catalyst Brain Type Prompts</h1>
        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">Email Prompts for Catalyst Types</h2>

        <div className="bg-[#23232F] p-6 mb-4 relative" onMouseEnter={() => setShowEmailTooltip(true)} onMouseLeave={() => setShowEmailTooltip(false)} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setEmailTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); }}>
          {showEmailTooltip && (
            <div className="pointer-events-none bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap" style={{ position: "absolute", left: emailTooltipPos.x + 10, top: emailTooltipPos.y + 10, minWidth: "max-content", maxWidth: 180 }}>
              This section generates a practical social media caption email prompt, including subject, copy button, and example message.
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">Practical Social Media Caption Generator</h3>
              <p className="text-cyan-400 text-sm mb-4">Subject: Get things done with this practical tip!</p>
            </div>
            {renderButton(prompt1, 1)}
          </div>
          {showFirstPrompt && renderBody(prompt1?.content)}
          <button onClick={() => setShowFirstPrompt(!showFirstPrompt)} className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300">
            <ChevronDown className={`w-4 h-4 transition-transform ${showFirstPrompt ? "rotate-180" : ""}`} />
            {showFirstPrompt ? "Show Less" : "Show More"}
          </button>
        </div>

        <div className="bg-[#23232F] p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">Practical Problem-Solution Framework</h3>
              <p className="text-cyan-400 text-sm mb-4">Subject: Solving practical challenges efficiently...</p>
            </div>
            {renderButton(prompt2, 2)}
          </div>
          {showFullPrompt && (<div className="mt-4 text-sm text-gray-300 space-y-3">{renderBody(prompt2?.content)}</div>)}
          <button onClick={() => setShowFullPrompt(!showFullPrompt)} className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300">
            <ChevronDown className={`w-4 h-4 transition-transform ${showFullPrompt ? "rotate-180" : ""}`} />
            {showFullPrompt ? "Show Less" : "View Full Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
