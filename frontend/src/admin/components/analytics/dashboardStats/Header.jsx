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
      <div className=" px-4 py-4">
        <h1 className="text-white text-3xl font-semibold mb-1">
          Analytics Overview
        </h1>
        <p className="text-gray-400 text-base mt-3">
          Manage all content drops and user access
        </p>
      </div>
      {/* Custom Sales Links Section */}
      <div className="p-5">
        <div className="mt-8 bg-[#23232F] p-3 ">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Custom Trackable Sales Links
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter link label (e.g., John Q1 Campaign)"
              className="flex-1 px-4 py-2  bg-[#16161C] text-white border border-gray-700 focus:outline-none"
            />
            <button
              onClick={handleGenerateLink}
              className="bg-cyan-400 text-black px-6 py-2 font-semibold hover:bg-cyan-300 transition-colors"
            >
              Generate Link
            </button>
          </div>
          <div>
            {links.length === 0 ? (
              <p className="text-gray-400">No links generated yet.</p>
            ) : (
              <ul className="space-y-3">
                {links.map((link, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 bg-[#16161C] px-4 py-2 rounded"
                  >
                    <span className="flex-1 text-white font-medium">
                      {link.label}
                    </span>
                    <span className="flex-1 text-cyan-300 text-xs truncate">
                      {link.url}
                    </span>
                    <button
                      onClick={() => handleCopy(link.url, idx)}
                      className="ml-2 px-3 py-1 bg-cyan-400 text-black rounded text-xs font-semibold hover:bg-cyan-300"
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
