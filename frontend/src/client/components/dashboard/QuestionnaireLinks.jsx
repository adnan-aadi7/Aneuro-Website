import { useSelector } from "react-redux";
import React, { useRef, useState } from "react";

const QuestionnaireLinks = () => {
  const shareRef = useRef(null);
  const redirectRef = useRef(null);



  // NEW: get the logged-in userId from Redux
  // Get userId from Redux
  const userId = useSelector((state) => state.user?.user?.id);

  // Build the dynamic link
  const shareUrl = userId
    ? `${window.location.origin}/Audience-quiz/${userId}`
    : `${window.location.origin}/Audience-quiz`;


  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedRedirect, setCopiedRedirect] = useState(false);
  const [editableShare, setEditableShare] = useState(false);
  const [editableRedirect, setEditableRedirect] = useState(false);

  const handleCopy = async (ref, onSuccess) => {
    try {
      const value = ref.current?.value || "";
      if (!value) return;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (ref.current) {
        ref.current.select();
        document.execCommand("copy");
      }
      if (typeof onSuccess === "function") onSuccess();
    } catch {
      // no-op
    }
  };

  // Inner shadow style for the main container
  const mainInnerShadow = {
    boxShadow: "inset 0 0 50px 0 rgba(18,220,240,0.25)",
  };

  return (
    <div
      className="bg-gradient-to-b from-[#2A2A39]/80 to-[#232432] p-2 md:p-8 flex flex-col gap-8 w-full max-w-[365px] md:max-w-full md:mx-auto mt-15"
      style={mainInnerShadow}
    >
      {/* Share Questionnaire */}
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="flex-1 min-w-[180px] md:min-w-[220px]">
          <div className="text-white text-base md:text-lg font-semibold mb-1">
            Share Questionnaire
          </div>
          <div className="text-gray-400 text-sm md:text-base mb-3">
            Let's make the day productive
          </div>
        </div>
        <div className="flex-1 px-2 py-1">
          <div className="flex items-stretch border border-gray-400 overflow-hidden h-11">
            <input
              ref={shareRef}
              type="text"
              readOnly={!editableShare}
              value={shareUrl}
              className="flex-1 bg-transparent px-4 text-white text-sm md:text-base truncate focus:outline-none"
            />
            <button
              className="px-2 mx-1 my-1 text-white hover:bg-white/5"
              title="Edit"
              onClick={() => {
                setEditableShare((e) => !e);
                setTimeout(() => shareRef.current && shareRef.current.focus(), 0);
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                <path
                  d="M14.85 2.85a2.121 2.121 0 0 1 3 3l-9.5 9.5-3.5.5.5-3.5 9.5-9.5Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="px-4 bg-cyan-400 hover:bg-cyan-300 text-[#232432] font-semibold"
              onClick={() =>
                handleCopy(shareRef, () => {
                  setCopiedShare(true);
                  setTimeout(() => setCopiedShare(false), 1500);
                })
              }
            >
              {copiedShare ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
      {/* Redirect Link */}
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="flex-1 min-w-[180px] md:min-w-[220px]">
          <div className="text-white text-base md:text-lg font-semibold mb-1">
            Redirect Link
          </div>
          <div className="text-gray-400 text-sm md:text-base mb-3">
            Let's redirect the audience
          </div>
        </div>
        <div className="flex-1 px-2 py-1">
          <div className="flex items-stretch border border-gray-400  overflow-hidden h-11">
            <input
              ref={redirectRef}
              type="text"
              readOnly={!editableRedirect}
              value="https://clientsite.com/thank-you"
              className="flex-1 bg-transparent px-4 text-white text-sm md:text-base truncate focus:outline-none"
            />
            <button
              className="px-2 mx-1 my-1 text-white hover:bg-white/5"
              title="Edit"
              onClick={() => {
                setEditableRedirect((e) => !e);
                setTimeout(() => redirectRef.current && redirectRef.current.focus(), 0);
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                <path
                  d="M14.85 2.85a2.121 2.121 0 0 1 3 3l-9.5 9.5-3.5.5.5-3.5 9.5-9.5Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="px-4 bg-cyan-400 hover:bg-cyan-300 text-[#232432] font-semibold"
              onClick={() =>
                handleCopy(redirectRef, () => {
                  setCopiedRedirect(true);
                  setTimeout(() => setCopiedRedirect(false), 1500);
                })
              }
            >
              {copiedRedirect ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireLinks;
