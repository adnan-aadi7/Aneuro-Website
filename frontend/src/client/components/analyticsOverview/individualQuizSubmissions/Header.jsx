import React, { useEffect, useRef, useState } from "react";
import { FiCalendar, FiChevronDown, FiSearch } from "react-icons/fi";

export default function Header({ filters, onChangeFilters }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // local UI state mirrors parent filters
  const [categories, setCategories] = useState({
    completion: false,
    incompletion: false,
  });
  const [search, setSearch] = useState(filters.search || "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");

  const dropdownRef = useRef(null);
  const dateRef = useRef(null);

  // Default to showing completed quizzes on initial load
  useEffect(() => {
    if (filters.isCompleted == null) {
      onChangeFilters({ isCompleted: true });
      setCategories({ completion: true, incompletion: false });
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep local checkboxes in sync when parent isCompleted changes
  useEffect(() => {
    setCategories({
      completion: filters.isCompleted === true,
      incompletion: filters.isCompleted === false,
    });
  }, [filters.isCompleted]);

  // Close menus on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (dateOpen && dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [dropdownOpen, dateOpen]);

  const handleCompletionChange = () => {
    const next = !categories.completion;
    setCategories({ completion: next, incompletion: false });
    // update parent -> triggers refetch in parent useEffect
    onChangeFilters({ isCompleted: next ? true : null });
  };

  const handleIncompletionChange = () => {
    const next = !categories.incompletion;
    setCategories({ completion: false, incompletion: next });
    onChangeFilters({ isCompleted: next ? false : null });
  };

  // search: client-side
  const onSearchChange = (e) => {
    const v = e.target.value;
    setSearch(v);
    onChangeFilters({ search: v });
  };

  // date: client-side
  const applyDateFilter = () => {
    onChangeFilters({ dateFrom, dateTo });
    setDateOpen(false);
  };
  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
    onChangeFilters({ dateFrom: "", dateTo: "" });
  };

  const dateLabel =
    dateFrom || dateTo ? `${dateFrom || "…"} → ${dateTo || "…"}`
    : "Pick dates";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">
          Individual Quiz Submissions
        </h2>

        <div className="flex gap-3 mt-8 relative">
          {/* Date Picker Button */}
          <div className="relative" ref={dateRef}>
            <button
              className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#232432] font-medium px-4 py-2 rounded focus:outline-none"
              onClick={() => setDateOpen((v) => !v)}
            >
              <FiCalendar size={18} />
              <span>{dateLabel}</span>
              <FiChevronDown size={16} />
            </button>

            {dateOpen && (
              <div className="absolute left-0 mt-2 w-100 bg-[#232432] rounded-lg shadow-lg border border-[#2A2A39] z-50 p-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-300">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full bg-[#2A2A39] text-white rounded px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-300">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full bg-[#2A2A39] text-white rounded px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={clearDates}
                    className="px-3 py-2 text-xs border border-gray-500 rounded text-gray-300 hover:bg-[#2A2A39]"
                  >
                    Clear
                  </button>
                  <button
                    onClick={applyDateFilter}
                    className="px-3 py-2 text-xs bg-cyan-400 text-[#232432] rounded font-semibold hover:bg-cyan-300"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quiz Completion Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#232432] font-medium px-4 py-2 rounded focus:outline-none"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span>Quiz Category</span>
              <FiChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#232432] rounded-lg shadow-lg border border-[#2A2A39] z-50 p-4">
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
                  <span className="text-white text-base">Quiz In completion</span>
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
            value={search}
            onChange={onSearchChange}
            placeholder="Search"
            className="w-full bg-[#2A2A39] text-white rounded px-9 py-2 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
