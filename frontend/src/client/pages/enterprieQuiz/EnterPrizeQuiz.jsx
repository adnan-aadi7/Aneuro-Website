import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../components/enterprizeQuiz/Header";
import Quiz from "../../components/enterprizeQuiz/Quiz";
import QuizLink from "../../components/enterprizeQuiz/QuizLink";
import UploadLogo from "../../components/enterprizeQuiz/UploadLogo";
import Customizations from "../../components/enterprizeQuiz/Customizations";
import defaultLogo from "../../components/enterprizeQuiz/../../../assets/auth/logo.png";
import EnterPrizePopup from "../../components/enterprizeQuiz/EnterPrizePopup";

import { saveCustomization } from "../../../store/Slice/customizationSlice";

const EnterPrizeQuiz = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user || {});
  const { saving, error, lastSaved } = useSelector((s) => s.customization || {});

  const [primaryColor, setPrimaryColor] = useState("#2DD1D1");
  const [secondaryColor, setSecondaryColor] = useState("#FF6B35");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [borderColor, setBorderColor] = useState("#2DD1D1");

  const [displayLogo, setDisplayLogo] = useState(defaultLogo);
  const [uploadLogoFile, setUploadLogoFile] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    const subscriptionStr = localStorage.getItem("subscription");
    let plan = null;
    if (subscriptionStr) {
      try {
        const subscription = JSON.parse(subscriptionStr);
        plan = subscription?.plan;
      } catch {
        plan = null;
      }
    }
    if (plan !== "enterprise") {
      setShowPopup(true);
    }
  }, []);

  const userId = user?.id || localStorage.getItem("userId");

  const doSave = () => {
    if (!userId) return;
    dispatch(
      saveCustomization({
        userId,
        primaryColor,
        secondaryColor,
        textColor,
        borderColor,
        logo: uploadLogoFile instanceof File ? uploadLogoFile : undefined,
      })
    );
  };

  useEffect(() => {
    if (!userId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(doSave, 500);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryColor, secondaryColor, textColor, borderColor, uploadLogoFile, userId]);

  if (showPopup) {
    return <EnterPrizePopup onClose={() => {}} />;
  }

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#2A2A39] p-4 md:p-8">
        {/* Left side */}
        <div className="md:col-span-2">
          <Quiz
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            textColor={textColor}
            borderColor={borderColor}
            logo={displayLogo}
          />

          {/* QuizLink back in place */}
          <QuizLink />

          <div className="mt-3 text-sm">
            {saving && <span className="text-gray-300">Saving…</span>}
            {!saving && lastSaved && <span className="text-green-400">All changes saved.</span>}
            {error && <span className="text-red-400">Failed to save: {error}</span>}
          </div>
        </div>

        {/* Right side */}
        <div className="md:col-span-2 space-y-4">
          <UploadLogo
            setLogo={(val) => {
              if (val instanceof File) {
                setUploadLogoFile(val);
                const preview = URL.createObjectURL(val);
                setDisplayLogo(preview);
              } else if (typeof val === "string") {
                setDisplayLogo(val);
                setUploadLogoFile(null);
              }
            }}
          />

          <Customizations
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            textColor={textColor}
            setTextColor={setTextColor}
            borderColor={borderColor}
            setBorderColor={setBorderColor}
          />

          <div className="pt-2">
            <button
              onClick={doSave}
              disabled={!userId || saving}
              className="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-900 disabled:bg-gray-500"
            >
              {saving ? "Saving…" : "Save now"}
            </button>
            {!userId && (
              <p className="text-xs text-red-300 mt-2">
                Login required to save customization.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterPrizeQuiz;
