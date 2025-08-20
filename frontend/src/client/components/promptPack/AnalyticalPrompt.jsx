import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Copy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPromptPacks,
  selectPromptPacks,
  selectPromptPackLoading,
} from "../../../store/Slice/PromptPacksSlice";

export default function AnalyticalPrompt({ categories = [] }) {
  const dispatch = useDispatch();
  const allPacks = useSelector(selectPromptPacks);
  const loading = useSelector(selectPromptPackLoading);

  // local category filter (dropdown)
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!allPacks || allPacks.length === 0) {
      dispatch(fetchPromptPacks({})); // no extra UI, just load
    }
  }, [dispatch]); // intentionally not depending on allPacks to avoid re-fetch noise

  // UI state (kept exactly as your original)
  const [showFirstPrompt, setShowFirstPrompt] = useState(true);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(0);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [emailTooltipPos, setEmailTooltipPos] = useState({ x: 0, y: 0 });

  // originals (kept)
  const fallbackFirst = `Hi [Name],

I analyzed the latest industry data and found 3 insights that could transform your approach:
1. [Specific statistic with source]
2. [Trend analysis with numbers]
3. [Actionable recommendation based on data]

Want the full breakdown? Click here to access the complete analysis.

Best,
[Your Name]`;

  const fallbackSecond = `Hi [Name],

I've identified a specific challenge that [industry/target audience] faces:
Problem: [Clear problem statement with data/evidence]
Analysis: Based on [research/data source], this problem occurs because:
• [Root cause 1 with supporting data]
• [Root cause 2 with supporting data]
• [Root cause 3 with supporting data]
Solution: I've developed a methodology that addresses each root cause:
1. [Solution step 1 with measurable outcome]
2. [Solution step 2 with measurable outcome]
3. [Solution step 3 with measurable outcome]
Results: Companies using this approach have seen [specific metrics and improvements].
Want to see how this applies to your specific situation? Let's schedule a brief analysis call.

Best,
[Your Name]`;

  // --- helpers
  const isFileContent = (s) =>
    typeof s === "string" &&
    (/^https?:\/\//i.test(s) || /\.(pdf|docx?|txt)$/i.test(s));

  const openInNewTab = (url) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // Handle error
      console.error("Failed to open URL:", url);
    }
  };

  // Filter packs by selected category (if any) and map prompts of type "Architect"
  const promptsForArchitect = useMemo(() => {
    const packs = (allPacks || []).filter((p) =>
      selectedCategory ? p.category === selectedCategory : true
    );
    const flat = [];
    packs.forEach((p) => {
      (p.prompts || []).forEach((pr) => {
        if (pr.type === "Architect") {
          flat.push({
            packId: p._id,
            content: pr.content,
            fileUrl: p.fileUrl, // pack-level file also supported by your API
            promptId: pr._id,
          });
        }
      });
    });
    return flat;
  }, [allPacks, selectedCategory]);

  // pick first two prompts (if any) to feed the two cards
  const prompt1 = promptsForArchitect[0] || null;
  const prompt2 = promptsForArchitect[1] || null;

  // button actions (copy or view)
  const handleCopy = (text, which) => {
    navigator.clipboard.writeText(text || "");
    setCopiedPrompt(which);
    setTimeout(() => setCopiedPrompt(0), 1200);
  };

  // dropdown (kept same style, options replaced with categories + empty = all)
  const renderDropdown = () => (
    <div className="relative mb-8">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full bg-[#16161C] text-white px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
      >
        <option value="">Architect dropdown</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );

  // body content renderer: if manual => show text; if file => show nothing extra (keep design), user clicks View
  const renderBody = (promptText, fallback) => {
    const useFallback = !promptText || isFileContent(promptText);
    const textToShow = useFallback ? fallback : promptText;

    return (
      <div className="text-sm text-gray-300 space-y-3">
        {/* keep your original paragraphs, but swap the core block with prompt content if manual */}
        <pre className="whitespace-pre-wrap font-sans">{textToShow}</pre>
      </div>
    );
  };

  // button renderer: Copy for manual, View for file
  const renderButton = (promptObj, which, fallbackText) => {
    // prioritize prompt.content; else pack.fileUrl
    const payload = promptObj?.content || promptObj?.fileUrl;
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
    // manual (copy)
    return (
      <button
        className="border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
        onClick={() => handleCopy(payload || fallbackText, which)}
      >
        <Copy className="w-4 h-4" />
        {copiedPrompt === which ? "Copied!" : "Copy"}
      </button>
    );
  };

  return (
    <div className=" bg-[#303041] text-white mt-10">
      <div className="p-2 lg:p-8">
        <h1 className="text-xl font-medium mb-6">Architect Brain Type Prompts</h1>

        {renderDropdown()}

        <h2 className="text-lg font-medium mb-6">
          Email Prompts for Architect Types {loading ? "(loading...)" : ""}
        </h2>

        {/* Card 1 */}
        <div
          className="bg-[#23232F] p-6 mb-4 relative"
          onMouseEnter={() => setShowEmailTooltip(true)}
          onMouseLeave={() => setShowEmailTooltip(false)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setEmailTooltipPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        >
          {showEmailTooltip && (
            <div
              className="pointer-events-none bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap"
              style={{
                position: "absolute",
                left: emailTooltipPos.x + 10,
                top: emailTooltipPos.y + 10,
                minWidth: "max-content",
                maxWidth: 180,
              }}
            >
              This section generates a social media caption email prompt for Analytical types.
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">Social Media Caption Generator</h3>
              <p className="text-cyan-400 text-sm mb-4">
                Subject: The numbers don't lie - here's what your data reveals
              </p>
            </div>

            {renderButton(prompt1, 1, fallbackFirst)}
          </div>

          {showFirstPrompt && renderBody(prompt1?.content, fallbackFirst)}

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

        {/* Card 2 */}
        <div className="bg-[#23232F] p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">Problem-Solution Framework</h3>
              <p className="text-cyan-400 text-sm mb-4">
                Subject: Solving [specific problem] with proven methodology...
              </p>
            </div>
            {renderButton(prompt2, 2, fallbackSecond)}
          </div>

          {showFullPrompt && (
            <div className="mt-4 text-sm text-gray-300 space-y-3">
              {renderBody(prompt2?.content, fallbackSecond)}
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
