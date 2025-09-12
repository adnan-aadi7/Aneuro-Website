import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/emailSequences/Header";
import AnalyticalBrainEmail from "../../components/emailSequences/AnalyticalBrainEmail";
import {
  // fetchEmailSequences,
  // selectEmailSequences,
  selectEmailSequenceLoading,
  selectEmailSequenceStats,
  fetchGroupedEmailsByTier,
} from "../../../store/Slice/EmailSequenceSLice";

export default function EmailSequencePage() {
  const dispatch = useDispatch();
  const { grouped = {} } = useSelector(selectEmailSequenceStats);
  const loading = useSelector(selectEmailSequenceLoading);

  const [activeTab, setActiveTab] = useState("Architect");
  const [category, setCategory] = useState("");

 useEffect(() => {
    // 🔑 Read tier from localStorage
    const storedUser = localStorage.getItem("user");
    let tier = "starter"; // fallback default

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Example: assuming `subscription.plan` holds tier
        tier = parsed?.subscription?.plan || tier;
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }

    dispatch(fetchGroupedEmailsByTier({ tier, category }));
  }, [dispatch, activeTab, category]);
  // Compute sequences for the active brain type with optional category filter
  const filtered = useMemo(() => {
    const list = grouped?.[activeTab] || [];
    if (!category) return list;
    return list.filter((s) => (s.category || "").toLowerCase() === category.toLowerCase());
  }, [grouped, activeTab, category]);

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnalyticalBrainEmail
        sequences={filtered}
        loading={loading}
        category={category}
        onCategoryChange={setCategory}
        activeTab={activeTab}
      />
    </>
  );
}
