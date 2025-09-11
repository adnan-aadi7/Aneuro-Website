import React, { useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import headingImg from "../../../assets/aboutUs/heading.png";
import axios from "../../../store/axiosInstance";
import { toastSuccess, toastError } from "../../../toast";

const Footer = () => {


  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await axios.post("/newsletter/subscribe", { email });
      toastSuccess("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Subscription failed";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

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
        <img src="/logo.png" alt="logo" className="w-28  h-18" />
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
              <li>
                <span className="inline-block w-1 h-1 rounded-full bg-white mr-2 align-middle"></span>
                <a href="/privacy-policy" className="hover:underline">Privacy & Policy</a>
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
            <form className="flex items-center gap-2 w-full border-b border-b-gray-600 pb-1" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Email Address *"
                className="bg-transparent px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12DCF0] w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
             <button
  type="submit"
  className="bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] p-1 rounded hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
  aria-label="Subscribe"
  disabled={loading}
>
  {loading ? (
    <Loader2 size={18} className="text-[#18192A] animate-spin" />
  ) : (
    <ArrowUpRight size={20} className="text-[#18192A]" />
  )}
</button>

            </form>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-8 md:mt-10 text-center white text-[16px]">
          Copyright © 2025 All Rights Reserved.
        </div>
      </div>
      {/* Large background text absolutely positioned at the very bottom, independent of copyright */}
      <div className="w-full flex justify-center items-end pointer-events-none select-none z-10 mt-5">
        <img
          src={headingImg}
          alt="ANEURO heading"
          className="w-full max-w-4xl h-auto object-contain"
          draggable="false"
        />
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
        className="pointer-events-none absolute bottom-0 left-0 w-35 h-24 rounded-full"
        style={{
          background: "#54E7FD",
          filter: "blur(100px)",
          opacity: 3.7,
          zIndex: 1,
        }}
      ></span>
    </footer>
  );
};

export default Footer;
