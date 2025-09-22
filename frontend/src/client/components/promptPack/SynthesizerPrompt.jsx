import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";

export default function SynthesizerPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFirstPrompt, setShowFirstPrompt] = useState(true);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const isFileContent = (s) =>
    typeof s === "string" &&
    (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));

  const openInNewTab = (url) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      /* noop */
    }
  };

  const promptsForSynthesizer = useMemo(() => {
    const synthesizerPrompts = groupedPrompts.Synthesizer || [];
    return selectedCategory
      ? synthesizerPrompts.filter((p) => p.category === selectedCategory)
      : synthesizerPrompts;
  }, [groupedPrompts.Synthesizer, selectedCategory]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    const set = new Set();
    (groupedPrompts.Synthesizer || []).forEach(
      (p) => p.category && set.add(p.category)
    );
    return Array.from(set);
  }, [categories, groupedPrompts.Synthesizer]);

  const prompt1 = promptsForSynthesizer[0] || null;
  const prompt2 = promptsForSynthesizer[1] || null;

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
          <option key={category} value={category}>
            {category}
          </option>
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
        <button
          className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
          onClick={() => openInNewTab(payload)}
        >
          View
        </button>
      );
    }

    return (
      <button
        className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleCopy(payload, which)}
        disabled={!payload}
      >
        <Copy className="w-4 h-4" />
        {copiedPrompt === which ? "Copied!" : "Copy"}
      </button>
    );
  };

  const renderPromptCard = (promptObj, which, toggleState, setToggleState) => {
    if (!promptObj) return null;
    const payload = promptObj?.content || promptObj?.fileUrl;
    const isFile = isFileContent(payload);

    return (
      <div className="bg-[#23232F] p-6 mb-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {promptObj?.title && (
              <h3 className="text-base font-medium mb-2">{promptObj.title}</h3>
            )}
            {promptObj?.subject && (
              <p className="text-sm mb-4">
                Subject: {promptObj.subject}
              </p>
            )}
          </div>
          {renderButton(promptObj, which)}
        </div>

        {/* If file → show link only */}
        {isFile ? (
          <p className="text-sm  text-gray-400 cursor-pointer">
            <a href={payload} target="_blank" rel="noopener noreferrer">
              {payload}
            </a>
          </p>
        ) : (
          <>
            {toggleState && renderBody(promptObj?.content)}
            <button
              onClick={() => setToggleState(!toggleState)}
              className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  toggleState ? "rotate-180" : ""
                }`}
              />
              {toggleState ? "Show Less" : "Show More"}
            </button>
          </>
        )}

        {/* Rating button always visible */}
        <div className="mt-6 text-right">
          <button
            onClick={() => {
              setSelectedPrompt({
                packId: promptObj?.packId,
                promptId: promptObj?.promptId,
              });
              setIsModalOpen(true);
            }}
            className="text-cyan-300 underline rounded font-medium cursor-pointer"
          >
            Rate this tool
          </button>
        </div>
      </div>
    );
  };

  if (!prompt1 && !prompt2) {
    return (
      <div className="bg-[#303041] text-white mt-10">
        <div className="p-2 lg:p-8">
          <h1 className="text-xl font-medium mb-6">
            Synthesizer Brain Type Prompts
          </h1>
          {renderDropdown()}
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">
              No prompts found for Synthesizer brain type
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">
          Synthesizer Brain Type Prompts
        </h1>
        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">
          Email Prompts for Synthesizer Types
        </h2>

        {renderPromptCard(prompt1, 1, showFirstPrompt, setShowFirstPrompt)}
        {renderPromptCard(prompt2, 2, showFullPrompt, setShowFullPrompt)}
      </div>

      <Popup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packId={selectedPrompt?.packId}
        promptId={selectedPrompt?.promptId}
      />
    </div>
  );
}
