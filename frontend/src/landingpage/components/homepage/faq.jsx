import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "Is my customer data safe and encrypted with Aneuro?",
    answer:
      "Absolutely. Aneuro uses industry-standard encryption and security protocols to keep your data safe and private.",
  },
  {
    question: "Can I try Aneuro before committing to a plan?",
    answer:
      "Yes, you can explore Aneuro’s features with a free trial before choosing a plan.",
  },
  {
    question: "Is Aneuro compatible with my current CRM or tools?",
    answer:
      "Absolutely. Aneuro integrates smoothly with popular CRMs, analytics, and automation platforms.",
  },
  {
    question: "What audience data does Aneuro use to generate insights?",
    answer:
      "Aneuro uses anonymized audience engagement, behavioral, and demographic data to provide actionable insights.",
  },
  {
    question: "How does Aneuro personalize marketing using brain types?",
    answer:
      "Aneuro analyzes user responses to identify brain types and tailors marketing strategies for maximum engagement.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-black py-20 px-4 md:px-12 text-white font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="absolute left-[28%] w-[600px] h-[500px] rounded-full -top-32 z-0">
          <img src="/home/Ellipse 33.png" alt="img" />
        </div>
        {/* Left - Brain Image Card */}
        <div
          style={{
            backgroundImage: "url('/home/faq-brain.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="z-10 bg-[#0a0c2c] hidden lg:flex relative h-[600px] rounded-lg p-6 mx-auto w-full max-w-md text-center"
        >
          {/* User Ratings */}
          <div className="flex items-center justify-center mt-6 space-x-3 absolute bottom-6">
            <img src="/home/OverlayBlur.svg" alt="img" />
          </div>
        </div>

        {/* Right - FAQ Content */}
        <div className=" z-10 w-full">
          <p className="text-[14px] text-[#A7AABB] bg-[#FFFFFF0F] border border-white/20  w-[140px] px-6 py-2 rounded-full flex flex-row items-center gap-2 justify-center">
            <img src="/home/star.png" alt="img" />
            FAQ'S
            <img src="/home/star.png" alt="img" />
          </p>
          <h2 className="text-3xl md:text-4xl mb-8 mt-6 font-normal">
            Still Have{" "}
            <span className="font-inter font-bold bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>

          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => toggleIndex(idx)}
                  className="bg-[#1B1B1B33] border border-[#FFFFFF0F] p-5 rounded-xl cursor-pointer transition-all duration-300 "
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-base md:text-lg">{faq.question}</h3>
                    <ArrowUpRight
                      className={`text-[#00E1FF] w-5 h-5 mt-1 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </div>
                  {isOpen && faq.answer && (
                    <>
                      <hr className="border-none h-[1px] mt-2 w-full bg-[#FFFFFF0F]" />
                      <p className="text-sm text-gray-400 mt-3">{faq.answer}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
