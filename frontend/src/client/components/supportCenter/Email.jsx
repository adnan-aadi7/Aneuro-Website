import React from "react";

const Email = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return <div className="text-gray-400 text-center">No tickets found.</div>;
  }
  return (
    <div>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="max-w-full mx-auto mt-8 p-15 rounded bg-[#232432] relative"
          style={{ boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset" }}
        >
          {/* User Info */}
          <div className="flex items-center mb-2">
            {ticket.profileImage ? (
              <img
                src={ticket.profileImage}
                alt={ticket.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-500 mr-3"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold mr-3">
                {ticket.name?.[0] || "U"}
              </div>
            )}
            <div>
              <div className="text-white font-medium leading-tight">
                {ticket.name}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          {/* Subject (use first category or fallback) */}
          <div className="mt-4 mb-2">
            <span className="font-semibold text-white text-sm">
              {Array.isArray(ticket.category) && ticket.category.length > 0
                ? ticket.category[0]
                : "Support Ticket"}
            </span>
          </div>
          {/* Message Body */}
          <div className="text-gray-200 text-sm mb-4 mt-5">
            <p className="mb-4">Hi Aneuro Support Team,</p>
            <p className="mb-4">
              {ticket.message}
              <br />
              {ticket.category && ticket.category.length > 1 && (
                <>
                  <span className="text-xs text-cyan-400">Categories: {ticket.category.join(", ")}</span>
                  <br />
                </>
              )}
              Looking Forward To Your Assistance.
            </p>
            <p className="mb-2">
              Best Regards,
              <br />
              {ticket.name}
            </p>
          </div>
          {/* Attachment */}
          {ticket.fileUrl && (
            <div className="flex items-center border border-cyan-400 rounded-md px-3 mt-5 w-fit bg-[#232432] shadow-inner">
              <div className="flex items-center mr-3">
                <div className="bg-red-600 rounded p-1 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#EF4444" />
                    <text x="6" y="17" fill="white" fontSize="10" fontWeight="bold">
                      FILE
                    </text>
                  </svg>
                </div>
                <div className="ml-2">
                  <div className="text-white text-sm font-medium">
                    {ticket.fileUrl.split("/").pop()}
                  </div>
                  {/* File size not available unless you store it */}
                </div>
              </div>
              <a
                href={ticket.fileUrl}
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
          )}
        </div>
      ))}
    </div>
  );
};

export default Email;
