import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmailSequenceById } from "../../../../store/Slice/EmailSequenceSLice";

const Header = ({ sequenceId }) => {
  const dispatch = useDispatch();
  const { currentSequence, loading } = useSelector((state) => state.emailSequence);

  useEffect(() => {
    if (sequenceId) {
      dispatch(fetchEmailSequenceById(sequenceId));
    }
  }, [dispatch, sequenceId]);

  if (!sequenceId) {
    return (
      <div className="py-4">
        <h1 className="text-white text-3xl font-semibold mb-1">
          Email Sequence Details
        </h1>
        <p className="text-gray-400 text-base mt-3">
          Please select an email sequence to view details
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-1"></div>
          <div className="h-5 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const sequenceName = currentSequence?.name || "Email Sequence Details";
  const description = currentSequence?.description || "Manage all content drops and user access";

  return (
    <div className="py-4">
      <h1 className="text-white text-3xl font-semibold mb-1">
        {sequenceName}
      </h1>
      <p className="text-gray-400 text-base mt-3">
        {description}
      </p>
    </div>
  );
};

export default Header;
