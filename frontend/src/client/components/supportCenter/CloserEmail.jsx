import React from "react";
import { useSelector } from "react-redux";

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
        <div className="text-gray-400 text-center py-8">No closed tickets found.</div>
      </div>
    );
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="max-w-full mx-auto mt-8 p-15 bg-[#232432] relative"
          style={{
            boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
          }}
        >
          {/* User Info */}
          <div className="flex items-center mb-2">
            <img
              src="/logo.png"
              alt="ANEURO"
              className="w-12 h-12 rounded-full bg-white mr-3"
            />
            <div>
              <span className="font-semibold text-white mr-2">Reply To:</span>
              <span className="text-white">{ticket.email || email || "User"}</span>
            </div>
          </div>
          
          {/* Categories Section - Dynamic for each ticket */}
          {ticket.category && (
            <div className="mt-6 mb-4">
              <div className="text-xs text-gray-400 mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(ticket.category) ? (
                  ticket.category.map((category, index) => (
                    <span
                      key={index}
                      className="text-white py-1 rounded-full text-xl font-semibold"
                    >
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="text-white py-1 rounded-full text-xl font-semibold">
                    {ticket.category}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Closure Message */}
          <div className="mt-6 mb-2">
            <span className="text-white font-semibold text-base">
              Your Support Ticket Has Been Closed
            </span>
          </div>
          <div className="text-gray-200 text-sm mb-8 mt-2">
            The Issue You Reported Has Been Successfully Resolved By Our Team. We
            Appreciate Your Patience And Hope Everything Is Working Smoothly Now.
          </div>
          
          <div className="text-xs text-gray-400 mb-2">Still facing issue?</div>
          <button className="bg-cyan-400 text-[#232432] px-6 py-2 rounded font-semibold transition-colors hover:bg-cyan-300 text-base mt-5">
            Contact Us
          </button>
        </div>
      ))}
    </div>
  );
};

export default CloserEmail;
