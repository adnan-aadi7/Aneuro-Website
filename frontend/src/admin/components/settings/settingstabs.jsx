import { useState } from "react";
import ResetPasswordPopup from "../../../client/components/settings/ResetPasswordPopup";
import ProfileSettigs from "../../../client/components/settings/ProfileSettings";
import GeneralSettings from "../../../client/components/settings/GeneralSettings";
import Systemslogs from "./systemslogs";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showResetPopup, setShowResetPopup] = useState(false);

  const handleUpdatePassword = () => {
    setShowResetPopup(true);
  };

  return (
    <div className=" text-white">
      <div className="  py-4">
        {/* Header */}
      {/* Header */}
<div className="mb-3">
  <h1 className="text-4xl font-normal text-white mb-5">
    {activeTab === "logs" ? "System Logs" : "Settings"}
  </h1>
</div>
<p className=" text-[20px] mb-8  opacity-70">
      {activeTab === "logs" ? "Audit trail for data security and internal accountability" : ""}
  
</p>

        {/* Tabs with Update Password */}
        <div className="w-full overflow-x-auto">
          <div className="flex items-center border-b gap-8 border-gray-600 w-full">
            <button
              onClick={() => setActiveTab("profile")}
              className={` text-sm lg:text-lg text-nowrap font-normal border-b-2 mr- lg:mr-6 transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "text-cyan-400 border-cyan-400"
                  : "text-gray-400 border-transparent hover:text-gray-300"
              }`}
            >
              Profile Setting
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={` text-sm lg:text-lg text-nowrap font-normal border-b-2 transition-all cursor-pointer ${
                activeTab === "general"
                  ? "text-cyan-400 border-cyan-400"
                  : "text-gray-400 border-transparent hover:text-gray-300"
              }`}
            >
              General Setting
            </button>
             <button
              onClick={() => setActiveTab("logs")}
              className={`text-sm  lg:text-lg text-nowrap font-normal border-b-2 transition-all cursor-pointer ${
                activeTab === "logs"
                  ? "text-cyan-400 border-cyan-400"
                  : "text-gray-400 border-transparent hover:text-gray-300"
              }`}
            >
              Systems Logs
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
      {activeTab === "logs" && <Systemslogs />}

      {showResetPopup && (
        <ResetPasswordPopup onClose={() => setShowResetPopup(false)} />
      )}
    </div>
  );
}
