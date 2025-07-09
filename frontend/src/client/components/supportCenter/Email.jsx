import React from "react";

const Email = () => {
  return (
    <div>
      {/* First Email */}
      <div
        className="max-w-full mx-auto mt-8 p-15 rounded bg-[#232432] relative"
        style={{
          boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
        }}
      >
        {/* User Info */}
        <div className="flex items-center mb-2">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Devon Lane"
            className="w-8 h-8 rounded-full object-cover border border-gray-500 mr-3"
          />
          <div>
            <div className="text-white font-medium leading-tight">
              Devon Lane
            </div>
            <div className="text-xs text-gray-400">
              20th June, 2025 at 4:00pm
            </div>
          </div>
        </div>
        {/* Subject */}
        <div className="mt-4 mb-2">
          <span className="font-semibold text-white text-sm">
            Issue With My Aneuro Dashboard Access:
          </span>
        </div>
        {/* Message Body */}
        <div className="text-gray-200 text-sm mb-4 mt-5">
          <p className="mb-4">Hi Aneuro Support Team,</p>
          <p className="mb-4">
            I'm Experiencing An Issue With My Dashboard. Whenever I Try To
            Access The "Results Overview" Section, The Page Either Fails To Load
            Or Shows An Error Message.
            <br />
            Could You Please Look Into This? I've Attached A Screenshot For
            Reference.
            <br />
            Looking Forward To Your Assistance.
          </p>
          <p className="mb-2">
            Best Regards,
            <br />
            Alice Roy
          </p>
        </div>
        {/* Attachment */}
        <div className="flex items-center border border-cyan-400 rounded-md px-3 mt-5 w-fit bg-[#232432] shadow-inner">
          <div className="flex items-center mr-3">
            <div className="bg-red-600 rounded p-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#EF4444" />
                <text x="6" y="17" fill="white" fontSize="10" fontWeight="bold">
                  PDF
                </text>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-white text-sm font-medium">Doc.Pdf</div>
              <div className="text-xs text-gray-400">20KB</div>
            </div>
          </div>
          <a
            href="#"
            download
            className="ml-2 p-2 rounded flex items-center justify-center"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            {/* Custom Download Icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <rect width="48" height="48" fill="none" />
                <path
                  d="M24 12v18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M18 24l6 6 6-6"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="16"
                  y="36"
                  width="16"
                  height="3"
                  rx="1.5"
                  fill="white"
                />
              </g>
            </svg>
          </a>
        </div>
      </div>
      {/* Second Email */}
      <div
        className="max-w-full mx-auto mt-8 p-15 rounded bg-[#232432] relative"
        style={{
          boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
        }}
      >
        {/* User Info */}
        <div className="flex items-center mb-2">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Sarah Smith"
            className="w-8 h-8 rounded-full object-cover border border-gray-500 mr-3"
          />
          <div>
            <div className="text-white font-medium leading-tight">
              Sarah Smith
            </div>
            <div className="text-xs text-gray-400">
              21st June, 2025 at 10:30am
            </div>
          </div>
        </div>
        {/* Subject */}
        <div className="mt-4 mb-2">
          <span className="font-semibold text-white text-sm">
            Unable To Download Report:
          </span>
        </div>
        {/* Message Body */}
        <div className="text-gray-200 text-sm mb-4 mt-5">
          <p className="mb-4">Hello Support,</p>
          <p className="mb-4">
            I Am Unable To Download The Monthly Report From The Dashboard. The
            Download Button Appears Disabled.
            <br />
            Please Assist Me In Resolving This Issue.
          </p>
          <p className="mb-2">
            Thank You,
            <br />
            Sarah Smith
          </p>
        </div>
        {/* Attachment */}
        <div className="flex items-center border border-cyan-400 rounded-md px-3 mt-5 w-fit bg-[#232432] shadow-inner">
          <div className="flex items-center mr-3">
            <div className="bg-red-600 rounded p-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#EF4444" />
                <text x="6" y="17" fill="white" fontSize="10" fontWeight="bold">
                  PDF
                </text>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-white text-sm font-medium">Report.pdf</div>
              <div className="text-xs text-gray-400">35KB</div>
            </div>
          </div>
          <a
            href="#"
            download
            className="ml-2 p-2 rounded flex items-center justify-center"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            {/* Custom Download Icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <rect width="48" height="48" fill="none" />
                <path
                  d="M24 12v18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M18 24l6 6 6-6"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="16"
                  y="36"
                  width="16"
                  height="3"
                  rx="1.5"
                  fill="white"
                />
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Email;
