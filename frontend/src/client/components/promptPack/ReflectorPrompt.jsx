import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";
import axiosInstance from "../../../store/axiosInstance";
export default function ReflectorPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [expanded, setExpanded] = useState({});

  // ✅ Safe runner for API calls
  const runCare = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      console.error("API Error:", err);
      return null;
    }
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

  // ✅ API call to record click
  const recordPromptClick = async (packId, promptId) => {
    if (!packId || !promptId) return;
    await runCare(() =>
      axiosInstance.post(`/api/prompt-packs/${packId}/prompts/${promptId}/click`)
    );
  };

  // Filter prompts by category
  const promptsForReflector = useMemo(() => {
    const reflectorPrompts = groupedPrompts.Reflector || [];
    return selectedCategory
      ? reflectorPrompts.filter((p) => p.category === selectedCategory)
      : reflectorPrompts;
  }, [groupedPrompts.Reflector, selectedCategory]);

  // Compute categories
  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    const set = new Set();
    (groupedPrompts.Reflector || []).forEach(
      (p) => p.category && set.add(p.category)
    );
    return Array.from(set);
  }, [categories, groupedPrompts.Reflector]);

  // ✅ Copy button handler
  const handleCopy = (text, index) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(index);
    setTimeout(() => setCopiedPrompt(null), 1500);
  };

  // ✅ Truncate helper
  const truncateText = (text, wordLimit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Render dropdown filter
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

  // ✅ Body with expand/collapse
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
  const renderButton = (promptObj, index) => {
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
        className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
        onClick={() => {
          handleCopy(payload, index);
          recordPromptClick(promptObj?.packId, promptObj?.promptId);
        }}
        disabled={!payload}
      >
        <Copy className="w-4 h-4" />
        {copiedPrompt === index ? "Copied!" : "Copy"}
      </button>
    );
  };

  // ✅ Full Prompt block
  const renderPromptBlock = (prompt, index) => {
    if (!prompt || (!prompt.content && !prompt.fileUrl)) return null;
    const isFile = isFileContent(prompt?.content);

    return (
      <div key={index} className="bg-[#23232F] p-6 mb-6">
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
          {renderButton(prompt, index)}
        </div>

        {!isFile && (
          <>
            {renderBody(prompt?.content, expanded[index])}
            <button
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
              }
              className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expanded[index] ? "rotate-180" : ""
                }`}
              />
              {expanded[index] ? "Show Less" : "View Full Prompt"}
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

  // ✅ Empty state
  if (!promptsForReflector.length) {
    return (
      <div className="bg-[#303041] text-white mt-10">
        <div className="p-2 lg:p-8">
          <h1 className="text-xl font-medium mb-6">
            Reflector Brain Type Prompts
          </h1>
          {renderDropdown()}
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">
              No prompts found for Reflector brain type
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Final UI
  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">
          Reflector Brain Type Prompts
        </h1>
        {renderDropdown()}
        <h2 className="text-lg font-medium mb-6">
          Email Prompts for Reflector Types
        </h2>

        {promptsForReflector.map((p, i) => renderPromptBlock(p, i))}
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
