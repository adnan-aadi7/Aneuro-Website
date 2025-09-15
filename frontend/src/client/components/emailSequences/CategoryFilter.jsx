import React, { useEffect, useState } from "react";
import axios from "../../../store/axiosInstance";
import { ChevronDown } from "lucide-react";

export default function CategoryFilter({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Read user from localStorage
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const tier = user?.subscription?.plan?.toLowerCase() || "starter";

        const { data } = await axios.get(
          `/email-sequences/grouped?tier=${encodeURIComponent(tier)}`
        );

        const grouped = data?.data || {};
        console.log("grouped", grouped);

        // Derive unique categories
        const unique = new Set();
        Object.values(grouped).forEach((arr) => {
          (arr || []).forEach((item) => {
            if (item?.category) unique.add(item.category);
          });
        });

        setCategories(Array.from(unique));
      } catch (e) {
        console.log("Category fetch error:", e);
        setCategories([]); // fail soft
      }
    })();
  }, []);

  return (
    <div className="relative">
      <select
        className="w-full bg-[#16161C] text-[#B0B0B0] px-4 py-3 appearance-none cursor-pointer focus:outline-none border border-[#444]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B0B0] pointer-events-none" />
    </div>
  );
}
