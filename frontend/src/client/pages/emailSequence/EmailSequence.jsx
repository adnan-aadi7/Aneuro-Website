import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/emailSequences/Header";
import AnalyticalBrainEmail from "../../components/emailSequences/AnalyticalBrainEmail";
import CategoryFilter from "../../components/emailSequences/CategoryFilter";
import {
  fetchEmailSequences,
  selectEmailSequences,
  selectEmailSequenceLoading,
} from "../../../store/Slice/EmailSequenceSLice";

export default function EmailSequencePage() {
  const dispatch = useDispatch();
  const sequences = useSelector(selectEmailSequences);
  const loading = useSelector(selectEmailSequenceLoading);

  const [activeTab, setActiveTab] = useState("Architect");
  const [category, setCategory] = useState("");

  // fetch on mount + whenever tab/category changes (server-side filters if supported)
  useEffect(() => {
    dispatch(fetchEmailSequences({ brainType: activeTab, category }));
  }, [dispatch, activeTab, category]);

  // If backend doesn't filter by brainType/category, keep this as a safety net
  const filtered = useMemo(() => {
    return (sequences || []).filter((s) => {
      const okBrain = activeTab ? s.brainType === activeTab : true;
      const okCat = category ? (s.category || "").toLowerCase() === category.toLowerCase() : true;
      return okBrain && okCat;
    });
  }, [sequences, activeTab, category]);

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
