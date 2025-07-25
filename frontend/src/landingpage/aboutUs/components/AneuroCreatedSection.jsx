import React from "react";
import frame1 from "../../../assets/aboutUs/frame2.png";
import glow from "../../../assets/aboutUs/Ellipse.png";

const AneuroCreatedSection = () => {
  return (
    <section className="w-full bg-black mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:px-40 lg:px-4">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start justify-center w-full z-10">
         <p className="bg-[#FFFFFF0F] text-[14px] text-[#A7AABB] w-[160px] px-2 py-2 border border-white/20  rounded-full flex flex-row items-center gap-2 justify-center">
            <img src="/home/star.png" alt="img"/>
             ABOUT US
          <img src="/home/star.png" alt="img"/>
          </p>
          <h1 className="mt-6 text-white text-2xl md:text-4xl font-medium leading-tight mb-4 w-full md:w-[600px]">
            In A World Of Templates And Noise,
            <br />
            <span className="text-[#12DCF0] font-normal">
              Aneuro Was Created To
            </span>
            <br />
            Think Differently.
          </h1>
          <p className="text-[#A7AABB] text-sm md:text-lg mb-8 w-full">
            Not to optimize what already exists, but to understand what actually{" "}
            <br className="hidden md:block" /> works at the level of human
            behavior.
          </p>
          <button className="bg-gradient-to-r from-[#12DCF0] to-[#1DE6FB] text-black font-semibold px-4 md:px-8 py-2 rounded-full shadow-lg hover:brightness-110 transition-all w-auto md:w-auto text-sm md:text-base">
            SIGN IN
          </button>
        </div>
        {/* Right Image */}
        <div className="flex-1 flex items-center justify-center w-full mt-12 md:mt-0 z-10 md:ml-28 relative">
          {/* Extra Glow background (div for strong blur) */}
          <span
            className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vw] md:w-[500px] md:h-[300px] rounded-full z-0"
            style={{
              background: "#54E7FD",
              filter: "blur(70px)",
              opacity: 0.35,
            }}
          ></span>
          {/* Glow background image */}
          <img
            src={glow}
            alt="glowe effect"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[600px] md:max-w-[3000px] w-[90vw] md:w-[120%] z-10 pointer-events-none select-none hidden md:block"
          />
          {/* Main image */}
          <img
            src={frame1}
            alt="Aneuro Brain Illustration"
            className="hidden md:block max-w-[320px] md:max-w-[1000px] w-[90vw] md:w-full relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default AneuroCreatedSection;
