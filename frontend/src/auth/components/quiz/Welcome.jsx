import React from "react";
import { X } from "lucide-react";
import welcomeImg from "../../../../public/auth/welcome.png";

const Welcome = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dark background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"></div>
      {/* Modal content */}
      <div className="relative z-10 text-center bg-black rounded-xl p-10 shadow-xl w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        {/* Welcome image or text */}
        <img
          src={welcomeImg}
          alt="Welcome"
          className="w-[520px] h-[180px] mx-auto"
        />
        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-white mb-6">
          Get Ready To Dive In
        </h2>
        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-8">
          We want to get to know you a little better. Nothing too deep—just a
          few quick questions about how you move through the world. Trust your
          gut and have fun with it.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
