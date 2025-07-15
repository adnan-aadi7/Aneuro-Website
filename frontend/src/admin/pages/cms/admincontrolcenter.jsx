import { useState } from 'react';
import EmailSequencesTab from '../../components/cms/emailsequencetab';
import PromptPacksTab from '../../components/cms/promtpack';
import FunnelTemplatesTab from '../../components/cms/funneltemplate';
import ScheduledReleasesTab from '../../components/cms/schdulereleases';
import Overviewtab from '../../components/cms/overviewtab';
const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview' },
    { name: 'Email Sequences' },
    { name: 'Prompt Packs' },
    { name: 'Funnel Templates' },
    { name: 'Scheduled Releases' },
  ];
 
  const Title ={
     Overview: 'Admin Control Center',
     'Email Sequences':'Email Sequences',
     'Prompt Packs':'Prompt Packs',
     'Funnel Templates':'Funnel Templates',
     'Scheduled Releases':'Scheduled Releases',
  };
  const tabDescriptions = {

    Overview: 'Manage all content drops and user access',
    'Email Sequences': 'Create and manage automated email sequences',
    'Prompt Packs': 'Organize and publish AI prompt packs',
    'Funnel Templates': 'Configure and customize funnel templates',
    'Scheduled Releases': 'Set up and control scheduled content releases',
  };

  return (
    <div className="w-full text-white">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{Title[activeTab]}</h1>
        <p className="text-sm text-gray-400 mt-1">{tabDescriptions[activeTab]}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-2 border-[#212C3B] px-2 py-1 bg-[#161D27] rounded-md overflow-hidden">
        {tabs.map(({ name }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 text-[14px] font-medium transition-all 
              ${
                activeTab === name
                  ? 'bg-white text-black'
                  : 'text-[#AEAEAE]'
              }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 ">
        {activeTab === 'Overview' && <Overviewtab />}
        {activeTab === 'Email Sequences' && <EmailSequencesTab />}
        {activeTab === 'Prompt Packs' && <PromptPacksTab />}
        {activeTab === 'Funnel Templates' && <FunnelTemplatesTab />}
        {activeTab === 'Scheduled Releases' && <ScheduledReleasesTab />}
      </div>
    </div>
  );
};

export default AdminControlCenter;
