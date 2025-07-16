import { useState } from "react";
import { Upload } from "lucide-react";

export default function PromptPacksCard() {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = () => {
    // handle files
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // handle files
  };

  return (
    <div className="bg-[#232B39] lg:p-6 w-full p-6  mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded flex items-center justify-center mt-1 border border-[#FFD600]">
          <span className="text- text-xl">💡</span>
        </div>
        <div>
          <h2 className="text-white  font-medium text-base">Prompt Packs</h2>
          <p className="text-gray-400 text-xs mt-1">
            AI prompts and template
            <br />
            collections
          </p>
        </div>
      </div>

      {/* Manual Prompt Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-white text-sm">Manual Prompt</span>
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
        />
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-500 bg-[#11182780] rounded-lg p-12 text-center mb-6 ${
          isDragOver ? "ring-2 ring-cyan-400" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-3">Drag & drop files here</p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".txt,.json,.md"
            />
            <span className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition">
              Choose Files
            </span>
          </label>
        </div>
        <p className="text-gray-500 text-xs">Accepts: .txt, .json, .md</p>
      </div>

      {/* Tier Access Control */}
      <div className="">
        <h3 className="text-white text-sm font-medium mb-4">
          Tier Access Control
        </h3>
        <div className="space-y-3">
          {/* Basic Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
            />
            <span className="w-5 h-5 flex items-center justify-center text-gray-400">
              ★
            </span>
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Basic</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  1250 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Free tier users</div>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
            />
            <span className="w-4 h-4 flex items-center justify-center text-blue-400">
              &#x1F451;
            </span>
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Premium</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  320 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Paid subscribers</div>
            </div>
          </div>

          {/* VIP Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
            />
            <span className="w-4 h-4 flex items-center justify-center text-purple-400">
              &#x1F48E;
            </span>
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">VIP</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  45 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Exclusive access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button className="w-full bg-cyan-400 text-[#232432] font-medium py-3 rounded hover:bg-cyan-300 transition-colors text-sm mt-5">
        Upload Prompt Packs
      </button>
    </div>
  );
}
