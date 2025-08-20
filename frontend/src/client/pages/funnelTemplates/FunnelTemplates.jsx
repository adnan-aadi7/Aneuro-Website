import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/funnelTemplates/Header";
import FunnelStructure from "../../components/funnelTemplates/FunnelStructure";
import {
  fetchFunnelTemplates,
  selectFunnelTemplates,
  selectFunnelTemplateLoading,
} from "../../../store/Slice/FunnelSequenceSlice";

const FunnelTemplates = () => {
  const dispatch = useDispatch();
  const templates = useSelector(selectFunnelTemplates);
  const loading = useSelector(selectFunnelTemplateLoading);

  const [activeTab, setActiveTab] = useState("Architect");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(fetchFunnelTemplates({ brainType: activeTab, category }));
    console.log('====================================');
    console.log(templates);
    console.log('====================================');
  }, [dispatch, activeTab, category]);

  // client-side fallback
  const filtered = useMemo(() => {
    return (templates || []).filter((t) => {
      const okBrain = activeTab ? t.brainType === activeTab : true;
      const okCat = category ? (t.category || "").toLowerCase() === category.toLowerCase() : true;
      return okBrain && okCat;
    });
  }, [templates, activeTab, category]);

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <FunnelStructure
        templates={filtered}
        loading={loading}
        activeTab={activeTab}
        category={category}
        onCategoryChange={setCategory}
      />
    </>
  );
};

export default FunnelTemplates;
