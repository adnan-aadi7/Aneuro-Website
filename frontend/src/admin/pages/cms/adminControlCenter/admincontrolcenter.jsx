import { useState } from "react";
import EmailSequencesTab from "../../../components/cms/emailsequenceTab/EmailSequencetab";
import FunnelTemplatesTab from "../../../components/cms/funnelTab/FunnelTemplates";
import ScheduledReleasesTab from "../../../components/cms/sheduleReleasesTab/ScheduledReleasesTable";
import EmailSequenceCard from "../../../components/cms/overviewTab/EmailSequenceCard";
import PromptPacksCard from "../../../components/cms/overviewTab/PromptPacksCard";
import FunnelTemplateCard from "../../../components/cms/overviewTab/FunnelTemplateCard";
import RecentActivity from "../../../components/cms/overviewTab/RecentActivity";
import PromptPacks from "../../../components/cms/promptTab/Promptpacks";
import FunnelTemplates from "../../../components/cms/funnelTab/FunnelTemplates";
import ScheduledReleasesTable from "../../../components/cms/sheduleReleasesTab/ScheduledReleasesTable";
import Cards from "../../../components/cms/sheduleReleasesTab/Cards";
import AddShedulePopup from "../../../components/cms/sheduleReleasesTab/AddShedulePopup";

const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);

  const tabs = [
    { name: "Overview" },
    { name: "Email Sequences" },
    { name: "Prompt Packs" },
    { name: "Funnel Templates" },
    { name: "Scheduled Releases" },
  ];

  const Title = {
    Overview: "Admin Control Center",
    "Email Sequences": "Email Sequences",
    "Prompt Packs": "Prompt Packs",
    "Funnel Templates": "Funnel Templates",
    "Scheduled Releases": "Scheduled Releases",
  };
  const tabDescriptions = {
    Overview: "Manage all content drops and user access",
    "Email Sequences": "Create and manage automated email sequences",
    "Prompt Packs": "Organize and publish AI prompt packs",
    "Funnel Templates": "Configure and customize funnel templates",
    "Scheduled Releases": "Set up and control scheduled content releases",
  };

  return (
    <div className="w-full text-white">
      {/* Page Header + Upload Button */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{Title[activeTab]}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {tabDescriptions[activeTab]}
          </p>
        </div>
        {activeTab === "Email Sequences" && (
          <button className="flex items-center gap-2 bg-cyan-400 text-black px-5 py-2 font-medium text-sm shadow hover:bg-cyan-300 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Upload New Sequence
          </button>
        )}
        {activeTab === "Prompt Packs" && (
          <button className="flex items-center gap-2 bg-cyan-400 text-black px-5 py-2 font-medium text-sm shadow hover:bg-cyan-300 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Upload New Pack
          </button>
        )}
        {activeTab === "Funnel Templates" && (
          <button className="flex items-center gap-2 bg-cyan-400 text-black px-5 py-2 font-medium text-sm shadow hover:bg-cyan-300 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a2 2 0 01-.553 1.382l-6.894 7.448A2 2 0 0013 16.118V20a1 1 0 01-1.447.894l-2-1A1 1 0 019 19v-2.882a2 2 0 00-.553-1.382L1.553 7.382A2 2 0 011 6V4z"
              />
            </svg>
            Upload New Template
          </button>
        )}
        {activeTab === "Scheduled Releases" && (
          <button
            className="flex items-center gap-2 bg-cyan-400 text-black px-5 py-2 font-medium text-sm shadow hover:bg-cyan-300 transition-all"
            onClick={() => setShowSchedulePopup(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Schedule New Release
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-row overflow-x-auto whitespace-nowrap border-2 border-[#212C3B] bg-[#161D27]">
        {tabs.map(({ name }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex-1 min-w-max cursor-pointer flex items-center justify-center gap-2 py-2 px-4 text-[14px] font-medium transition-all 
              ${activeTab === name ? "bg-white text-black" : "text-[#AEAEAE]"}`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === "Overview" && (
            <>
              <EmailSequenceCard />
              <PromptPacksCard />
              <FunnelTemplateCard />
            </>
          )}
        </div>
        {activeTab === "Overview" && <RecentActivity />}

        {activeTab === "Email Sequences" && <EmailSequencesTab />}
        {activeTab === "Prompt Packs" && <PromptPacks />}
        {activeTab === "Funnel Templates" && <FunnelTemplates />}
        {activeTab === "Scheduled Releases" && (
          <>
            <Cards />
            <ScheduledReleasesTable />
          </>
        )}
      </div>
      {/* AddShedulePopup Modal */}
      <AddShedulePopup
        open={showSchedulePopup}
        onClose={() => setShowSchedulePopup(false)}
        bgColor="#1E293B"
      />
    </div>
  );
};

export default AdminControlCenter;
