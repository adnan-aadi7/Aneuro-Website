import Navbar from "../components/homepage/navbar";
import HeroSection from "../components/homepage/hero";
import Transformation from "../components/homepage/transformation";
import Behavioralprecision from "../components/homepage/behavioralprecision";
import Neural from "../components/homepage/neural";
import Fact from "../components/homepage/fact";
import Subscription from "../components/homepage/subscription";
import Faq from "../components/homepage/faq";
import Footer from "../aboutUs/components/Footer";
import Compete from "../components/homepage/compete";

const Home = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full mx-auto px-4 md:px-12 max-w-[1750px] bg-black font-manrope ">
      <Navbar />
      <HeroSection
        topbutton="NEUROMARKETING INTELLIGENCE"
        bgImage="/home/hero.png"
        title="Every decision begins in the brain, Every profit begins "
        highlightText="with Aneuro"
        subtitle="Aneuro adapts to how your audience makes decisions—and delivers plug-and-play tools that match. No guesswork. No friction. "
        primaryBtnText="GET STARTED"
        primaryBtnLink="/signup"
        secondaryBtnText="VIEW PRICING"
        secondaryBtnLink="#"
        onSecondaryClick={scrollToPricing}
        bottomImage="/home/img.png"
        bottomText="Trusted by leading businesses in every industry"
      />

      <Transformation />
      <Behavioralprecision />
      <Neural />
      <Fact />
      <div id="pricing-section">
        <Subscription />
      </div>
      <Faq />
      <Compete />
      <div id="footer-section">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
