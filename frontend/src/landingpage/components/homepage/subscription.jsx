import { Check } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStripeProducts } from "../../../store/Slice/PaymentSlice";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


const plans = [
  {
    icon:"/home/1.svg",
    title: "Starter",
    price: "$97",
    duration: "/month",
    description: "Precision without the overhead.",
    details:
      "A streamlined entry point for independent businesses ready to align their marketing with real cognitive insight.",
    includes: [
      "Access to 1 dominant brain type",
      "Matching toolset: email sequence, prompt pack, funnel template",
      "Dashboard access to tools + trend snapshot",
      "Subscription management + basic support",
    ],
    bestFor: "Solo marketers, founders, small teams.",
    button: "Subscribe to Starter",
  },
  {
    icon:"home/2.svg",
    title: "Growth",
    price: "$297",
    duration: "/month",
    description: "Full-spectrum strategy. Delivered instantly.",
    details:
      "Unlock the entire neural framework. More types. More tools. More insight—on demand.",
    includes: [
      "Access to all five brain types",
      "Full library of funnels, prompts, and sequences",
      "CRM/email platform integration",
      "Quiz-to-tool automation pipeline",
      "Brain-type dashboard across all cognitive profiles",
    ],
    bestFor: "Scaling brands, creative teams, small agencies.",
    button: "Upgrade to Growth",
    tag: "Most Popular",
    highlight: true,
  },
  {
    icon:"/home/3.svg",
    title: "Enterprise",
    price: "$1,999",
    duration: "/month",
    description: "Infrastructure for decision-driven marketing.",
    details:
      "Enterprise provides full platform control, strategic flexibility, and operational scale. From white-labeled delivery to internal team seats, this tier is designed for companies who want to integrate Aneuro as a core system—without compromise.",
      includes: [
      "All Growth tier inclusions",
      "White-labeled platform (client-facing or internal)",
      "API access for custom CRM/data integration",
      "Internal CMS for uploading/editing team content",
      "Team seat access (up to 25 users)",
      "Advanced admin dashboard: MRR overview, support tickets, usage logs",
      "Locked file security (non-downloadable tools)",
    ],
    bestFor:
      "Agencies, SaaS providers, and growth-stage companies who require total control and scalable delivery.",
    button: "Request Enterprise Access",
  },
];
const Subscription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchStripeProducts());
  }, [dispatch]);
  console.log("products", products);

  // Map Stripe products to correct order: Starter, Growth, Enterprise
  const getOrderedProducts = () => {
    if (!products || products.length === 0) return plans;
    
    // Create a mapping from plan names to static plan data
    const planMap = {
      'Starter': plans[0],
      'Growth': plans[1], 
      'Enterprise': plans[2]
    };
    
    // Map products to correct order: Starter, Growth, Enterprise
    const orderedProducts = [];
    
    // Find and add Starter first
    const starterProduct = products.find(p => p.name === 'Starter');
    if (starterProduct) {
      orderedProducts.push({
        ...planMap['Starter'],
        stripeProduct: starterProduct,
        price: `$${starterProduct.price}`,
        priceId: starterProduct.priceId
      });
    }
    
    // Find and add Growth second
    const growthProduct = products.find(p => p.name === 'Growth');
    if (growthProduct) {
      orderedProducts.push({
        ...planMap['Growth'],
        stripeProduct: growthProduct,
        price: `$${growthProduct.price}`,
        priceId: growthProduct.priceId
      });
    }
    
    // Find and add Enterprise third
    const enterpriseProduct = products.find(p => p.name === 'Enterprise');
    if (enterpriseProduct) {
      orderedProducts.push({
        ...planMap['Enterprise'],
        stripeProduct: enterpriseProduct,
        price: `$${enterpriseProduct.price}`,
        priceId: enterpriseProduct.priceId
      });
    }
    
    return orderedProducts.length > 0 ? orderedProducts : plans;
  };

  const displayPlans = getOrderedProducts();
  
  return (
    <div className="flex flex-col items-center p-2 lg:p-8 justify-center relative bg-[url('/home/bgimg.png')] mt-12 bg-no-repeat bg-cover bg-center w-full mb-8 rounded-lg border border-[#FFFFFF0F]">
      {/* Header */}
      <p className="bg-[#FFFFFF0F] text-[14px] text-[#A7AABB] border border-white/20  w-[150px] px-6 py-2 rounded-full flex flex-row items-center gap-2 justify-center">
        <img src="/home/star.png" alt="img" />
        PRICING
        <img src="/home/star.png" alt="img" />
      </p>
      <h1 className="text-[24px] lg:text-[48px] font-300 text-center leading-[60px] mt-8 font-medium">
        Choose Your Neural{" "}
        <span className="font-inter font-bold bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] bg-clip-text text-transparent">
          Advantage
        </span>
      </h1>
      <p className="text-[#A7AABB] text-center text-[16px] mt-4 mb-12 max-w-2xl">
        Transform your marketing with cognitive precision. Every tier unlocks
        deeper insight into how your audience thinks, decides, and acts.
      </p>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 w-full w-full  lg:max-w-7xl items-center">
        {displayPlans.map((plan, index) => (
         <div
  key={index}
  className={`relative rounded-lg border border-[#FFFFFF0F] bg-[#0A0B0D] p-8 flex flex-col justify-between transition-all duration-300 
  ${plan.highlight
  ? "bg-[linear-gradient(to_bottom,_#0E1D20_20%,_rgba(10,149,163,0.8)_100%)] h-auto lg:h-[910px] border-t-8 border-t-[#12DCF0] shadow-[0_15px_80px_-5px_rgba(18,220,240,0.4)]"
  : " hover:shadow-[0_8px_20px_-5px_rgba(18,220,240,0.2)] h-auto lg:h-[880px]"
}

  `}
>
          
            {plan.tag && (
              <span className="absolute top-4 right-4 bg-[#12DCF0] text-black px-3 py-1 text-xs font-semibold rounded-full">
                {plan.tag}
              </span>
            )}
            <div>
              <h2 className="text-[24px] font-normal text-whit flex flex-row items-center gap-3"> 
                <img src={plan.icon} alt="img"/>
                {plan.title}</h2>
              <div className="flex items-end gap-1 mt-4">
                <span className="text-4xl text-white">{plan.price}</span>
                <span className="text-sm text-[#A7AABB]">{plan.duration}</span>
              </div>
              <p className="mt-4  text-[15px] text-[18px]">{plan.description}</p>
              <p className="mt-2 text-[#A7AABB] text-[14px]">{plan.details}</p>
              <ul className="mt-6 space-y-3">
                <h1>Includes:</h1>
                {plan.includes.map((item, i) => (
                  <li key={i} className="text-[#A7AABB] text-sm flex gap-2">
                    <span className="text-[#12DCF0] flex flex-row items-center gap-2"><Check size={16}/></span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 text-sm text-[#A7AABB]">
                            <h1 className="text-white mb-4">Best for:</h1>

                {` ${plan.bestFor}`}</div>
            <Link to="/signup">
              <button
                className={`mt-6 px-5 py-3 text-sm rounded-full font-bold flex items-center cursor-pointer justify-center ${
                  plan.highlight
                    ? "bg-[linear-gradient(to_right,_#1FC3F9,_#6AEFFB)]  text-black gap-3"
                    : "border border-[#12DCF0] text-[#12DCF0] hover:bg-[#12dcf010] text-white gap-3 "
                }`}
              >
                {plan.button}
                <ArrowRight/>
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;