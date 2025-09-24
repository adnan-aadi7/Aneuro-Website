import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";
import axiosInstance from "../../../store/axiosInstance";
export default function CatalystPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFirstPrompt, setShowFirstPrompt] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // ✅ Safe API runner
  const runCare = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      console.error("API Error:", err);
      return null;
    }
  };

  // ✅ Record click
  const recordPromptClick = async (packId, promptId) => {
    if (!packId || !promptId) return;
    await runCare(() =>
      axiosInstance.post(`/api/prompt-packs/${packId}/prompts/${promptId}/click`)
    );
  };

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

  const promptsForCatalyst = useMemo(() => {
    const catalystPrompts = groupedPrompts.Catalyst || [];
    return selectedCategory
      ? catalystPrompts.filter((p) => p.category === selectedCategory)
      : catalystPrompts;
  }, [groupedPrompts.Catalyst, selectedCategory]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    const set = new Set();
    (groupedPrompts.Catalyst || []).forEach(
      (p) => p.category && set.add(p.category)
    );
    return Array.from(set);
  }, [categories, groupedPrompts.Catalyst]);

  const prompt1 = promptsForCatalyst[0] || null;
  const prompt2 = promptsForCatalyst[1] || null;

  // ✅ Copy handler
  const handleCopy = (text, which, promptObj) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    setTimeout(() => setCopiedPrompt(0), 1500);
    recordPromptClick(promptObj?.packId, promptObj?.promptId);
  };

  // ✅ Truncate helper
  const truncateText = (text, wordLimit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
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

  // ✅ Body renderer with truncation
  const renderBody = (text, expanded) => {
    if (!text || isFileContent(text)) return null;
    const displayText = expanded ? text : truncateText(text, 40);
    return (
      <div className="text-sm text-gray-300 space-y-3">
        <pre className="whitespace-pre-wrap font-sans">{displayText}</pre>
      </div>
    );
  };

  // ✅ Copy / View button
  const renderButton = (promptObj, which) => {
    const payload = promptObj?.content || promptObj?.fileUrl;
    if (!payload) return null;
    const isFile = isFileContent(payload);
    if (isFile) {
      return (
        <button
          className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
          onClick={() => {
            openInNewTab(payload);
            recordPromptClick(promptObj?.packId, promptObj?.promptId);
          }}
        >
          View
        </button>
      );
    }
    return (
      <button
        className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleCopy(payload, which, promptObj)}
        disabled={!payload}
      >
        <Copy className="w-4 h-4" />
        {copiedPrompt === which ? "Copied!" : "Copy"}
      </button>
    );
  };

  // ✅ Prompt block
  const renderPromptBlock = (prompt, which, showState, setShowState) => {
    if (!prompt) return null;
    const isFile = isFileContent(prompt?.content);

    return (
      <div className="bg-[#23232F] p-6 mb-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {prompt?.title && (
              <h3 className="text-base font-medium mb-2">{prompt.title}</h3>
            )}
            {prompt?.subject && (
              <p className="text-cyan-400 text-sm mb-4">
                Subject: {prompt.subject}
              </p>
            )}
            {isFile && (
              <p className="text-xs text-gray-400 break-all">{prompt.content}</p>
            )}
          </div>
          {renderButton(prompt, which)}
        </div>

        {!isFile && (
          <>
            {renderBody(prompt?.content, showState)}
            <button
              onClick={() => {
                setShowState(!showState);
                recordPromptClick(prompt?.packId, prompt?.promptId);
              }}
              className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showState ? "rotate-180" : ""
                }`}
              />
              {showState ? "Show Less" : "Show More"}
            </button>
          </>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={() => {
              setSelectedPrompt({
                packId: prompt?.packId,
                promptId: prompt?.promptId,
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
            Catalyst Brain Type Prompts
          </h1>
          {renderDropdown()}
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">
              No prompts found for Catalyst brain type
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
          Catalyst Brain Type Prompts
        </h1>
        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">
          Email Prompts for Catalyst Types
        </h2>

        {renderPromptBlock(prompt1, 1, showFirstPrompt, setShowFirstPrompt)}
        {renderPromptBlock(prompt2, 2, showFullPrompt, setShowFullPrompt)}
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
