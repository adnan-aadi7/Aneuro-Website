import React from "react";
import AneuroCreatedSection from "../aboutUs/components/AneuroCreatedSection";
import Navbar from "../components/homepage/navbar";
import LevelIntelligence from "../aboutUs/components/LevelIntelligence";
import EneuroExist from "../aboutUs/components/EneuroExist";
import Marketing from "../aboutUs/components/Marketing";
import Welcome from "../aboutUs/components/Welcome";
import HeroSection from "../components/homepage/hero";
import Footer from "../aboutUs/components/Footer";
const AboutUs = () => {
  return (
    <div className="w-full mx-auto px-4 md:px-12 max-w-[1750px] bg-black">
      <Navbar />
      <HeroSection
        topbutton="About Aneuro"
        bgImage="/Figureheroimg.png"
        title="Precision beats "
        highlightText="persuasion"
        subtitle="Aneuro is a behavioral intelligence system grounded in cognitive science. It is where neuroscience and strategy converge, giving businesses the ability to align with how people truly process, trust, and decide. "
        primaryBtnText="Get Started"
        primaryBtnLink="/signup"
        secondaryBtnText="View Pricing"
        secondaryBtnLink="/"
        bottomImage="/home/img.png"
        bottomText="Trusted by marketers who personalize with brain-based precision."
      />
      <AneuroCreatedSection />
      <LevelIntelligence />
      <EneuroExist />
      <Marketing />
      <Welcome />
      <Footer />
    </div>
  );
};

export default AboutUs;
