import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";
import axiosInstance from "../../../store/axiosInstance";

export default function SynthesizerPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [expandedPromptId, setExpandedPromptId] = useState(null);

  // 🔹 API: record click
  const recordPromptClick = async (packId, promptId) => {
    try {
      await axiosInstance.post(`/prompt-packs/${packId}/prompts/${promptId}/click`);
    } catch (error) {
      console.error("Failed to record prompt click:", error);
    }
  };

  // 🔹 Detect if content is a file
  const isFileContent = (s) =>
    typeof s === "string" &&
    (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));

  // 🔹 Open in new tab (PDF, DOCX, TXT)
  const openInNewTab = (url, packId, promptId) => {
    try {
      const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
      window.open(viewerUrl, "_blank", "noopener,noreferrer");
      recordPromptClick(packId, promptId);
    } catch {
      /* noop */
    }
  };

  // 🔹 Get prompts
  const promptsForSynthesizer = useMemo(() => {
    const synthesizerPrompts = groupedPrompts.Synthesizer || [];
    return selectedCategory
      ? synthesizerPrompts.filter((p) => p.category === selectedCategory)
      : synthesizerPrompts;
  }, [groupedPrompts.Synthesizer, selectedCategory]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) return categories;
    const set = new Set();
    (groupedPrompts.Synthesizer || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [categories, groupedPrompts.Synthesizer]);

  // 🔹 Copy with API call
  const handleCopy = (text, which, packId, promptId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    recordPromptClick(packId, promptId);
    setTimeout(() => setCopiedPrompt(0), 1500);
  };

  // 🔹 Truncate
  const truncateText = (text, wordLimit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // 🔹 Render body
  const renderBody = (text, expanded) => {
    if (!text || isFileContent(text)) return null;
    const displayText = expanded ? text : truncateText(text, 40);
    return (
      <div className="text-sm text-gray-300 space-y-3">
        <pre className="whitespace-pre-wrap font-sans">{displayText}</pre>
      </div>
    );
  };

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">Synthesizer Brain Type Prompts</h1>

        {/* Dropdown filter */}
        <div className="relative mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none border border-gray-700"
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

        <h2 className="text-lg font-medium mb-6">Email Prompts for Synthesizer Types</h2>

        {promptsForSynthesizer.length === 0 && (
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">No prompts found</p>
          </div>
        )}

        {promptsForSynthesizer.map((promptObj, idx) => {
          const payload = promptObj?.content || promptObj?.fileUrl;
          const isFile = isFileContent(payload);
          const expanded = expandedPromptId === promptObj.promptId;

          return (
            <div key={promptObj?.promptId} className="bg-[#23232F] p-6 mb-4 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {promptObj?.title && (
                    <h3 className="text-base font-medium mb-2">{promptObj.title}</h3>
                  )}
                  {promptObj?.subject && (
                    <p className="text-sm mb-4">Subject: {promptObj.subject}</p>
                  )}
                </div>

                {/* Action button */}
                {/* Action button */}
{isFile ? (
  <button
    className="border border-[#12DCF080] cursor-pointer text-[#12DCF0] px-3 py-1 rounded text-sm font-medium hover:bg-[#23232F]"
    onClick={() => openInNewTab(payload, promptObj?.packId, promptObj?.promptId)}
  >
    View
  </button>
) : (
  <button
    className="border border-[#12DCF080] cursor-pointer text-[#12DCF0] px-3 py-1 rounded text-sm font-medium hover:bg-[#23232F]"
    onClick={() => handleCopy(payload, idx + 1, promptObj?.packId, promptObj?.promptId)}
  >
    <Copy className="w-4 h-4" />
    {copiedPrompt === idx + 1 ? "Copied!" : "Copy"}
  </button>
)}

              </div>

              {/* File preview link */}
              {isFile ? (
                <p className="text-sm text-gray-400 break-all underline">
                  <a
                    href={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(payload)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordPromptClick(promptObj?.packId, promptObj?.promptId)}
                  >
                    {payload}
                  </a>
                </p>
              ) : (
                <>
                  {renderBody(promptObj?.content, expanded)}
                  <button
                    onClick={() => {
                      setExpandedPromptId(expanded ? null : promptObj.promptId);
                      recordPromptClick(promptObj?.packId, promptObj?.promptId);
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

              <div className="mt-6 text-right">
                <button
                  onClick={() => {
                    setSelectedPrompt({
                      packId: promptObj?.packId,
                      promptId: promptObj?.promptId,
                    });
                    setIsModalOpen(true);
                  }}
                  className="text-cyan-300 underline font-medium cursor-pointer"
                >
                  Rate this tool
                </button>
              </div>
            </div>
          );
        })}
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
