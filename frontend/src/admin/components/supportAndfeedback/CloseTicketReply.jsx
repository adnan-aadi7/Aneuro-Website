import React from "react";

const CloseTicketReply = ({ ticket, onReopenTicket }) => {
  return (
    <div className="max-w-full mx-auto mt-8">
      <div
        className="p-8 rounded  relative mb-6"
        style={{ boxShadow: "0 0 0 1px inset, 0 2px 0px 0 #0e7490 inset" }}
      >
        {/* Header */}
        <div className="flex items-center mb-2">
          <img
            src="/Avatar.png"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-500 mr-3"
          />
          <span className="font-semibold text-white text-base">Reply To: {ticket?.name || "User"}</span>
        </div>
        
        {/* Subject */}
        <div className="mt-2 mb-2">
          <span className=" text-white text-sm">
            Your Support Ticket Has Been Closed
          </span>
        </div>
        
        {/* Closure Message */}
        <div className="text-gray-200 text-sm mb-4 mt-2">
          
          <p className="mb-4">
            The Issue You Reported Has Been Successfully Resolved By Our Team. 
            We Appreciate Your Patience And Hope Everything Is Working Smoothly Now.
          </p>
          
        </div>
        
        {/* Reopen Option */}
        <div className="mt-2 ">
          <p className="text-gray-300 text-sm mb-3">Still facing issue?</p>
          <button
            onClick={onReopenTicket}
            className="bg-[#12DCF0] text-[#232432] px-4 py-1 font-semibold hover:bg-cyan-300 transition-colors"
          >
            Reopen Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseTicketReply;
