import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#101014] text-white pt-12 md:pt-16 px-2 md:px-16 relative overflow-hidden">
      {/* Top Section */}
      <div className="max-w-5xl mx-auto relative z-20">
        <h2 className="text-2xl md:text-4xl font-medium mb-8 md:mb-12">
          Start your journey into smart <br />
          <span className="text-[#12DCF0] font-bold">innovation today.</span>
        </h2>
        <div className="border-t border-[#23232F] pt-8 md:pt-12 pb-6 md:pb-8 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4 mb-8 md:mb-0">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-[#12DCF0] inline-block"></span>
              <span className="font-semibold text-lg">LOGO</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-xs">
              Neural networks powering innovation. Shaping the future
            </p>
            <div className="flex gap-3 mt-2">
              {/* Social icons as circles (placeholders) */}
              <span className="w-5 h-5 rounded-full border border-gray-600 inline-block"></span>
              <span className="w-5 h-5 rounded-full border border-gray-600 inline-block"></span>
              <span className="w-5 h-5 rounded-full border border-gray-600 inline-block"></span>
              <span className="w-5 h-5 rounded-full border border-gray-600 inline-block"></span>
            </div>
          </div>
          {/* Our Services */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-semibold mb-4 text-base md:text-lg">
              Our Services
            </h3>
            <ul className="text-gray-300 text-xs md:text-sm space-y-1">
              <li>
                <span className="inline-block w-1 h-1 rounded-full bg-white mr-2 align-middle"></span>
                Pricing
              </li>
              <li>
                <span className="inline-block w-1 h-1 rounded-full bg-white mr-2 align-middle"></span>
                Features
              </li>
              <li>
                <span className="inline-block w-1 h-1 rounded-full bg-white mr-2 align-middle"></span>
                FAQ
              </li>
              <li>
                <span className="inline-block w-1 h-1 rounded-full bg-white mr-2 align-middle"></span>
                Compare Tiers
              </li>
            </ul>
          </div>
          {/* Contact Information */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-semibold mb-4 text-base md:text-lg">
              Contact Information
            </h3>
            <p className="text-gray-300 text-xs md:text-sm mb-2">
              4517 Washington Ave. Manchester,
              <br /> Kentucky 39495
            </p>
            <p className="text-gray-400 text-xs mb-1">Need Any Help?</p>
            <a
              href="tel:+91123654789"
              className="text-[#12DCF0] font-semibold text-sm md:text-base hover:underline"
            >
              (+91) - 123 654 789
            </a>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-base md:text-lg">
              Subscribe To Newsletter
            </h3>
            <p className="text-gray-300 text-xs md:text-sm mb-4">
              Subscribe to our newsletter for the latest updates, exclusive
              content.
            </p>
            <form className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Email Address *"
                className="bg-transparent border-b border-b-gray-600 px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12DCF0]"
              />
              <button
                type="submit"
                className="bg-[#12DCF0] p-2 rounded hover:bg-cyan-400 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowUpRight className="text-[#18192A] w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-8 md:mt-10 text-center text-gray-400 text-xs">
          Copyright © 2025 All Rights Reserved.
        </div>
      </div>
      {/* Large background text absolutely positioned at the very bottom, independent of copyright */}
      <div className="left-0 bottom-0 w-full flex justify-center items-end pointer-events-none select-none z-10 mt-5">
        <span className="font-manrope font-semibold uppercase text-center text-white/20 lg:text-[14vw] md:text-[240px] leading-[180px] tracking-tight text-[19vw]">
          ANEURO
        </span>
      </div>
      {/* Top right blue dot (hide on small screens) */}
      <span className="hidden md:block absolute top-20 right-[250px] w-10 h-10 rounded-full bg-[#12DCF0] opacity-90"></span>
      {/* Top right glow */}
      <span
        className="pointer-events-none absolute top-0 right-0 w-40 h-24 rounded-full"
        style={{
          background: "#54E7FD",
          filter: "blur(100px)",
          opacity: 3.7,
          zIndex: 1,
        }}
      ></span>
      {/* Bottom left glow */}
      <span
        className="pointer-events-none absolute bottom-0 left-0 w-40 h-24 rounded-full"
        style={{
          background: "#54E7FD",
          filter: "blur(100px)",
          opacity: 3.7,
          zIndex: 1,
        }}
      ></span>
    </footer>
  );
}
