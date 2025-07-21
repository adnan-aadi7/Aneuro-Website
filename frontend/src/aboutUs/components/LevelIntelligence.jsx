import React from "react";
import neuralPic from "../../assets/aboutUs/pic.png";
import brainBg from "../../assets/aboutUs/pic2.png";
import aIcon from "../../assets/aboutUs/icon.png";

const LevelIntelligence = () => {
  return (
    <section className="w-full bg-black py-20 px-4 md:px-20">
      {/* Top Section with Heading */}
      <div className="text-center mb-16">
        <button className="mb-4 px-6 py-2 rounded-full bg-[#1B1B1B33] text-white font-medium text-sm [8px] flex items-center gap-2 shadow-md mx-auto">
          <span className="text-[#12DCF0]">★</span> COGNITION{" "}
          <span className="text-[#12DCF0]">★</span>
        </button>
        <h2 className="text-white text-3xl md:text-4xl font-light mb-4">
          Marketing Rewired at the Cognitive Level
          <span className="text-[#12DCF0]">Intelligence</span>
        </h2>
        <p className="text-[#BFC3C9] text-sm md:text-base max-w-2xl mx-auto">
          We believe the most powerful marketing doesn't start with trends. It
          starts with cognition. Aneuro was developed to help businesses tap
          into the psychological patterns behind every conversion.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {/* Card 1 */}
        <div
          className="bg-[#1B1B1B33] rounded-lg overflow-hidden border py-4"
          style={{ borderColor: "#FFFFFF0F", borderWidth: "2px" }}
        >
          <div className="p-6">
            <h3 className="text-white text-xl mb-2">Not About Copy</h3>
            <p className="text-[#BFC3C9] text-sm mb-4">
              It's not about writing better copy.
            </p>
          </div>
          <img
            src={neuralPic}
            alt="Neural Network"
            className="w-full h-[380px]  rounded-2xl px-2 "
          />
        </div>

        {/* Card 2 - Middle Card with Contact and brain background */}
        <div
          className="bg-[#1B1B1B33] rounded-2xl overflow-hidden relative flex flex-col justify-end"
          style={{
            minHeight: "420px",
            borderColor: "#FFFFFF0F",
            borderWidth: "2px",
          }}
        >
          <img
            src={brainBg}
            alt="Brain Background"
            className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl"
            style={{ filter: "brightness(0.7)" }}
          />
          <div
            className="relative z-10 flex flex-col items-start justify-end p-8 h-full w-full"
            style={{ minHeight: "420px" }}
          >
            <div className="mb-4">
              <img
                src={aIcon}
                alt="AI Expert Icon"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Get in Touch with Our AI Experts
            </h3>
            <p className="text-white text-base mb-6">
              Whether you're looking to build a custom neural network, explore
              deep learning.
            </p>
            <button className="bg-gradient-to-r from-[#12DCF0] to-[#1DE6FB] text-white font-semibold px-8 py-3 rounded-full shadow-lg mt-2">
              Contact Us
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="bg-[#1B1B1B33] rounded-lg overflow-hidden border py-2"
          style={{ borderColor: "#FFFFFF0F", borderWidth: "2px" }}
        >
          <div className="p-2">
            <h3 className="text-white text-xl mb-2">About Understanding</h3>
            <p className="text-[#BFC3C9] text-sm mb-4">
              It's about understanding why certain messages feel right to the
              brain and building around that.
            </p>
          </div>
          <img
            src={neuralPic}
            alt="Neural Network"
            className="w-full h-[380px]  rounded-2xl px-2 "
          />
        </div>
      </div>

      {/* Bottom Call to Action */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="bg-[#12DCF0]/20 px-4 py-1 rounded-full text-[#12DCF0]">
          Hey!
        </span>
        <span className="text-white">Be the change your community needs -</span>
        <a href="#" className="text-[#12DCF0] underline">
          get involved with us today!
        </a>
      </div>
    </section>
  );
};

export default LevelIntelligence;
