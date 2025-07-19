import React, { useState } from "react";

const Header = () => {
  // Custom Sales Links state
  const [links, setLinks] = useState([]);
  const [label, setLabel] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Generate a random token for the link
  const generateToken = () => Math.random().toString(36).substr(2, 8);

  // Handle link creation
  const handleGenerateLink = () => {
    if (!label.trim()) return;
    const token = generateToken();
    setLinks([
      ...links,
      { label, url: `https://yourapp.com/signup?ref=${token}` },
    ]);
    setLabel("");
  };

  // Handle copy
  const handleCopy = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <>
      <div className="px-2 py-3 sm:px-4 sm:py-4">
        <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-1">
          Analytics Overview
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-2 sm:mt-3">
          Manage all content drops and user access
        </p>
      </div>
      {/* Custom Sales Links Section */}
      <div className="p-2 sm:p-5">
        <div className="mt-6 sm:mt-8 bg-[#23232F] p-2 sm:p-3 ">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
            Custom Trackable Sales Links
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter link label (e.g., John Q1 Campaign)"
              className="flex-1 px-3 py-2 sm:px-4 bg-[#16161C] text-white border border-gray-700 focus:outline-none text-sm sm:text-base"
            />
            <button
              onClick={handleGenerateLink}
              className="bg-cyan-400 text-black px-4 sm:px-6 py-2 font-semibold hover:bg-cyan-300 transition-colors text-sm sm:text-base "
            >
              Generate Link
            </button>
          </div>
          <div className="overflow-x-auto">
            {links.length === 0 ? (
              <p className="text-gray-400 text-sm">No links generated yet.</p>
            ) : (
              <ul className="space-y-2 sm:space-y-3 min-w-[300px]">
                {links.map((link, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[#16161C] px-3 sm:px-4 py-2 rounded"
                  >
                    <span className="flex-1 text-white font-medium text-sm sm:text-base">
                      {link.label}
                    </span>
                    <span className="flex-1 text-cyan-300 text-xs truncate">
                      {link.url}
                    </span>
                    <button
                      onClick={() => handleCopy(link.url, idx)}
                      className="ml-0 sm:ml-2 px-3 py-1 bg-cyan-400 text-black rounded text-xs font-semibold hover:bg-cyan-300"
                    >
                      {copiedIndex === idx ? "Copied!" : "Copy"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
