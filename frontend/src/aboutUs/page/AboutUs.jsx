import React from "react";
import AneuroCreatedSection from "../components/AneuroCreatedSection";
import Navbar from "../../landingpage/components/homepage/navbar";
import LevelIntelligence from "../components/LevelIntelligence";
import EneuroExist from "../components/EneuroExist";
import Marketing from "../components/Marketing";
import Welcome from "../components/Welcome";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <AneuroCreatedSection />
      <LevelIntelligence />
      <EneuroExist />
      <Marketing />
      <Welcome />
    </>
  );
};

export default AboutUs;
