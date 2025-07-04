import React from "react";
import { X, ArrowLeft, ArrowRight, Star } from "lucide-react";

const Tankyou = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dark background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"></div>
      {/* Modal content */}
      <div className="relative z-10 bg-black rounded-xl p-8 shadow-xl w-full max-w-md mx-4 flex flex-col items-center">
        {/* Top bar with arrows and close */}
        <div className="flex items-center justify-between w-full mb-6">
          <button className="text-white hover:text-cyan-400 transition">
            <ArrowLeft size={28} />
          </button>
          <div className="flex-1"></div>
          <button
            className="text-white hover:text-cyan-400 transition"
            onClick={onClose}
          >
            <X size={28} />
          </button>
        </div>
        {/* Star Icon in cyan circle */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-cyan-400 mb-8">
          <Star size={40} className="text-black" />
        </div>
        {/* Thank You Heading */}
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Thank You!
        </h2>
        {/* Subheading */}
        <p className="text-lg text-white font-semibold mb-10 text-center">
          Quiz Submitted Successfully
        </p>
        {/* Buttons */}
        <div className="flex w-full gap-2">
          <button className="flex-1 bg-white text-black font-semibold  rounded-md text-lg hover:bg-gray-100 transition-all border-2 border-white">
            Review Quiz
          </button>
          <button className="flex-1 bg-cyan-400 text-black font-semibold py-2 rounded-md text-lg hover:bg-cyan-300 transition-all">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tankyou;
