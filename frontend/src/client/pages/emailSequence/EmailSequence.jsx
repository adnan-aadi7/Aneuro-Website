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

  // Fetch grouped emails when tab/category changes (or on mount)
  useEffect(() => {
    const tier = "starter"; // default tier for client view
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
