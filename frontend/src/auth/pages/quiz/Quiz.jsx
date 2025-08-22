// src/pages/quiz/Quiz.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Login from "../login/Login";
import Welcome from "../../components/quiz/Welcome";
import QuestionModal from "../../components/quiz/QuestionModal";
import axios from "../../../store/axiosInstance";
import { useNavigate } from "react-router-dom";

const LETTERS = ["A", "B", "C", "D"];

// ---- 10 Questions (exact text you shared) ----
const QUESTIONS = [
  {
    number: 1,
    title: "QUESTION 1",
    text:
      "When you're faced with a big decision, what helps you feel most confident?",
    options: [
      "Weighing pros and cons logically",
      "Talking it through with someone",
      "Acting on gut instinct",
      "Researching options thoroughly first",
    ],
  },
  {
    number: 2,
    title: "QUESTION 2",
    text: "When browsing online, what catches your attention first?",
    options: [
      "Clean design and structure",
      "Catchy headlines or emotional phrases",
      "Bold visuals or unique layouts",
      "Helpful features or detailed info",
    ],
  },
  {
    number: 3,
    title: "QUESTION 3",
    text: "How do you typically shop for something new?",
    options: [
      "Read reviews, compare features",
      "Ask people I trust for their opinions",
      "Go with what feels exciting or different",
      "Stick with brands I've used before",
    ],
  },
  {
    number: 4,
    title: "QUESTION 4",
    text: "If someone gives you vague instructions, what's your instinct?",
    options: [
      "Ask follow-up questions",
      "Try to interpret what they meant",
      "Just start and figure it out along the way",
      "Look for a similar example to guide me",
    ],
  },
  {
    number: 5,
    title: "QUESTION 5",
    text: "How do you prefer to learn something new?",
    options: [
      "Step-by-step instructions or walkthroughs",
      "Watching videos or listening to someone explain",
      "Playing around with it until I get it",
      "Reading in-depth info and taking notes",
    ],
  },
  {
    number: 6,
    title: "QUESTION 6",
    text: "How do you feel about multitasking?",
    options: [
      "I prefer to focus on one thing at a time",
      "I'm good at jumping between tasks",
      "I get bored easily, so I like variety",
      "I can multitask, but I still need structure",
    ],
  },
  {
    number: 7,
    title: "QUESTION 7",
    text: "What's your relationship with your to-do list?",
    options: [
      "I live by it—everything is planned",
      "I use it loosely when needed",
      "I rarely make one unless it's urgent",
      "I have one, but it's mostly in my head",
    ],
  },
  {
    number: 8,
    title: "QUESTION 8",
    text: "When trying to influence others, what’s your natural strength?",
    options: [
      "Explaining things clearly and rationally",
      "Telling stories and connecting emotionally",
      "Inspiring with energy or bold ideas",
      "Providing proof, data, or examples",
    ],
  },
  {
    number: 9,
    title: "QUESTION 9",
    text: "What motivates you most when starting a new project?",
    options: [
      "Knowing the outcome or purpose",
      "The excitement of trying something new",
      "Being part of a collaborative effort",
      "Seeing how it fits into a bigger picture",
    ],
  },
  {
    number: 10,
    title: "QUESTION 10",
    text: "How often do you reflect on why you do things the way you do?",
    options: [
      "All the time—I analyze my patterns",
      "Sometimes, if something goes wrong",
      "Not often—I just keep moving",
      "Only when I'm prompted to stop and think",
    ],
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const reduxUser = useSelector((s) => s.user?.user);
  const userId =
    reduxUser?._id || reduxUser?.id || localStorage.getItem("userId") || "";

  const [step, setStep] = useState("welcome"); // 'welcome' | 'q' | 'login'
  const [idx, setIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState({}); // { [qNum]: "A" | "B" | "C" | "D" }

  const isFirst = idx === 0;
  const isLast = idx === QUESTIONS.length - 1;
  const current = useMemo(() => QUESTIONS[idx], [idx]);

  useEffect(() => {
    if (step === "welcome") {
      const t = setTimeout(() => setStep("q"), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleClose = () => setStep("login");

  const saveAnswer = async (questionNumber, selectedLetter) => {
    if (!userId) return; // if user not logged in yet, just keep local state
    setSaving(true);
    try {
      await axios.post("/quiz/save", {
        user_id: userId,
        question_number: questionNumber,
        selected_option: selectedLetter,
      });
      setAnswers((prev) => ({ ...prev, [questionNumber]: selectedLetter }));
    } catch (e) {
      console.error("Failed to save answer:", e?.response?.data || e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = async (letter) => {
    const qn = current.number;
    await saveAnswer(qn, letter);
    if (!isLast) {
      setTimeout(() => setIdx((i) => Math.min(i + 1, QUESTIONS.length - 1)), 150);
    }
  };

  const handleBack = () => {
    if (!isFirst) setIdx((i) => i - 1);
  };

  // Final submit → proceed to dashboard
  const handleSubmit = () => {
    navigate("/client/dashboard");
  };

  return (
    <>
      <Login />
      {step === "welcome" && <Welcome onClose={handleClose} />}

      {step === "q" && (
        <QuestionModal
          title={current.title}
          question={current.text}
          options={current.options}
          letters={LETTERS}
          selectedLetter={answers[current.number] || null}
          onSelect={handleSelect}          // click option → save + auto-advance (except last)
          onBack={!isFirst ? handleBack : undefined}
          onClose={handleClose}
          onSubmit={isLast ? handleSubmit : undefined} // last question shows Submit
          saving={saving}
          isLast={isLast}
        />
      )}
    </>
  );
}
