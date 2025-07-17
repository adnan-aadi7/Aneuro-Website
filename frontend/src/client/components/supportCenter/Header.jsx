import React, { useState } from "react";
import Email from "./Email";
import CloserEmail from "./CloserEmail";

const Header = () => {
  const [activeTab, setActiveTab] = useState("Open");
  return (
    <div className=" lg:px-4 py-6 px-1">
      <h1 className="text-4xl font-semibold text-white mb-2">
        Need Help? Open A Support Ticket
      </h1>
      <p className="text-lg text-gray-300 mb-6">We are here to assist you!</p>
      <div className="flex gap-26 px-16 mt-10">
        <button
          className={`text-lg font-medium text-white pb-1 border-b-2 transition-all duration-200 ${
            activeTab === "Open" ? "border-cyan-400" : "border-transparent"
          }`}
          onClick={() => setActiveTab("Open")}
        >
          Open
        </button>
        <button
          className={`text-lg font-medium text-white pb-1 border-b-2 transition-all duration-200 ${
            activeTab === "Closure" ? "border-cyan-400" : "border-transparent"
          }`}
          onClick={() => setActiveTab("Closure")}
        >
          Closure
        </button>
      </div>
      {activeTab === "Open" && (
        <div className="mt-8">
          <Email />
        </div>
      )}
      {activeTab === "Closure" && (
        <div className="mt-8">
          <CloserEmail />
        </div>
      )}
    </div>
  );
};

export default Header;
