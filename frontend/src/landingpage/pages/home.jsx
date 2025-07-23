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

const Home=()=>{

    return(
        <div className="w-full mx-auto px-4 md:px-12 max-w-[1750px] bg-black font-manrope ">
         <Navbar/>
          <HeroSection
        topbutton="Lorem ipsum dolo"
        bgImage="/home/hero.png"
        title="Every decision begins in the brain. Every click begins "
        highlightText="with Aneuro"
        subtitle="Aneuro adapts to how your audience makes decisions—and delivers plug-and-play tools that match. No guesswork. No friction. "
        primaryBtnText="Get Started"
        primaryBtnLink="/signup"
        secondaryBtnText="View Pricing"
        secondaryBtnLink="/"
        bottomImage="/home/img.png"
        bottomText="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <Transformation/>
      <Behavioralprecision/>
      <Neural/>
      <Fact/>
      <Subscription/>
      <Faq/>
      <Compete/>
      <Footer/>
        </div>
    )
}

export default Home;