import React, { useState, useRef, useEffect } from "react";
import { FiCalendar, FiChevronDown, FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { fetchQuizSessions } from "../../../../store/Slice/QuizSlice";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState({
    completion: true,
    incompletion: false,
  });
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCompletionChange = () => {
    const newState = { completion: !categories.completion, incompletion: false };
    setCategories(newState);

    // Fetch completed quizzes
    if (!categories.completion) {
      dispatch(fetchQuizSessions({ isCompleted: true }));
    }
  };

  const handleIncompletionChange = () => {
    const newState = { completion: false, incompletion: !categories.incompletion };
    setCategories(newState);

    // Fetch incompleted quizzes
    if (!categories.incompletion) {
      dispatch(fetchQuizSessions({ isCompleted: false }));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">
          Individual Quiz Submissions
        </h2>
        <div className="flex gap-3 mt-8 relative">
          {/* Date Picker Button */}
          <button className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#232432] font-medium px-4 py-2 rounded focus:outline-none">
            <FiCalendar size={18} />
            <span>04/09/2025</span>
            <FiChevronDown size={16} />
          </button>
          {/* Quiz Completion Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#232432] font-medium px-4 py-2 rounded focus:outline-none"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span>Quiz Category</span>
              <FiChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 mt-2 w-64 bg-[#232432] rounded-lg shadow-lg border border-[#2A2A39] z-50 p-4"
              >
                <label className="flex items-center gap-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.completion}
                    onChange={handleCompletionChange}
                    className="accent-cyan-400 w-5 h-5 rounded border-2 border-cyan-400 bg-transparent focus:ring-0"
                  />
                  <span className="text-white text-base">Quiz Completion</span>
                </label>
                <label className="flex items-center gap-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.incompletion}
                    onChange={handleIncompletionChange}
                    className="accent-cyan-400 w-5 h-5 rounded border-2 border-cyan-400 bg-transparent focus:ring-0"
                  />
                  <span className="text-white text-base">
                    Quiz In completion
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Search Input */}
      <div className="flex items-center w-full sm:w-80 mt-10">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#2A2A39] text-white rounded px-9 py-2 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
