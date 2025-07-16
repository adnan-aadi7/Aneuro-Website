import React from "react";
import { Sparkles } from "lucide-react";

const prompts = [
  {
    id: 1,
    title: "Blog Post Creator",
    subtitle:
      "Create engaging blog posts that convert readers into customers...",
    expanded: true,
    prompt: "Lead with bold ideas — not what’s safe, but what’s next”.",
  },
  {
    id: 2,
    title: "Social Media Caption Generator",
    subtitle:
      "Generate compelling social media captions that drive engagement...",
    expanded: false,
    prompt: null,
  },
];

const PromptPreview = () => {
  return (
    <div className="w-full bg-[#303041] mx-auto p-6 mt-5">
      <div className="text-lg text-white mb-3">Prompt Preview</div>
      {prompts.map((item) => (
        <div
          key={item.id}
          className={`bg-[#232334] border border-[#353545] rounded mb-6 ${
            item.expanded ? "pb-10" : "pb-2"
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-6">
            <div>
              <div className="text-base text-white font-semibold">
                {item.title}
              </div>
              <div className="text-sm text-cyan-400 leading-tight mt-1">
                {item.subtitle}
              </div>
            </div>
            <button className="border border-cyan-400 text-white text-xs px-5 py-1 rounded hover:bg-cyan-900 transition ml-4">
              View Full Prompt
            </button>
          </div>
          {item.expanded && (
            <div className="px-10 mt-8 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-7 h-7 text-cyan-400" />
                <span className="text-white font-bold text-xl">Prompt</span>
              </div>
              <div
                className="bg-gradient-to-br from-cyan-700/40 to-transparent rounded-lg px-8 py-6 mt-2 shadow-lg border border-cyan-900/30 text-white text-lg font-medium max-w-xl w-full"
                style={{
                  boxShadow: "0 2px 5px 0 #00bcd41a",
                }}
              >
                “{item.prompt}”
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center mt-8">
        <button className="border border-cyan-400 text-white text-xs px-8 py-2 rounded hover:bg-cyan-900 transition">
          View All 50 Prompts
        </button>
      </div>
    </div>
  );
};

export default PromptPreview;
