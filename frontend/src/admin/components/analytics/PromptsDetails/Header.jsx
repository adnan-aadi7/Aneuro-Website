import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromptPackById } from "../../../../store/Slice/PromptPacksSlice";

const Header = ({ packId }) => {
  const dispatch = useDispatch();
  const { currentPack, loading } = useSelector((state) => state.promptPack);

  useEffect(() => {
    if (packId) {
      dispatch(fetchPromptPackById(packId));
    }
  }, [dispatch, packId]);

  if (!packId) {
    return (
      <div className="bg-[#19191F]   pb-6">
        <div className="text-2xl md:text-3xl font-semibold text-white leading-tight">
          Prompt Pack Details
        </div>
        <div className="text-base text-gray-400 mt-2">
          Please select a prompt pack to view details
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#19191F]   pb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-5 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const title = currentPack?.name || "Prompt Pack Details";
  const subtitle = currentPack?.description || "Manage all content drops and user access";

  return (
    <div className="   pb-6">
      <div className="text-2xl md:text-3xl font-semibold text-white leading-tight">
        {title}
      </div>
      <div className="text-base text-gray-400 mt-2">
        {subtitle}
      </div>
    </div>
  );
};

export default Header;
