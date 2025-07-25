import React from "react";
import marketingImg from "../../../assets/aboutUs/maketing.png";
import { Star } from "lucide-react";

const Marketing = () => {
  return (
    <section className="w-full bg-black flex flex-col md:flex-row items-center justify-center py-16 px-4 md:px-0 max-w-5xl mx-auto">
      {/* Left Image */}
      <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
        <img
          src={marketingImg}
          alt="Marketing Brain"
          className="rounded-2xl w-[350px] md:w-[420px] lg:w-[340px] xl:w-[380px] shadow-lg"
        />
      </div>
      {/* Right Content */}
      <div className="flex-1 flex flex-col items-start md:items-start justify-center max-w-lg">
        {/* Badge */}
        <div className="mb-6">
         <p className="bg-[#FFFFFF0F] text-[14px] text-[#A7AABB] w-[180px] px-2 py-2 border border-white/20  rounded-full flex flex-row items-center gap-2 justify-center">
            <img src="/home/star.png" alt="img"/>
              OUR MISSION
          <img src="/home/star.png" alt="img"/>
          </p>
        </div>
        {/* Heading */}
        <h2 className="text-white text-3xl md:text-4xl font-medium mb-4">
          Marketing Should Be{" "}
          <span className="text-[#12DCF0] font-semibold">Intelligent.</span>
        </h2>
        {/* Subtext */}
        <p className="text-[#BFC3C9] text-base mb-3">
          It should be ethical, adaptive, and human.
        </p>
        <p className="text-[#BFC3C9] text-base mb-3">
          Aneuro was built to democratize access to that kind of thinking so the
          power to connect meaningfully isn't limited to companies with research
          labs or massive budgets.
        </p>
        <p className="text-[#BFC3C9] text-base mb-3">
          We're not just here to improve performance.
        </p>
        <p className="text-[#BFC3C9] text-base">
          We're here to shift what performance means.
        </p>
      </div>
    </section>
  );
};

export default Marketing;
