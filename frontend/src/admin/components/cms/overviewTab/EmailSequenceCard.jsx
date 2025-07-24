// import { useState } from "react";
import { Upload, Mail, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";

export default function EmailSequenceCard() {
  const navigate = useNavigate();

  const handleFileUpload = () => {
    // handle files
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // setIsDragOver(true); // This line was removed as per the edit hint
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // setIsDragOver(false); // This line was removed as per the edit hint
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // setIsDragOver(false); // This line was removed as per the edit hint
    // handle files
  };

  const handleTierSelect = () => {
    // handle tier select
  };

  const handleUpload = () => {
    console.log("Upload Email Sequences clicked");
  };

  const handleManualEmailChange = (e) => {
    if (e.target.checked) {
      navigate("/admin/mannual-email");
    }
  };

  return (
    <div className="bg-[#1F2937]  p-6 w-full mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6 ">
        <div className="w-10 h-10  rounded flex items-center justify-center mt-1 border-1 border-[#1E40AF]">
          <Mail className="w-6 h-6" style={{ color: "#12DCF0" }} />
        </div>
        <div>
          <h2 className="text-white font-medium text-base">Email Sequences</h2>
          <p className="text-gray-400 text-sm mt-1">
            Upload email marketing sequences
            <br />& templates
          </p>
        </div>
      </div>

      {/* Manual Email Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-white text-sm">Manual Email</span>
        <input
          type="checkbox"
          id="manual-email-toggle"
          className="w-5 h-5 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
          onChange={handleManualEmailChange}
        />
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-500 bg-[#11182780] rounded-lg p-12 text-center mb-6`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-3">Drag & drop files here</p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".html,.txt,.json"
            />
            <span className="bg-gray-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-500">
              Choose Files
            </span>
          </label>
        </div>
        <p className="text-gray-500 text-xs">Accepts .txt, html and</p>
      </div>

      {/* Tier Access Control */}
      <div className="mb-6">
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
            <img
              src={StarIcon}
              alt="Basic"
              className="w-6 h-6 object-contain"
            />
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
              id="premium"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              onChange={handleTierSelect}
            />
            <img
              src={KingIcon}
              alt="Premium"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Premium</span>
                <span className="text-gray-400 text-sm">330 users</span>
              </div>
              <div className="text-gray-400 text-xs mt-1">Paid subscribers</div>
            </div>
          </div>

          {/* VIP Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="vip"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              onChange={handleTierSelect}
            />
            <img
              src={DiamondIcon}
              alt="VIP"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">VIP</span>
                <span className="text-gray-400 text-sm">45 users</span>
              </div>
              <div className="text-gray-400 text-xs mt-1">Exclusive access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full bg-cyan-400 text-black font-medium py-3  hover:bg-cyan-300 transition-colors text-sm"
      >
        Upload Email Sequences
      </button>
    </div>
  );
}
