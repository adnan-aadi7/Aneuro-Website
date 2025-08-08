import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketById } from "../../../store/Slice/TicketSlice";

const Email = ({ tickets, onSelectTicket }) => {
  const dispatch = useDispatch();
  const currentTicket = useSelector((state) => state.ticket.currentTicket);
  const loading = useSelector((state) => state.ticket.loading);
  const [expandedTickets, setExpandedTickets] = useState(new Set());

  if (!tickets || tickets.length === 0) {
    return <div className="text-gray-400 text-center">No tickets found.</div>;
  }

  const handleTicketClick = (ticketId) => {
    const newExpandedTickets = new Set(expandedTickets);
    if (newExpandedTickets.has(ticketId)) {
      newExpandedTickets.delete(ticketId);
    } else {
      newExpandedTickets.add(ticketId);
      dispatch(getTicketById(ticketId));
    }
    setExpandedTickets(newExpandedTickets);
    onSelectTicket && onSelectTicket(ticketId);
  };

  const isTicketExpanded = (ticketId) => expandedTickets.has(ticketId);

  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket._id}>
          <div
            className="max-w-full mx-auto mt-8 p-15 rounded bg-[#232432] relative cursor-pointer hover:bg-[#2a2a3a] transition-colors"
            style={{ boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset" }}
            onClick={() => handleTicketClick(ticket._id)}
          >
            {/* User Info */}
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
              {/* Expand/Collapse indicator */}
              <div className="ml-auto">
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isTicketExpanded(ticket._id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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

          {/* Replies Section - Show when ticket is expanded */}
          {isTicketExpanded(ticket._id) && (
            <div className="mt-4">
              {loading && currentTicket?._id === ticket._id ? (
                <div className="text-gray-400 text-center py-4">Loading replies...</div>
              ) : currentTicket?._id === ticket._id && currentTicket?.replies && currentTicket.replies.length > 0 ? (
                <div className="space-y-4">
                  {currentTicket.replies.map((reply, idx) => (
                    <div
                      key={idx}
                      className="max-w-full mx-auto p-15 rounded bg-[#232432] relative"
                      style={{ boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset" }}
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
                            Support Team
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(reply.repliedAt || Date.now()).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Reply Subject */}
                      <div className="mt-4 mb-2">
                        <span className="font-semibold text-white text-sm">
                          Re: {ticket.category?.length
                            ? typeof ticket.category === "string"
                              ? ticket.category
                              : ticket.category.join(", ")
                            : "Support Ticket"} – Ticket #{ticket._id?.slice(-8)}
                        </span>
                      </div>
                      
                      {/* Reply Message */}
                      <div className="text-gray-200 text-sm mb-4 mt-5">
                        <p className="mb-4">Hi {ticket.name},</p>
                        <div 
                          className="mb-4"
                          dangerouslySetInnerHTML={{ __html: reply.message }}
                        />
                        <p className="mb-2">
                          Thank You For Your Patience.<br />
                          Regards,<br />
                          Support Center
                        </p>
                      </div>

                      {/* Reply Attachment */}
                      {reply.fileUrl && (
                        <div className="flex items-center border border-cyan-400 rounded-md px-3 mt-5 w-fit bg-[#232432] shadow-inner">
                          <div className="flex items-center mr-3">
                            <div className="bg-blue-600 rounded p-1 flex items-center justify-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="4" fill="#3B82F6" />
                                <text x="6" y="17" fill="white" fontSize="10" fontWeight="bold">
                                  FILE
                                </text>
                              </svg>
                            </div>
                            <div className="ml-2">
                              <div className="text-white text-sm font-medium">
                                {reply.fileUrl.split("/").pop()}
                              </div>
                            </div>
                          </div>
                          <a
                            href={reply.fileUrl}
                            download
                            className="ml-2 p-2 rounded flex items-center justify-center"
                            style={{ minWidth: 48, minHeight: 48 }}
                          >
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
              ) : currentTicket?._id === ticket._id ? (
                <div className="text-gray-400 text-center py-4">No replies found.</div>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Email;
