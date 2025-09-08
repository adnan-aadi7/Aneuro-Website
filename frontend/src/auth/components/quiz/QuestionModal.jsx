// src/components/quiz/QuestionModal.jsx
import React from "react";
import { X, ArrowLeft } from "lucide-react";

/**
 * Single reusable question modal (keeps your existing visual style)
 * - Auto-advance is handled by parent after onSelect
 * - No "Next" button (matches your design); only Back and Submit on last
 */
export default function QuestionModal({
  title = "QUESTION",
  question = "",
  options = [],
  letters = [],
  selectedLetter = null,
  onSelect,
  onBack,
  onClose,
  onSubmit,
  saving = false,
  isLast = false,
}) {
  const handleClick = async (i) => {
    if (saving) return;
    const letter = letters[i] || null;
    if (!letter) return;
    await onSelect?.(letter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dark background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
      {/* Modal content */}
      <div className="relative z-10 bg-black rounded-xl p-8 shadow-xl w-full max-w-xl mx-4">
        {/* Top bar with arrows and close */}
        <div className="flex items-center justify-between mb-6">
          <button
            className={`text-white hover:text-cyan-400 transition ${!onBack ? "opacity-30 cursor-default" : ""}`}
            onClick={onBack}
            disabled={!onBack}
            aria-label="Back"
          >
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-wide text-center flex-1">
            {title}
          </h2>
          {onClose ? (
            <button
              className="text-white hover:text-cyan-400 transition"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={28} />
            </button>
          ) : (
            <span className="w-[28px] h-[28px] inline-block" aria-hidden="true" />
          )}
        </div>

        {/* Question text */}
        <p className="text-white text-base mb-8 text-center">{question}</p>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {options.map((opt, i) => {
            const isSelected = selectedLetter === letters[i];
            return (
              <button
                key={opt}
                onClick={() => handleClick(i)}
                disabled={saving}
                className={`w-full text-left px-6 py-4 rounded-none border transition font-medium text-base
                  ${
                    isSelected
                      ? "bg-cyan-400 text-black border-cyan-400"
                      : "bg-transparent text-white border border-[#12DCF0] hover:bg-cyan-900/20"
                  }
                `}
                style={{ borderRadius: 0 }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Submit on last */}
        {isLast && (
          <div className="flex justify-end mt-8">
            <button
              onClick={onSubmit}
              disabled={saving || !selectedLetter}
              className="bg-cyan-400 text-black font-semibold px-8 py-3 rounded-md text-lg hover:bg-cyan-300 transition-all disabled:opacity-60"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
