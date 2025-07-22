import React from "react";
import frame1 from "../../../assets/aboutUs/frame2.png";
import glow from "../../../assets/aboutUs/Ellipse.png";

const AneuroCreatedSection = () => {
  return (
    <section className="w-full  bg-black flex flex-col md:flex-row items-center   md:px-40 py-12">
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-start justify-center w-full z-10">
        <button className="mb-6 px-6 py-2 rounded-full bg-[#232432] text-white font-medium text-[8px] flex items-center gap-2 shadow-md">
          <span className="text-[#12DCF0]">★</span> ABOUT US{" "}
          <span className="text-[#12DCF0]">★</span>
        </button>
        <h1 className="text-white text-3xl md:text-4xl font-light leading-tight mb-4 w-[600px]">
          In A World Of Templates And Noise,
          <br />
          <span className="text-[#12DCF0] font-normal">
            Aneuro Was Created To
          </span>
          <br />
          Think Differently.
        </h1>
        <p className="text-[#BFC3C9] text-base md:text-lg mb-8 w-full">
          Not to optimize what already exists, but to understand what actually{" "}
          <br />
          works at the level of human behavior.
        </p>
        <button className="bg-gradient-to-r from-[#12DCF0] to-[#1DE6FB] text-black font-semibold px-8 py-2 rounded-full shadow-lg hover:brightness-110 transition-all">
          SIGN IN
        </button>
      </div>
      {/* Right Image */}
      <div className="flex-1 flex items-center justify-center w-full mt-12 md:mt-0 z-10 ml-28 relative">
        {/* Glow background */}
        <img
          src={glow}
          alt="glowe effect"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[3000px] w-[120%] z-10 pointer-events-none select-none"
        />
        {/* Main image */}
        <img
          src={frame1}
          alt="Aneuro Brain Illustration"
          className="max-w-[1000px] w-full relative z-10"
        />
      </div>
    </section>
  );
};

export default AneuroCreatedSection;
