import { useState } from "react";
import ProfileSettigs from "./ProfileSettings";
import GeneralSettings from "./GeneralSettings";
import ResetPasswordPopup from "./ResetPasswordPopup";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showResetPopup, setShowResetPopup] = useState(false);

  const handleUpdatePassword = () => {
    setShowResetPopup(true);
  };

  return (
    <div className=" text-white">
      <div className=" lg:px-5 py-4">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-4xl font-normal text-white mb-5">Settings</h1>
        </div>

        {/* Tabs with Update Password */}
        <div className="w-full">
          <div className="flex items-center border-b border-gray-600 w-full">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-2 py-2 text-sm lg:px-4 lg:py-2 lg:text-lg text-nowrap font-normal border-b-2 mr- lg:mr-6 transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "text-cyan-400 border-cyan-400"
                  : "text-gray-400 border-transparent hover:text-gray-300"
              }`}
            >
              Profile Setting
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`px-2 py-2 text-sm lg:px-4 lg:py-2 lg:text-lg text-nowrap font-normal border-b-2 transition-all cursor-pointer ${
                activeTab === "general"
                  ? "text-cyan-400 border-cyan-400"
                  : "text-gray-400 border-transparent hover:text-gray-300"
              }`}
            >
              General Setting
            </button>
            <button
              onClick={handleUpdatePassword}
              className="ml-auto text-cyan-400 text-sm lg:text-lg text-nowrap underline hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
      {activeTab === "profile" && <ProfileSettigs />}
      {activeTab === "general" && <GeneralSettings />}
      {showResetPopup && (
        <ResetPasswordPopup onClose={() => setShowResetPopup(false)} />
      )}
    </div>
  );
}
