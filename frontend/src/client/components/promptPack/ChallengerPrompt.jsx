import React, { useState, useMemo } from "react";
import { ChevronDown, Copy } from "lucide-react";
import Popup from "./modal";
import axiosInstance from "../../../store/axiosInstance";

export default function ChallengerPrompt({ groupedPrompts = {}, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFirstPrompt, setShowFirstPrompt] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // 🔹 API helper
  const recordPromptClick = async (packId, promptId) => {
    try {
      await axiosInstance.post(`/prompt-packs/${packId}/prompts/${promptId}/click`);
    } catch (error) {
      console.error("Failed to record prompt click:", error);
    }
  };

  // 🔹 Detect if content is a file
  const isFileContent = (s) =>
    typeof s === "string" && (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));

  // 🔹 Open file in Google Viewer (no download)
  const openInNewTab = (url, packId, promptId) => {
    try {
      const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
      window.open(viewerUrl, "_blank", "noopener,noreferrer");
      recordPromptClick(packId, promptId);
    } catch {
      /* noop */
    }
  };

  const promptsForChallenger = useMemo(() => {
    const challengerPrompts = groupedPrompts.Challenger || [];
    return selectedCategory
      ? challengerPrompts.filter((p) => p.category === selectedCategory)
      : challengerPrompts;
  }, [groupedPrompts.Challenger, selectedCategory]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    const set = new Set();
    (groupedPrompts.Challenger || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [categories, groupedPrompts.Challenger]);

  const hasPayload = (p) => !!(p && (p.content || p.fileUrl));

  // 🔹 Copy with API call
  const handleCopy = (text, which, packId, promptId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(which);
    recordPromptClick(packId, promptId);
    setTimeout(() => setCopiedPrompt(0), 1500);
  };

  const truncateText = (text, wordLimit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const renderBody = (text, expanded) => {
    if (!text || isFileContent(text)) return null;
    const displayText = expanded ? text : truncateText(text, 40);
    return (
      <div className="text-sm text-gray-300 space-y-3">
        <pre className="whitespace-pre-wrap font-sans">{displayText}</pre>
      </div>
    );
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

  const renderButton = (promptObj, which) => {
    const payload = promptObj?.content || promptObj?.fileUrl;
    if (!payload) return null;
    const isFile = isFileContent(payload);

    if (isFile) {
      return (
        <button
          className="border cursor-pointer border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
          onClick={() =>  openInNewTab(promptObj.content, promptObj?.packId, promptObj?.promptId)}
        >
          View
        </button>
      );
    }
    return (
      <button
        className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
        onClick={() => handleCopy(payload, which, promptObj?.packId, promptObj?.promptId)}
      >
        <Copy className="w-4 h-4" />
        {copiedPrompt === which ? "Copied!" : "Copy"}
      </button>
    );
  };

  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">Challenger Brain Type Prompts</h1>
        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">Email Prompts for Challenger Types</h2>

        {promptsForChallenger.map(
          (promptObj, idx) =>
            hasPayload(promptObj) && (
              <div key={promptObj?.promptId} className="bg-[#23232F] p-6 mb-4 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {promptObj?.title && (
                      <h3 className="text-base font-medium mb-2">{promptObj.title}</h3>
                    )}
                    {promptObj?.subject && (
                      <p className="text-cyan-400 text-sm mb-4">Subject: {promptObj.subject}</p>
                    )}
                  </div>
                  {renderButton(promptObj, idx + 1)}
                </div>

                {isFileContent(promptObj?.content) && (
                  <div className="mb-4 text-sm cursor-pointer">
                    <button
                      onClick={() =>
                        openInNewTab(promptObj.content, promptObj?.packId, promptObj?.promptId)
                      }
                      className="text-gray-400 underline"
                    >
                      {promptObj.content}
                    </button>
                  </div>
                )}

                {!isFileContent(promptObj?.content) &&
                  renderBody(promptObj?.content, idx === 0 ? showFirstPrompt : showFullPrompt)}

                {!isFileContent(promptObj?.content) && (
                  <button
                    onClick={() => {
                      idx === 0
                        ? setShowFirstPrompt(!showFirstPrompt)
                        : setShowFullPrompt(!showFullPrompt);
                      recordPromptClick(promptObj?.packId, promptObj?.promptId);
                    }}
                    className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-300"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        (idx === 0 ? showFirstPrompt : showFullPrompt) ? "rotate-180" : ""
                      }`}
                    />
                    {(idx === 0 ? showFirstPrompt : showFullPrompt)
                      ? "Show Less"
                      : "View More"}
                  </button>
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
                    className="text-cyan-300 underline rounded font-medium cursor-pointer"
                  >
                    Rate this tool
                  </button>
                </div>
              </div>
            )
        )}
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
