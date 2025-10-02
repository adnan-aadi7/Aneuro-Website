import { Link } from "react-router-dom";

const Compete =()=>{
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

    return(
       <div className="overflow-hidden flex flex-col items-center justify-center py-12 relative bg-[url('/home/lastbg.png')] bg-no-repeat bg-cover bg-center w-full   rounded-lg border border-[#FFFFFF0F]">
            <p className="bg-[#FFFFFF0F] text-[14px] text-[#A7AABB] border border-white/20 w-[150px] px-6 py-2 rounded-full flex flex-row items-center gap-2 justify-center">
               <img src="/home/star.png" alt="img"/>
                PRICING
             <img src="/home/star.png" alt="img"/>
             </p>

             <h1 className="text[20px] lg:text-[48px] font-medium mt-3">You weren't meant to compete
                <span className=" font-bold bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] bg-clip-text text-transparent"> In The Past</span>
             </h1>
             <p className="text-[16px] text-[#A7AABB]">
                This is your portal into the next era of marketing. And it's already built.
             </p>

             <div className="flex justify-center gap-4 flex-wrap mt-12">
           <Link to="/signup">
  <button className="text-[14px] cursor-pointer px-6 py-3 border border-white/20 bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] rounded-full font-semibold">
    Get Started
  </button>
</Link>
<Link to="/">
  <button className="text-[14px] cursor-pointer px-6 py-3 border border-white/60 rounded-full font-semibold hover:bg-white hover:text-black " 
  onClick={scrollToPricing}
  >
    View Pricing
  </button>
</Link>

          </div>

        </div>
    )
}

export default Compete;