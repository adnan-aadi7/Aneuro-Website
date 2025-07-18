import React from "react";
import { ChevronDown } from "lucide-react";

export default function AnalyticalBrainEmail() {
  return (
    <div className="min-h-screen bg-[#303041] text-white">
      {/* Header */}
      <div className="lg:p-6 p-2">
        <h1 className="text-2xl font-semibold mb-6">Analytical Brain Type</h1>

        {/* Dropdown */}
        <div className="relative">
          <select className="w-full bg-[#16161C] text-[#B0B0B0] px-4 py-3 appearance-none cursor-pointer focus:outline-none border border-[#444]">
            <option className="text-[#B0B0B0]">Select a prompt category</option>
            <option className="text-[#B0B0B0]">Email Templates</option>
            <option className="text-[#B0B0B0]">Training Materials</option>
            <option className="text-[#B0B0B0]">Communication Guides</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#B0B0B0] pointer-events-none" />
        </div>
      </div>

      {/* Email Templates Section */}
      <div className="lg:p-6 p-2">
        <h2 className="text-xl font-semibold mb-6">Email Templates</h2>

        {/* Email Template 1 */}
        <div className="bg-[#23232A] p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base font-semibold mb-2">
                Email 1:{" "}
                <span
                  className="inline w-5 h-5  align-middle"
                  role="img"
                  aria-label="lock"
                >
                  🔐
                </span>
                <span className="bg-[#23232F]">
                  Welcome to Your Enterprise Training Access
                </span>
              </h3>
              <p className="text-[#12DCF0] text-sm">
                Welcome to the Sales Mastery Course! This is the beginning of
                your journey...
              </p>
            </div>
            <button className="border border-[#12DCF080] text-[#B0B0B0] px-4 py-2 text-xs font-medium transition-colors hover:bg-[#292933]">
              View Full Email
            </button>
          </div>

          <div className="bg-transparent rounded-lg p-4">
            <p className="text-sm text-[#B0B0B0] mb-4">Hi Luan,</p>

            <p className="text-sm text-[#B0B0B0] mb-4">
              Welcome to your tailored Aneuro Training Hub, designed with your
              Reflector Brain Type in mind. Reflectors excel at careful analysis
              and thoughtful decision-making. To support you, we've prepared
              resources that help you understand your audience deeply and engage
              them meaningfully.
            </p>

            <p className="text-sm text-[#B0B0B0] mb-2">
              Here's what you'll find in your dashboard:
            </p>

            <ul className="text-sm text-[#B0B0B0] mb-4 space-y-1">
              <li>
                • Detailed Training Modules: Learn at your own pace with
                structured, comprehensive lessons
              </li>
              <li>
                • Reflective Exercises: Activities designed to refine your
                analytical and strategic thinking
              </li>
              <li>
                • Prompt Packs: Use pre-crafted messages designed for authentic,
                reflective communication
              </li>
              <li>
                • We're committed to making your experience insightful and
                effective. If you have any questions, our team is ready to
                assist
              </li>
            </ul>

            <div className="text-sm text-[#B0B0B0]">
              <p>Best regards,</p>
              <p>The Aneuro Team</p>
            </div>
          </div>
        </div>

        {/* Email Template 2 */}
        <div className="bg-[#23232A]  p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base font-semibold mb-2">
                Email 1: Welcome & Introduction
              </h3>
              <p className="text-[#12DCF0] text-sm">
                Welcome to the Sales Mastery Course! This is the beginning of
                your journey...
              </p>
            </div>
            <button className="border border-[#12DCF080] text-[#B0B0B0] px-4 py-2 text-xs font-medium transition-colors hover:bg-[#292933]">
              View Full Email
            </button>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="bg-[#23232A] border border-[#12DCF080] text-[#B0B0B0] px-6 py-3 text-xs font-medium transition-colors hover:bg-[#292933]">
            View All 12 Emails
          </button>
        </div>
      </div>
    </div>
  );
}
