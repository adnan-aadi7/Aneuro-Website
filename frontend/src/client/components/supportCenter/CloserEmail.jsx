import React from "react";

const CloserEmail = () => {
  return (
    <div
      className="max-w-full mx-auto mt-8 p-15  bg-[#232432] relative"
      style={{
        boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset",
      }}
    >
      {/* User Info */}
      <div className="flex items-center mb-2">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Aneuro Support"
          className="w-8 h-8 rounded-full object-cover border border-gray-500 mr-3"
        />
        <div>
          <span className="font-semibold text-white mr-2">Reply To:</span>
          <span className="text-white">Devon Lane 13@gmail.</span>
        </div>
      </div>
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
  );
};

export default CloserEmail;
