import React from "react";
import neuralPic from "../../../assets/aboutUs/pic.png";
import brainBg from "../../../assets/aboutUs/pic2.png";
import aIcon from "../../../assets/aboutUs/icon.png";

const LevelIntelligence = () => {
  const scrollFooterAboutUs = () => {
    const footerSection = document.getElementById('footer-section-about-us');
    if (footerSection) {
      footerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="w-full bg-black py-12 md:py-20 lg:px-4 md:px-20">
      {/* Top Section with Heading */}
      <div className="text-center mb-10 md:mb-16 flex flex-col items-center justify-center">
        <p className="bg-[#FFFFFF0F] text-[14px] text-[#A7AABB] w-[160px] px-2 py-2 border border-white/20  rounded-full flex flex-row items-center gap-2 justify-center">
            <img src="/home/star.png" alt="img"/>
              COGNITION
          <img src="/home/star.png" alt="img"/>
          </p>
        <h2 className="mt-6 text-white text-2xl md:text-4xl font-medium mb-4">
          Marketing Rewired at the Cognitive Level
          {/*<span className="text-[#12DCF0]">Intelligence</span>*/}
        </h2>
        <p className="text-[#BFC3C9] text-xs md:text-base max-w-2xl mx-auto">
          We believe the most powerful marketing doesn't start with trends. It
          starts with cognition. Aneuro was developed to help businesses tap
          into the psychological patterns behind every conversion.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10 md:mb-16">
        {/* Card 1 */}
        <div
          className="bg-[#1B1B1B33] rounded-lg overflow-hidden border py-4 flex flex-col"
          style={{ borderColor: "#FFFFFF0F", borderWidth: "2px" }}
        >
          <div className="p-4 md:p-6 flex-1">
            <h3 className="text-white text-lg md:text-xl mb-2">
              Not About Copy
            </h3>
            <p className="text-[#BFC3C9] text-xs md:text-sm mb-4">
              It's not about writing better copy.
            </p>
          </div>
          <img
            src={neuralPic}
            alt="Neural Network"
            className="w-full h-40 md:h-[380px] rounded-2xl px-2 object-cover"
          />
        </div>

        {/* Card 2 - Middle Card with Contact and brain background */}
        <div
          className="bg-[#1B1B1B33] rounded-2xl overflow-hidden relative flex flex-col justify-end"
          style={{
            minHeight: "320px",
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
            className="relative z-10 flex flex-col items-start justify-end p-4 md:p-8 h-full w-full"
            style={{ minHeight: "320px" }}
          >
            <div className="mb-4">
              <img
                src={aIcon}
                alt="AI Expert Icon"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </div>
            <h3 className="text-white text-lg md:text-xl font-semibold mb-2">
              Get in Touch 
            </h3>
            <p className="text-white text-sm md:text-base mb-4 md:mb-6">
             From building tailored solutions to exploring innovative ideas, we’ll support your journey.
            </p>
            <button className="cursor-pointer bg-gradient-to-r from-[#12DCF0] to-[#1DE6FB] text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg mt-2 w-auto text-xs md:text-base"
            onClick={scrollFooterAboutUs}
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="bg-[#1B1B1B33] rounded-lg overflow-hidden border py-2 flex flex-col"
          style={{ borderColor: "#FFFFFF0F", borderWidth: "2px" }}
        >
          <div className="p-2 md:p-4 flex-1">
            <h3 className="text-white text-lg md:text-xl mb-2">
              About Understanding
            </h3>
            <p className="text-[#BFC3C9] text-xs md:text-sm mb-4">
              It's about understanding why certain messages feel right to the
              brain and building around that.
            </p>
          </div>
          <img
            src={neuralPic}
            alt="Neural Network"
            className="w-full h-40 md:h-[380px] rounded-2xl px-2 object-cover"
          />
        </div>
      </div>

      {/* Bottom Call to Action */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs md:text-sm">
        <span className="bg-[#12DCF0]/20 px-4 py-1 rounded-full text-[#12DCF0] mb-2 md:mb-0">
          Hey!
        </span>
        <span className="text-white mb-2 md:mb-0">
          Be the change your community needs -
        </span>
        <a href="/signup" className="text-[#12DCF0] underline"
        
        >
          get involved with us today!
        </a>
      </div>
    </section>
  );
};

export default LevelIntelligence;
