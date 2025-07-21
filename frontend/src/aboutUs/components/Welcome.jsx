import React from "react";
import { Star } from "lucide-react";

const Welcome = () => {
  return (
    <section className="relative w-full min-h-[220px] flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-black">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          background:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0 1px, transparent 1px 40px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0 1px, transparent 1px 40px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Badge */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-medium">
            <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span className="tracking-wider uppercase">Pricing</span>
            <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          </div>
        </div>
        {/* Heading */}
        <h1 className="text-white text-3xl md:text-5xl font-light text-center mb-1">
          Welcome To The Next Era
        </h1>
        <h2 className="text-[#12DCF0] text-2xl md:text-4xl font-bold text-center mb-4">
          Welcome To Aneuro
        </h2>
        {/* Subtext */}
        <p className="text-[#BFC3C9] text-sm md:text-base text-center mb-1">
          This is more than optimization.
        </p>
        <p className="text-[#BFC3C9] text-sm md:text-base text-center">
          This is alignment with how people actually think.
        </p>
      </div>
    </section>
  );
};

export default Welcome;
