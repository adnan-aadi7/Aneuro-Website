import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CloserEmail = ({ email }) => {
  const tickets = useSelector((state) => state.ticket.tickets);

  if (!tickets || tickets.length === 0) {
    return (
      <div
        className="max-w-full mx-auto mt-8 p-15 bg-[#232432] relative"
        style={{
          boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
        }}
      >
        <div className="text-gray-400 text-center py-8">
          No closed tickets found.
        </div>
      </div>
    );
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="max-w-full mx-auto mt-8 p-6 md:p-12 bg-[#232432] rounded-lg relative"
          style={{
            boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
          }}
        >
          {/* Ticket Header */}
          <div className="flex items-center mb-4">
            {ticket.profileImage ? (
              <img
                src={ticket.profileImage}
                alt={ticket.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-500 mr-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold mr-3">
                {ticket.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="text-white font-semibold">{ticket.name}</div>
              <div className="text-xs text-gray-400">{ticket.email}</div>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="mb-4">
            <div className="text-white font-medium text-lg">
              {ticket.category?.[0] || "Support Ticket"}
            </div>
            <p className="text-gray-300 mt-2">{ticket.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              Created at: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Replies */}
          {ticket.replies && ticket.replies.length > 0 ? (
            <div className="space-y-4 mt-6">
              {ticket.replies.map((reply) => (
                <div
                  key={reply._id}
                  className="p-4 rounded-lg bg-[#2a2a3a] border border-gray-600"
                >
                  <div className="flex items-center mb-2">
                    {reply.profileImage ? (
                      <img
                        src={reply.profileImage}
                        alt={reply.repliedBy}
                        className="w-10 h-10 rounded-full object-cover border border-gray-500 mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold mr-3">
                        {reply.repliedBy?.[0]?.toUpperCase() || "S"}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium">
                          Reply To: <span className="text-gray-300">{ticket.email}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-200 text-sm">{reply.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-2">
              No replies for this ticket.
            </div>
          )}

          {/* Closing Block */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <div className="text-white font-semibold text-base">
              Your Support Ticket Has Been Closed
            </div>
            <div className="text-gray-200 text-sm mt-2">
              The issue you reported has been successfully resolved by our team.
              We appreciate your patience and hope everything is working smoothly
              now.
            </div>

            <div className="text-xs text-gray-400 mt-4">Still facing issue?</div>
            <Link
              to="/leave-feedback"
              className="inline-block bg-cyan-400 text-[#232432] px-6 py-2 rounded font-semibold transition-colors hover:bg-cyan-300 text-base mt-3"
            >
              Contact Us
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CloserEmail;
