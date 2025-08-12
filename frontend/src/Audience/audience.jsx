import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toastError } from "../toast"

const questions = [
  {
    id: 1,
    text: "When you’re faced with a big decision, what helps you feel most confident?",
    options: [
      "Weighing pros and cons logically",        // A
      "Talking it through with someone",         // B
      "Acting on gut instinct",                  // C
      "Researching options thoroughly first",    // D
    ],
  },
  {
    id: 2,
    text: "When browsing online, what catches your attention first?",
    options: [
      "Clean design and structure",              // A
      "Catchy headlines or emotional phrases",   // B
      "Bold visuals or unique layouts",          // C
      "Helpful features or detailed info",       // D
    ],
  },
  {
    id: 3,
    text: "How do you typically shop for something new?",
    options: [
      "Read reviews, compare features",          // A
      "Ask people I trust for their opinions",   // B
      "Go with what feels exciting or different",// C
      "Stick with brands I’ve used before",      // D
    ],
  },
  {
    id: 4,
    text: "If someone gives you vague instructions, what’s your instinct?",
    options: [
      "Ask follow-up questions",                 // A
      "Try to interpret what they meant",        // B
      "Just start and figure it out along the way", // C
      "Look for a similar example to guide me",  // D
    ],
  },
  {
    id: 5,
    text: "How do you prefer to learn something new?",
    options: [
      "Step-by-step instructions or walkthroughs", // A
      "Watching videos or listening to someone explain", // B
      "Playing around with it until I get it",   // C
      "Reading in-depth info and taking notes",  // D
    ],
  },
  {
    id: 6,
    text: "How do you feel about multitasking?",
    options: [
      "I prefer to focus on one thing at a time", // A
      "I’m good at jumping between tasks",        // B
      "I get bored easily, so I like variety",    // C
      "I can multitask, but I still need structure", // D
    ],
  },
  {
    id: 7,
    text: "What’s your relationship with your to-do list?",
    options: [
      "I live by it—everything is planned",      // A
      "I use it loosely when needed",            // B
      "I rarely make one unless it’s urgent",    // C
      "I have one, but it’s mostly in my head",  // D
    ],
  },
  {
    id: 8,
    text: "When trying to influence others, what’s your natural strength?",
    options: [
      "Explaining things clearly and rationally", // A
      "Telling stories and connecting emotionally", // B
      "Inspiring with energy or bold ideas",     // C
      "Providing proof, data, or examples",      // D
    ],
  },
  {
    id: 9,
    text: "What motivates you most when starting a new project?",
    options: [
      "Knowing the outcome or purpose",          // A
      "The excitement of trying something new",  // B
      "Being part of a collaborative effort",    // C
      "Seeing how it fits into a bigger picture",// D
    ],
  },
  {
    id: 10,
    text: "How often do you reflect on why you do things the way you do?",
    options: [
      "All the time—I analyze my patterns",      // A
      "Sometimes, if something goes wrong",      // B
      "Not often—I just keep moving",            // C
      "Only when I’m prompted to stop and think",// D
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
  // state (near your other useStates)
  const [submitting, setSubmitting] = useState(false);




  // inside Audience component (top-level, after state)
  const { userId } = useParams(); // from /Audience-quiz/:userId
  const API_BASE = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000

  const optionLetter = (i) => String.fromCharCode(65 + i);


  // keep your axios sendAnswer; just rethrow a clean error
  const sendAnswer = async ({ question_number, selected_option }) => {
    try {
      const res = await axios.post(`${API_BASE}/api/quiz/start`, {
        user_id: userId,
        name: formData.name,
        email: formData.email,
        question_number,
        selected_option,
      });
      console.log("quiz/start response:", res.data);
      return res.data;
    } catch (e) {
      // bubble up a readable message
      throw new Error(e?.response?.data?.error || e.message || "Request failed");
    }
  };






  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 10000); // Show form after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // replace handleOptionSelect with this
  const handleOptionSelect = async (index) => {
    if (submitting) return; // avoid double clicks
    setSelectedOption(index);
    setSubmitting(true);

    try {
      // sanity checks (fail fast)
      if (!API_BASE || !userId || !formData.name || !formData.email) {
        throw new Error("Missing info: make sure name, email, and link are valid.");
      }

      await sendAnswer({
        question_number: currentQuestionIndex + 1,
        selected_option: optionLetter(index),
      });

      const isLastQuestion = currentQuestionIndex === questions.length - 1;

      if (!isLastQuestion) {
        setTimeout(() => {
          setSelectedOption(null);
          setCurrentQuestionIndex((prev) => prev + 1);
          setSubmitting(false);
        }, 800);
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      // do NOT advance; just show toast
      toastError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
      // optional: allow re-click on same option
      // setSelectedOption(null);
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
                  disabled={submitting}
                  className={`px-4 py-4 text-left font-medium text-[14px] border transition cursor-pointer ${selectedOption === index
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
