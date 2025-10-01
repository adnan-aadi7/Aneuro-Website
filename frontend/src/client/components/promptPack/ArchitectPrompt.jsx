import React, { useMemo, useState } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";
import axiosInstance from "../../../store/axiosInstance";

export default function ArchitectPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [expandedPromptIds, setExpandedPromptIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // 🔹 API helper to record clicks
  const recordPromptClick = async (packId, promptId) => {
    try {
      await axiosInstance.post(`/prompt-packs/${packId}/prompts/${promptId}/click`);
    } catch (error) {
      console.error("Failed to record prompt click:", error);
    }
  };

  const isFileContent = (s) =>
    typeof s === "string" &&
    (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));

  const promptsForArchitect = useMemo(() => {
    const architectPrompts = groupedPrompts.Architect || [];
    return selectedCategory
      ? architectPrompts.filter((p) => p.category === selectedCategory)
      : architectPrompts;
  }, [groupedPrompts.Architect, selectedCategory]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) return categories;
    const set = new Set();
    (groupedPrompts.Architect || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [categories, groupedPrompts.Architect]);

  // 🔹 Copy with API call
  const handleCopy = (text, id, packId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    recordPromptClick(packId, id);
    setTimeout(() => setCopiedPrompt(0), 1200);
  };

  // 🔹 Toggle expand with API call
  const toggleExpand = (id, packId) => {
    setExpandedPromptIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    recordPromptClick(packId, id);
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

  const renderButton = (prompt) => {
    const payload = prompt?.content;
    if (!payload) return null;
    if (isFileContent(payload)) {
      return (
        <button
          className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-[#23232F]"
          onClick={() => {
            const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              payload
            )}`;
            window.open(viewerUrl, "_blank", "noopener,noreferrer");
            recordPromptClick(prompt.packId, prompt.promptId);
          }}
        >
          View File
        </button>
      );
    }
    return (
      <button
        className="flex flex-row gap-1 cursor-pointer items-center border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-[#23232F]"
        onClick={() => handleCopy(payload, prompt.promptId, prompt.packId)}
      >
        <Copy className="w-4 h-4" />{" "}
        {copiedPrompt === prompt.promptId ? "Copied!" : "Copy"}
      </button>
    );
  };

  if (!promptsForArchitect.length) {
    return (
      <div className="bg-[#303041] text-white mt-10">
        <div className="p-2 lg:p-8">
          <h1 className="text-xl font-medium mb-6">Architect Brain Type Prompts</h1>
          {renderDropdown()}
          <div className="bg-[#23232F] p-8 text-center">
            <p className="text-gray-400 text-lg">
              No prompts found for Architect brain type
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">Architect Brain Type Prompts</h1>
        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">
          Email Prompts for Architect Types
        </h2>

        {promptsForArchitect.map((prompt) => {
          const isExpanded = expandedPromptIds.includes(prompt.promptId);
          const isFile = isFileContent(prompt.content);
          return (
            <div key={prompt.promptId} className="bg-[#23232F] p-6 mb-4 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {prompt.title && <h3 className="text-base font-medium mb-2">{prompt.title}</h3>}
                  {prompt.subject && (
                    <p className="text-cyan-400 text-sm mb-4">Subject: {prompt.subject}</p>
                  )}
                </div>
                {renderButton(prompt)}
              </div>

              {isFile ? (
                <div className="mb-4 text-sm">
                  {/* File link itself, opens viewer in new tab */}
                  <a
                    href={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                      prompt.content
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 underline break-words "
                    onClick={() => recordPromptClick(prompt.packId, prompt.promptId)}
                  >
                    {prompt.content}
                  </a>
                </div>
              ) : prompt.content ? (
                <div
                  className={`text-sm text-gray-300 space-y-3 transition-all duration-300 ${
                    isExpanded ? "line-clamp-none" : "line-clamp-2"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{prompt.content}</pre>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No content available</p>
              )}

              {!isFile && prompt.content && (
                <button
                  onClick={() => toggleExpand(prompt.promptId, prompt.packId)}
                  className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                  {isExpanded ? "Show Less" : "View Full Prompt"}
                </button>
              )}

              {/* Rate button always visible */}
              <div className="mt-6 text-right">
                <button
                  onClick={() => {
                    setSelectedPrompt({
                      packId: prompt.packId,
                      promptId: prompt.promptId,
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
        })}
      </div>

      {/* Rating Modal */}
      <Popup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packId={selectedPrompt?.packId}
        promptId={selectedPrompt?.promptId}
      />
    </div>
  );
}
