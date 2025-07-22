import React, { useState } from "react";

export default function FunnelStructure() {
  // Tooltip state for Lead Magnet Page
  const [showTooltip, setShowTooltip] = useState(false);
  // Tooltip state for Landing Page
  const [showLandingTooltip, setShowLandingTooltip] = useState(false);
  return (
    <div>
      {/* Filter Templates Section */}
      <div className="bg-[#303041]  p-6 mb-6">
        <h2 className="text-white text-2xl font-semibold mb-6">
          Filter Templates
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-[#B0B0B0] text-sm mb-2">
              Brain Type
            </label>
            <select className="w-full bg-[#23232A] text-white px-4 py-3 border border-[#444] focus:outline-none">
              <option>All Brain Types</option>
              <option>Analytical</option>
              <option>Creative</option>
              <option>Reflective</option>
            </select>
          </div>
          <div className="w-full sm:w-64">
            <label className="block text-[#B0B0B0] text-sm mb-2">
              Use Case
            </label>
            <select className="w-full bg-[#23232A] text-white px-4 py-3 border border-[#444] focus:outline-none">
              <option>All Use Cases</option>
              <option>Lead Generation</option>
              <option>Sales</option>
              <option>Onboarding</option>
            </select>
          </div>
        </div>
      </div>

      {/* Funnel Structure Section */}
      <div className="bg-[#303041]  p-6 mt-10">
        <h2 className="text-white text-2xl font-semibold mb-6">
          Funnel Structure
        </h2>
        <div className="space-y-4">
          {/* Landing Page */}
          <div
            className="bg-[#23232A]  mb-2 flex items-center justify-between px-6 py-4 relative"
            onMouseEnter={() => setShowLandingTooltip(true)}
            onMouseLeave={() => setShowLandingTooltip(false)}
          >
            {/* Custom Tooltip for Landing Page */}
            {showLandingTooltip && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-20 whitespace-nowrap pointer-events-none">
                This is the Landing Page block. High-converting landing page
                with compelling headline and CTA.
              </div>
            )}
            <div>
              <div className="text-white text-lg font-semibold">
                Landing Page
              </div>
              <div className="text-[#12DCF0] text-sm mt-1">
                High-converting landing page with compelling headline and CTA
              </div>
            </div>
            <button className="border border-[#12DCF0] text-[#12DCF0] px-3 py-1 text-xs font-medium transition-colors hover:bg-[#23232F] ml-4">
              Copy
            </button>
          </div>
          {/* Lead Magnet Page */}
          {/*
            This block represents the 'Lead Magnet Page' step in the funnel structure.
            - The left section contains the title and a description of the page's purpose.
            - The right section is a 'Copy' button for duplicating or using this template.
            - Styling ensures visual separation and clarity in the funnel steps list.
          */}
          <div
            className="bg-[#23232A]  mb-2 flex items-center justify-between px-6 py-4 mt-5 relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Custom Tooltip */}
            {showTooltip && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-20 whitespace-nowrap pointer-events-none">
                This is the Lead Magnet Page block. Value-packed lead magnet to
                capture visitor information.
              </div>
            )}
            <div>
              {/* Title of the funnel step */}
              <div className="text-white text-lg font-semibold">
                Lead Magnet Page
              </div>
              {/* Description of the funnel step */}
              <div className="text-[#12DCF0] text-sm mt-1">
                Value-packed lead magnet to capture visitor information
              </div>
            </div>
            {/* Copy button for this funnel step */}
            <button className="border border-[#12DCF0] text-[#12DCF0] px-3 py-1 text-xs font-medium transition-colors hover:bg-[#23232F] ml-4">
              Copy
            </button>
            {/* End of Lead Magnet Page block */}
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <button className="border border-[#12DCF0] text-[#12DCF0] px-8 py-2  text-sm font-medium transition-colors hover:bg-[#23232F]">
          View All 5 Pages
        </button>
      </div>
    </div>
  );
}
