import React from "react";
import { Link } from "react-router-dom";

const HeroSection = ({
  topbutton,
  bgImage,
  title,
  subtitle,
  primaryBtnText,
  primaryBtnLink = "#",
  secondaryBtnText,
  secondaryBtnLink = "#",
  bottomImage,
  bottomText,
  highlightText
}) => {
  return (
    <div className="relative w-full text-white font-manrope max-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16 rounded-lg text-center flex flex-col gap-3 items-center justify-center w-full">
        {/* Top Section */}
        <div className="bg-black/20 w-[95%] md:w-[60%] rounded-lg py-8 flex flex-col gap-3 items-center justify-center px-6">
          <p className="bg-black/50 px-6 py-2 rounded-full flex flex-row items-center gap-2">
            <img src="/home/star.png" alt="img"/>
            {topbutton}
          <img src="/home/star.png" alt="img"/>
          </p>

<h1 className="text-lg lg:text-3xl md:text-5xl font-semibold mb-4">
  {title.split(highlightText)[0]}
  <span className="text-[#12DCF0]">{highlightText}</span>
  {title.split(highlightText)[1]}
</h1>
          <p className="text-[13px] lg:text-[16px] text-[#A7AABB] px-6 md:px-16">{subtitle}</p>

          <div className="flex justify-center gap-4 flex-wrap mt-12">
           <Link to={primaryBtnLink}>
  <button className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] rounded-full font-semibold">
    {primaryBtnText}
  </button>
</Link>
<Link to={secondaryBtnLink}>
  <button className="cursor-pointer px-6 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-black transition">
    {secondaryBtnText}
  </button>
</Link>

          </div>

          <div className="flex flex-col lg:flex-row items-center gap-2 mt-12">
            <img src={bottomImage} alt="img" />
            <p className="text-[#A7AABB] text-[16px]">{bottomText}</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-11 ">
         <img src="/home/contactus.svg" alt="img" className="w-20 h-20 cursor-pointer"/>
      </div>
    </div>
  );
};

export default HeroSection;
