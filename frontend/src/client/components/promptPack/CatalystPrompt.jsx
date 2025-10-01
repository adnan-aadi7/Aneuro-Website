import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";
import axiosInstance from "../../../store/axiosInstance";

export default function CatalystPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [expandedPromptId, setExpandedPromptId] = useState(null);

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

  // ✅ Check if payload is a file
  const isFileContent = (s) =>
    typeof s === "string" &&
    (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));

  // ✅ Open files in Google Docs Viewer (restricts download)
  const openInNewTab = (url) => {
    try {
      const gviewUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        url
      )}`;
      window.open(gviewUrl, "_blank", "noopener,noreferrer");
    } catch {
      /* noop */
    }
  };

  // ✅ Filtered prompts
  const promptsForCatalyst = useMemo(() => {
    const catalystPrompts = groupedPrompts.Catalyst || [];
    return selectedCategory
      ? catalystPrompts.filter((p) => p.category === selectedCategory)
      : catalystPrompts;
  }, [groupedPrompts.Catalyst, selectedCategory]);

  // ✅ Available categories
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

  // ✅ Body renderer
  const renderBody = (text, expanded) => {
    if (!text || isFileContent(text)) return null;
    const displayText = expanded ? text : truncateText(text, 40);
    return (
      <div className="text-sm text-gray-300 space-y-3">
        <pre className="whitespace-pre-wrap font-sans">{displayText}</pre>
      </div>
    );
  };

  // ✅ Prompt card
  const renderPromptBlock = (prompt, idx) => {
    if (!prompt) return null;
    const payload = prompt?.content || prompt?.fileUrl;
    const isFile = isFileContent(payload);
    const expanded = expandedPromptId === prompt.promptId;

    return (
      <div key={prompt?.promptId} className="bg-[#23232F] p-6 mb-4 relative">
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
              <p
                onClick={() => {
                  openInNewTab(payload);
                  recordPromptClick(prompt?.packId, prompt?.promptId);
                }}
                className="text-xs text-gray-400 break-all underline cursor-pointer "
              >
                {payload}
              </p>
            )}
          </div>

          {/* Action buttons */}
          {isFile ? (
            <button
              className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
              onClick={() => {
                openInNewTab(payload);
                recordPromptClick(prompt?.packId, prompt?.promptId);
              }}
            >
              View
            </button>
          ) : (
            <button
              className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
              onClick={() => handleCopy(payload, idx + 1, prompt)}
              disabled={!payload}
            >
              <Copy className="w-4 h-4" />
              {copiedPrompt === idx + 1 ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {/* Show text body with expand/collapse */}
        {!isFile && (
          <>
            {renderBody(prompt?.content, expanded)}
            <button
              onClick={() => {
                setExpandedPromptId(expanded ? null : prompt.promptId);
                recordPromptClick(prompt?.packId, prompt?.promptId);
              }}
              className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
              {expanded ? "Show Less" : "Show More"}
            </button>
          </>
        )}

        {/* Rating */}
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

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">
          Catalyst Brain Type Prompts
        </h1>

        {/* Category filter */}
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

        <h2 className="text-lg font-medium mb-6">
          Email Prompts for Catalyst Types
        </h2>

        {promptsForCatalyst.length === 0 ? (
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">
              No prompts found for Catalyst brain type
            </p>
          </div>
        ) : (
          promptsForCatalyst.map((prompt, idx) =>
            renderPromptBlock(prompt, idx)
          )
        )}
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
