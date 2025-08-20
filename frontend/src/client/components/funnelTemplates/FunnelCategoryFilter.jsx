import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFunnelCategories,
  selectFunnelCategories,
  selectFunnelCategoriesLoading,
} from "../../../store/Slice/FunnelSequenceSlice";

export default function FunnelCategoryFilter({ value, onChange }) {
  const dispatch = useDispatch();
  const cats = useSelector(selectFunnelCategories);
  const loading = useSelector(selectFunnelCategoriesLoading);

  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFunnelCategories());
  }, [dispatch]);

  const list = useMemo(() => ["All Categories", ...(cats || [])], [cats]);

  useEffect(() => {
    const onDoc = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function selectItem(label) {
    onChange(label === "All Categories" ? "" : label);
    setOpen(false);
    btnRef.current?.focus();
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full bg-[#16161C] text-[#B0B0B0] px-4 py-3 border border-[#444] text-left flex items-center justify-between
          ${open ? "ring-1 ring-cyan-400 border-cyan-400" : ""}`}
      >
        <span>{loading ? "Loading…" : value || "All Categories"}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute mt-1 w-full z-50 max-h-72 overflow-auto bg-[#16161C] border border-[#444] shadow-xl">
          {list.map((it, idx) => (
            <div
              key={it}
              className={`px-4 py-2 cursor-pointer text-sm ${
                idx === activeIdx ? "bg-[#292933] text-white" : "text-[#B0B0B0]"
              } ${((!value && it === "All Categories") || it === value) ? "font-semibold" : ""}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectItem(it)}
            >
              {it}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
