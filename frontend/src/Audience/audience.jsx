import { X } from "lucide-react";
import React, { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    text: "When you're faced with a big decision, what helps you feel most confident?",
    options: [
      "Weighing pros and cons logically",
      "Acting on gut instinct",
      "Talking it through with someone",
      "Researching options thoroughly first",
    ],
  },
  {
    id: 2,
    text: "What motivates you the most when working on a team project?",
    options: [
      "Achieving the goal",
      "Helping others succeed",
      "Being recognized for your input",
      "Solving complex problems",
    ],
  },
];

const Audience = () => {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [finished, setFinished] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 10000); // Show form after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (!isLastQuestion) {
      setTimeout(() => {
        setSelectedOption(null);
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 800);
    }
  };

  const handleFinish = () => setFinished(true);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setShowQuestion(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden rounded-lg px-[5%]">
      <div className="absolute w-[90%] h-[93%] rounded-full blur-2xl opacity-30 z-0 bg-[radial-gradient(circle,_rgba(34,211,238,1)_0%,_transparent_60%)]" />

      {!showForm && !formSubmitted ? (
        // 🕒 Welcome Screen
        <div className="flex flex-col items-center justify-center gap-5 pb-16 relative bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat text-center text-white px-6 py-10 rounded-xl z-10 shadow-lg lg:w-[36%]">
          <img src="/welcome.png" alt="Welcome" />
          <h2 className="text-[20px] md:text-[40px] font-medium mt-10">Just A Few Questions</h2>
          <p className="text-[14px] lg:text-[16px] leading-relaxed px-12">
            This won’t take long — just a handful of simple, intuitive questions about how you naturally think and make decisions. Trust your instincts and enjoy the ride.
          </p>
        </div>
      ) : !formSubmitted ? (
        // ✏️ Name + Email Form
        <form
          onSubmit={handleFormSubmit}
          className="relative bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat text-white px-6 py-10 rounded-xl z-10 shadow-lg w-[98%] md:w-[500px] flex flex-col gap-5 items-center"
        >
          <img src="/logo.png" alt="Logo" className="h-20 mb-4" />
          <input
            name="name"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded bg-transparent border border-[#12DCF0] text-white placeholder-gray-400 outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded bg-transparent border border-[#12DCF0] text-white placeholder-gray-400 outline-none"
          />
          <button
            type="submit"
            className="mt-4 cursor-pointer bg-[#12DCF0] text-black px-12 py-3 rounded font-semibold hover:bg-cyan-300 transition"
          >
            Next
          </button>
        </form>
      ) : finished ? (
        // 🎉 Finish Screen
        <div className="relative text-white text-center bg-black p-8 z-10 h-[400px] w-[98%] md:w-[45%] flex flex-col items-center justify-center">
          <div className="absolute top-8 right-8 cursor-pointer"><X /></div>
          <img src="/Frame 1000004776.png" alt="img" className="w-32 h-32" />
          <h1 className="text-[20px] md:text-[32px] font-bold mb-4">
            That’s a wrap! thanks for <br />sharing your mind with us
          </h1>
          <p className="font-medium opacity-80">You are good to go</p>
        </div>
      ) : (
        // 📋 MCQ Questions
        <div className="relative h-auto bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat text-white md:px-6 py-10 rounded-xl z-10 shadow-lg w-[98%] md:w-[600px]">
          <div className="flex flex-col gap-6 px-4">
            <img src="/logo.png" alt="Logo" className="mx-auto h-24" />
            <h2 className="text-left text-base font-normal leading-relaxed">
              <span className="font-medium text-[16px]">
                {currentQuestionIndex + 1}.
              </span>{" "}
              {currentQuestion.text}
            </h2>

            <div className="flex flex-col gap-5">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`px-4 py-4 text-left font-medium text-[14px] border transition cursor-pointer ${
                    selectedOption === index
                      ? "bg-[#12DCF0] text-black"
                      : "border-[#12DCF0]"
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

{currentQuestionIndex === questions.length - 1 && (
              <div className="flex items-center justify-center">
                <button
                  onClick={handleFinish}
                  className="mt-6 bg-[#12DCF0] text-black px-8 py-3 rounded font-semibold hover:bg-cyan-300 transition"
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Audience;
