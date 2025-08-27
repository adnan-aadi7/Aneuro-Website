import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toastError } from "../toast";

const questions = [
  {
    id: 1,
    text: "When you’re faced with a big decision, what helps you feel most confident?",
    options: [
      "Weighing pros and cons logically",
      "Talking it through with someone",
      "Acting on gut instinct",
      "Researching options thoroughly first",
    ],
  },
  {
    id: 2,
    text: "When browsing online, what catches your attention first?",
    options: [
      "Clean design and structure",
      "Catchy headlines or emotional phrases",
      "Bold visuals or unique layouts",
      "Helpful features or detailed info",
    ],
  },
  {
    id: 3,
    text: "How do you typically shop for something new?",
    options: [
      "Read reviews, compare features",
      "Ask people I trust for their opinions",
      "Go with what feels exciting or different",
      "Stick with brands I’ve used before",
    ],
  },
  {
    id: 4,
    text: "If someone gives you vague instructions, what’s your instinct?",
    options: [
      "Ask follow-up questions",
      "Try to interpret what they meant",
      "Just start and figure it out along the way",
      "Look for a similar example to guide me",
    ],
  },
  {
    id: 5,
    text: "How do you prefer to learn something new?",
    options: [
      "Step-by-step instructions or walkthroughs",
      "Watching videos or listening to someone explain",
      "Playing around with it until I get it",
      "Reading in-depth info and taking notes",
    ],
  },
  {
    id: 6,
    text: "How do you feel about multitasking?",
    options: [
      "I prefer to focus on one thing at a time",
      "I’m good at jumping between tasks",
      "I get bored easily, so I like variety",
      "I can multitask, but I still need structure",
    ],
  },
  {
    id: 7,
    text: "What’s your relationship with your to-do list?",
    options: [
      "I live by it—everything is planned",
      "I use it loosely when needed",
      "I rarely make one unless it’s urgent",
      "I have one, but it’s mostly in my head",
    ],
  },
  {
    id: 8,
    text: "When trying to influence others, what’s your natural strength?",
    options: [
      "Explaining things clearly and rationally",
      "Telling stories and connecting emotionally",
      "Inspiring with energy or bold ideas",
      "Providing proof, data, or examples",
    ],
  },
  {
    id: 9,
    text: "What motivates you most when starting a new project?",
    options: [
      "Knowing the outcome or purpose",
      "The excitement of trying something new",
      "Being part of a collaborative effort",
      "Seeing how it fits into a bigger picture",
    ],
  },
  {
    id: 10,
    text: "How often do you reflect on why you do things the way you do?",
    options: [
      "All the time—I analyze my patterns",
      "Sometimes, if something goes wrong",
      "Not often—I just keep moving",
      "Only when I’m prompted to stop and think",
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
  const [submitting, setSubmitting] = useState(false);

  // Theme from /api/customization/:userId
  const [theme, setTheme] = useState({
    primaryColor: "#12DCF0",
    secondaryColor: "#2A2A39",
    textColor: "#FFFFFF",
    borderColor: "#12DCF0",
    logoUrl: null,
    loading: true,
  });

  const { userId } = useParams(); // route: /Audience-quiz/:userId
  const API_BASE = import.meta.env.VITE_API_URL; // e.g. http://localhost:4000

  const optionLetter = (i) => String.fromCharCode(65 + i);

  // Fetch customization on mount/param change
  useEffect(() => {
    let ignore = false;

    const fetchCustomization = async () => {
      try {
        if (!API_BASE || !userId) return;
        const { data } = await axios.get(`${API_BASE}/api/customization/${userId}`);
        const payload = data?.data || {};

        // prefer logoVariants[0].url
        const logoFromVariants =
          Array.isArray(payload.logoVariants) && payload.logoVariants[0]?.url
            ? payload.logoVariants[0].url
            : null;

        if (ignore) return;
        setTheme((t) => ({
          ...t,
          primaryColor: payload.primaryColor || t.primaryColor,
          secondaryColor: payload.secondaryColor || t.secondaryColor,
          textColor: payload.textColor || t.textColor,
          borderColor: payload.borderColor || t.borderColor,
          logoUrl: logoFromVariants || payload.logo || payload.logoUrl || t.logoUrl || null,
          loading: false,
        }));
      } catch (err) {
        console.error("Customization fetch failed:", err?.response?.data || err);
        setTheme((t) => ({ ...t, loading: false }));
      }
    };

    fetchCustomization();
    return () => {
      ignore = true;
    };
  }, [API_BASE, userId]);

  // Auto show lead form after 10s
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Send answer
  const sendAnswer = async ({ question_number, selected_option }) => {
    const res = await axios.post(`${API_BASE}/api/quiz/start`, {
      user_id: userId,
      name: formData.name,
      email: formData.email,
      question_number,
      selected_option,
    });
    return res.data;
  };

  const handleOptionSelect = async (index) => {
    if (submitting) return;
    setSelectedOption(index);
    setSubmitting(true);

    try {
      if (!API_BASE || !userId || !formData.name || !formData.email) {
        throw new Error("Missing info: make sure name, email, and link are valid.");
      }

      await sendAnswer({
        question_number: currentQuestionIndex + 1,
        selected_option: optionLetter(index),
      });

      const isLast = currentQuestionIndex === questions.length - 1;
      if (!isLast) {
        setTimeout(() => {
          setSelectedOption(null);
          setCurrentQuestionIndex((p) => p + 1);
          setSubmitting(false);
        }, 800);
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      toastError(err?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleFinish = () => setFinished(true);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setShowQuestion(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Styles from theme
  const cardBorderStyle = { borderColor: theme.borderColor };
  const primaryBtnStyle = {
    backgroundColor: theme.primaryColor,
    color: theme.textColor?.toLowerCase?.() === "#ffffff" ? "#000" : theme.textColor,
  };
  const selectedOptionStyle = { backgroundColor: theme.primaryColor, color: "#000" };
  const optionBorderStyle = { borderColor: theme.borderColor, color: theme.textColor };

  return (
    <div
      className="min-h-screen bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden rounded-lg px-[5%]"
      style={{ color: theme.textColor }}
    >
      <div className="absolute w-[90%] h-[93%] rounded-full blur-2xl opacity-30 z-0 bg-[radial-gradient(circle,_rgba(34,211,238,1)_0%,_transparent_60%)]" />

      {!showForm && !formSubmitted ? (
        // 🕒 Welcome Screen
        <div
          className="flex flex-col items-center justify-center gap-5 pb-16 relative bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat text-center px-6 py-10 rounded-xl z-10 shadow-lg lg:w-[36%] border"
          style={cardBorderStyle}
        >
          <img src="/welcome.png" alt="Welcome" />
          <h2 className="text-[20px] md:text-[40px] font-medium mt-10">Just A Few Questions</h2>
          <p className="text-[14px] lg:text-[16px] leading-relaxed px-12 opacity-90">
            This won’t take long — just a handful of simple, intuitive questions about how you
            naturally think and make decisions. Trust your instincts and enjoy the ride.
          </p>
        </div>
      ) : !formSubmitted ? (
        // ✏️ Name + Email Form
        <form
          onSubmit={handleFormSubmit}
          className="relative bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat px-6 py-10 rounded-xl z-10 shadow-lg w-[98%] md:w-[500px] flex flex-col gap-5 items-center border"
          style={cardBorderStyle}
        >
          <img src={theme.logoUrl || "/logo.png"} alt="Logo" className="h-20 mb-4 object-contain" />
          <input
            name="name"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded bg-transparent border text-white placeholder-gray-400 outline-none"
            style={{ borderColor: theme.borderColor }}
          />
          <input
            name="email"
            type="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded bg-transparent border text-white placeholder-gray-400 outline-none"
            style={{ borderColor: theme.borderColor }}
          />
          <button
            type="submit"
            className="mt-4 cursor-pointer rounded font-semibold transition px-12 py-3"
            style={primaryBtnStyle}
          >
            Next
          </button>
        </form>
      ) : finished ? (
        // 🎉 Finish Screen
        <div
          className="relative text-center bg-black p-8 z-10 h-[400px] w-[98%] md:w-[45%] flex flex-col items-center justify-center rounded-xl border"
          style={cardBorderStyle}
        >
          {/* <div className="absolute top-8 right-8 cursor-pointer">
            <X />
          </div> */}
          <img src="/Frame 1000004776.png" alt="img" className="w-32 h-32" />
          <h1 className="text-[20px] md:text-[32px] font-bold mb-4">
            That’s a wrap! thanks for <br />
            sharing your mind with us
          </h1>
          <p className="font-medium opacity-80">You are good to go</p>
        </div>
      ) : (
        // 📋 MCQ Questions
        <div
          className="relative h-auto bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat md:px-6 py-10 rounded-xl z-10 shadow-lg w-[98%] md:w-[600px] border"
          style={cardBorderStyle}
        >
          <div className="flex flex-col gap-6 px-4">
            <img
              src={theme.logoUrl || "/logo.png"}
              alt="Logo"
              className="mx-auto h-24 object-contain"
            />
            <h2 className="text-left text-base font-normal leading-relaxed">
              <span className="font-medium text-[16px]">{currentQuestionIndex + 1}.</span>{" "}
              {questions[currentQuestionIndex].text}
            </h2>

            <div className="flex flex-col gap-5">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={submitting}
                  className="px-4 py-4 text-left font-medium text-[14px] border transition cursor-pointer rounded"
                  style={
                    selectedOption === index ? selectedOptionStyle : optionBorderStyle
                  }
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 && (
              <div className="flex items-center justify-center">
                <button
                  onClick={handleFinish}
                  className="mt-6 rounded font-semibold transition px-8 py-3"
                  style={primaryBtnStyle}
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
