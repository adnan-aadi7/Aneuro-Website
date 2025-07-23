import React from "react";
import DashIcon from "../../../assets/auth/Dash.png";
import Ticket from "../../../assets/auth/ticket.png";
import Dots from "../../../assets/auth/dots.png";
import Vector from "../../../assets/auth/Vector.png";
export default function RightSection() {
  console.log("i am there");
  // Random person images from Unsplash
  const personImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  ];

  return (
    <div className="w-full h-full">
      <div className="bg-[#12DCF0] h-full w-full">
        <div className="mx-auto h-full w-full">
          {/* Header */}
          <img src={Ticket} alt="ticket" className="w-20 h-16 ml-8 absolute" />
          <img
            src={Dots}
            alt="dosts"
            className="w-10 h-40  absolute ml-[690px] mt-5"
          />
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl font-bold text-gray-900 mt-14 ">
              Find Marketing Experts
            </h1>

            <p className="text-gray-700 text-[13px] max-w-1xl mx-auto mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
              sapien at <br /> risus volutpat tempor.
            </p>

            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-2 h-2 bg-gray-900 rounded-full px-5"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* Main Dashboard Card */}
          <div className="max-full mx-auto mt-8 h-full w-full">
            {/* Profile Image at top */}
            <div className="relative">
              <img
                src={personImages[0]}
                alt="Expert"
                className="w-20 h-20 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 -top-1 z-10"
              />
            </div>
            {/* Dashboard Content: Only Dash.png image */}
            <div
              className="flex justify-center items-center rounded-b-2xl relative"
              style={{ minHeight: "100px", marginBottom: 0, paddingBottom: 0 }}
            >
              <img
                src={DashIcon}
                alt="Dashboard"
                className="w-full h-[700px] rounded-xl "
              />
              {/* Floating Profile Images */}
              <img
                src={personImages[1]}
                alt="Expert"
                className="w-20 h-20 rounded-full border-4 border-white absolute right-8 top-1/2 transform -translate-y-1/2 shadow-lg"
              />
              <img
                src={personImages[2]}
                alt="Expert"
                className="w-20 h-20 rounded-full border-4 border-white absolute left-36 bottom-20 shadow-lg"
              />
              <img
                src={Vector}
                alt="vector"
                className="w-25 h-25 absolute left-8 bottom-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
