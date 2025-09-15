import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFunnelTemplateById,
  selectCurrentFunnelTemplate,
  selectFunnelTemplateLoading,
} from "../../../../store/Slice/FunnelSequenceSlice";

const Header = ({ templateId }) => {
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentFunnelTemplate);
  const loading = useSelector(selectFunnelTemplateLoading);

  useEffect(() => {
    if (templateId) {
      dispatch(fetchFunnelTemplateById(templateId));
    }
  }, [dispatch, templateId]);

  return (
    <div className="pb-6">
      <div className="text-3xl md:text-4xl font-semibold text-white leading-tight">
        {loading
          ? "Loading..."
          : template?.name
          ? `${template.name}`
          : "Funnel Template – Details"}
      </div>
       <div className="text-base text-gray-400 mt-2">
      Manage all content drops and user access
    </div>
    </div>
  );
};

export default Header;
