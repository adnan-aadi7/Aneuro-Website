import React, { useState } from "react";

const Email = ({ tickets }) => {
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  if (!tickets || tickets.length === 0) {
    return <div className="text-gray-400 text-center">No tickets found.</div>;
  }

  const handleTicketClick = (ticketId) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  return (
    <div>
      {tickets.map((ticket) => {
        const isExpanded = expandedTicketId === ticket._id;
        return (
          <div key={ticket._id}>
            {/* Ticket Card */}
            <div
              className="max-w-full mx-auto mt-8 p-15 rounded bg-[#232432] relative cursor-pointer hover:bg-[#2a2a3a] transition-colors"
              style={{
                boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
              }}
              onClick={() => handleTicketClick(ticket._id)}
            >
              {/* Header */}
              <div className="flex items-center mb-2">
                {ticket.profileImage ? (
                  <img
                    src={ticket.profileImage}
                    alt={ticket.name}
                    className="w-15 h-15 rounded-full object-cover border border-gray-500 mr-3"
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

                {/* Expand/Collapse Arrow */}
                <div className="ml-auto">
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Category */}
              <div className="mt-4 mb-2">
                <span className="font-semibold text-white text-sm">
                  {Array.isArray(ticket.category) && ticket.category.length > 0
                    ? ticket.category[0]
                    : "Support Ticket"}
                </span>
              </div>

              {/* Message */}
              <div className="text-gray-200 text-sm mb-4 mt-5">
                <p className="mb-4">{ticket.message}</p>
              </div>
            </div>

            {/* Replies Section */}
            {isExpanded && (
              <div className="mt-4">
                {ticket.replies && ticket.replies.length > 0 ? (
                  <div className="space-y-4">
                    {ticket.replies.map((reply, idx) => (
                      <div
                        key={idx}
                        className="max-w-full mx-auto p-15 rounded bg-[#232432] relative"
                        style={{
                          boxShadow:
                            "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
                        }}
                      >
                        {/* Reply Header */}
                        <div className="flex items-center mb-2">
                          <img
                            src="/Avatar.png"
                            alt="Support Team"
                            className="w-15 h-15 rounded-full object-cover border border-gray-500 mr-3"
                          />
                          <div>
                            <div className="text-white font-medium leading-tight">
                          Reply To: <span className="text-gray-300">{ticket.email}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(reply.repliedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Reply Message */}
                        <div className="text-gray-200 text-sm mb-4 mt-5">
                          <p className="mb-4">Hi {ticket.name},</p>
                          <div
                            className="mb-4"
                            dangerouslySetInnerHTML={{ __html: reply.message }}
                          />
                          <p className="mb-2">
                            Regards,
                            <br />
                            {reply.repliedBy || "Support Center"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    No replies found.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Email;
