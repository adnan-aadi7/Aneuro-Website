import React from "react";
import { Brain, Target, Zap, Star } from "lucide-react";
import imageBg from "../../../assets/aboutUs/image.png";

export default function EneuroExist() {
  return (
    <div className="relative overflow-hidden py-8 px-2 md:px-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat "
        style={{
          backgroundImage: `url(${imageBg})`,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-2 sm:px-4">
        {/* Top Badge */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs md:text-sm font-medium">
            <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span className="tracking-wider uppercase">COGNITION</span>
            <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center ">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6">
            Why Aneuro <span className="text-cyan-400 font-normal">Exists</span>
          </h1>
        </div>

        {/* Description */}
        <div className="text-center max-w-2xl md:max-w-4xl mx-auto mb-4">
          <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-8">
            We don't just inform strategy. We enhance the foundation it's built
            on by using decades of behavioral insight to support brands that
            want to move faster, connect deeper, and convert smarter.
          </p>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg">
            Every part of the system is crafted for clarity, not clutter.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-md md:max-w-2xl mx-auto h-auto md:h-[180px] mt-8 mb-8 md:mb-0">
          {/* Card 1 */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center hover:bg-black/60 transition-all duration-300 relative overflow-hidden">
            {/* Thinner gradient border right and bottom */}
            <div
              className="pointer-events-none select-none absolute right-0 top-0 h-full w-0.5"
              style={{
                background:
                  "linear-gradient(to bottom, #0A7F8A 20%, #12DCF0 50%)",
              }}
            />
            <div
              className="pointer-events-none select-none absolute left-0 bottom-0 w-full h-0.5"
              style={{
                background:
                  "linear-gradient(to right, #0A7F8A 20%, #12DCF0 50%)",
              }}
            />
            <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white font-medium text-base md:text-lg mb-2">
              Behavior-backed insights
            </h3>
          </div>

          {/* Card 2 */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center hover:bg-black/60 transition-all duration-300 relative overflow-hidden">
            {/* Thinner gradient border right and bottom */}
            <div
              className="pointer-events-none select-none absolute right-0 top-0 h-full w-0.5"
              style={{
                background:
                  "linear-gradient(to bottom, #0A7F8A 20%, #12DCF0 50%)",
              }}
            />
            <div
              className="pointer-events-none select-none absolute left-0 bottom-0 w-full h-0.5"
              style={{
                background:
                  "linear-gradient(to right, #0A7F8A 20%, #12DCF0 50%)",
              }}
            />
            <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white font-medium text-base md:text-lg mb-2">
              Cognitive alignment at the core
            </h3>
          </div>

          {/* Card 3 */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center hover:bg-black/60 transition-all duration-300 relative overflow-hidden">
            {/* Thinner gradient border right and bottom */}
            <div
              className="pointer-events-none select-none absolute right-0 top-0 h-full w-0.5"
              style={{
                background:
                  "linear-gradient(to bottom, #0A7F8A 20%, #12DCF0 50%)",
              }}
            />
            <div
              className="pointer-events-none select-none absolute left-0 bottom-0 w-full h-0.5"
              style={{
                background:
                  "linear-gradient(to right, #0A7F8A 20%, #12DCF0 50%)",
              }}
            />
            <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white font-medium text-base md:text-lg mb-2">
              Tools that move as quickly as your business does
            </h3>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-cyan-400/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-60 right-10 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
