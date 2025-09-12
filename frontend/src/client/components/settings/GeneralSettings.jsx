import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; 
import axiosInstance from "../../../store/axiosInstance";

export default function GeneralSettings() {
  // ✅ Grab logged-in userId from Redux
const userId = localStorage.getItem("userId");
console.log(userId, 'userid');
  const [settings, setSettings] = useState({
    weeklyQuiz: true,
    newTool: true,
    monthlyEmail: true,
    hideToolPreviews: true,
    inAppTips: true,
    integration: true,
    mailchimp: true,
    hubspot: true,
  });

 const handleToggle = async (key) => {
  const updated = { ...settings, [key]: !settings[key] };
  setSettings(updated); 

  try {
    const res = await axiosInstance.put(`/notifications/${userId}/preferences`, {
      newtool: updated.newTool,
      quiz: updated.weeklyQuiz,
    });

    if (res.data?.data) {
      setSettings((prev) => ({
        ...prev,
        newTool: res.data.data.newtool ?? prev.newTool,
        weeklyQuiz: res.data.data.quiz ?? prev.weeklyQuiz,
      }));
    }
  } catch (error) {
    console.error("Failed to update preferences:", error);
    setSettings(settings); 
  }
};

 useEffect(() => {
  const fetchPreferences = async () => {
    try {
      const res = await axiosInstance.get(
        `/notifications/${userId}/preferences`
      );

      if (res.data?.data) {
        setSettings((prev) => ({
          ...prev,
          newTool: res.data.data.newtool ?? prev.newTool,
          weeklyQuiz: res.data.data.quiz ?? prev.weeklyQuiz,
        }));
      }
    } catch (err) {
      console.error("Error loading preferences:", err);
    }
  };

  if (userId) fetchPreferences();
}, [userId]);


  return (
    <div className="lg:p-6 p-2 text-white">
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Notifications</h1>
        <div className="space-y-6">

          {/* Weekly quiz engagement summary */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">Weekly quiz engagement summary</div>
              <div className="text-sm text-gray-400">
                Receive push notification
              </div>
            </div>
            <button
              onClick={() => handleToggle("weeklyQuiz")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none cursor-pointer ${
                settings.weeklyQuiz ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.weeklyQuiz ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* New tool drops */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">New tool drops</div>
              <div className="text-sm text-gray-400">
                Receive push notification
              </div>
            </div>
            <button
              onClick={() => handleToggle("newTool")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none cursor-pointer ${
                settings.newTool ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.newTool ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
