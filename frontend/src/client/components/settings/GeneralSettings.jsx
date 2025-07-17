import { useState } from "react";

export default function GeneralSettings() {
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

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="  lg:p-6 p-2 text-white">
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
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
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
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
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

          {/* Monthly behavioral insights email */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">
                Monthly behavioral insights email
              </div>
              <div className="text-sm text-gray-400">
                Receive push notification
              </div>
            </div>
            <button
              onClick={() => handleToggle("monthlyEmail")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
                settings.monthlyEmail ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.monthlyEmail ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Hide tool previews on dashboard */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">Hide tool previews on dashboard</div>
              <div className="text-sm text-gray-400">
                Receive push notification
              </div>
            </div>
            <button
              onClick={() => handleToggle("hideToolPreviews")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
                settings.hideToolPreviews ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.hideToolPreviews ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Enable in-app tips/onboarding walkthroughs */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">
                Enable in-app tips/onboarding walkthroughs
              </div>
            </div>
            <button
              onClick={() => handleToggle("inAppTips")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
                settings.inAppTips ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.inAppTips ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Integration */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">Integration</div>
            </div>
            <button
              onClick={() => handleToggle("integration")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
                settings.integration ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.integration ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Mailchimp */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <div className="font-medium">Mailchimp</div>
            </div>
            <button
              onClick={() => handleToggle("mailchimp")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
                settings.mailchimp ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.mailchimp ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* HubSpot */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">HubSpot</div>
            </div>
            <button
              onClick={() => handleToggle("hubspot")}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none ${
                settings.hubspot ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  settings.hubspot ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
