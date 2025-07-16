import { Upload, Edit, Trash2 } from "lucide-react"; 
import Modal from "../support&feedback/modal";
import { useState } from "react";

const Systemslogstable = () => {
  const logs = [
    {
      date: "2024-06-23 14:23:15",
      user: "admin@company.com",
      id: "ADM-001",
      action: "UPLOAD",
      contentType: "Email Sequence",
      asset: "Email Sequence – Empath Nurture Series",
      description: "Uploaded 7-part email sequence targeting Empath personas.",
      severity: "info",
    },
    {
      date: "2024-06-23 11:43:22",
      user: "john.smith@company.com",
      id: "ADM-002",
      action: "EDIT",
      contentType: "Funnel Template",
      asset: "Funnel Template – Analytical Decision Maker",
      description: "Modified conversion page copy and updated call-to-action.",
      severity: "info",
    },
    {
      date: "2024-06-23 12:18:44",
      user: "sarah.wilson@company.com",
      id: "ADM-003",
      action: "DELETE",
      contentType: "Prompt Pack",
      asset: "Prompt Pack – Social Media Content for Drivers",
      description: "Permanently removed outdated social media prompt pack.",
      severity: "warning",
    },
    {
      date: "2024-06-23 11:55:33",
      user: "admin@company.com",
      id: "ADM-001",
      action: "UPLOAD",
      contentType: "Quiz Template",
      asset: "Cognitive Assessment – Leadership Style Variant",
      description: "Added new quiz variant focusing on leadership competencies.",
      severity: "info",
    },
    {
      date: "2024-06-23 10:38:17",
      user: "mike.johnson@company.com",
      id: "ADM-004",
      action: "EDIT",
      contentType: "Email Sequence",
      asset: "Email Sequence – Expressor Welcome Series",
      description: "Updated email #3 content and modified personalization tokens.",
      severity: "info",
    },
    {
      date: "2024-06-23 09:12:55",
      user: "admin@company.com",
      id: "ADM-001",
      action: "UPLOAD",
      contentType: "Funnel Template",
      asset: "Funnel Template – Harmonizer Sales Process",
      description: "Created complete sales funnel template for Harmonizer persona.",
      severity: "info",
    },
  ];

  const actionStyles = {
    UPLOAD: "bg-green-100 text-green-700",
    EDIT: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
  };

  const actionIcons = {
    UPLOAD: <Upload className="w-4 h-4 mr-1" />,
    EDIT: <Edit className="w-4 h-4 mr-1" />,
    DELETE: <Trash2 className="w-4 h-4 mr-1" />,
  };

  const severityStyles = {
    info: "bg-sky-100 text-sky-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
const [selectedLog, setSelectedLog] = useState(null);
const [showModal, setShowModal] = useState(false);

const handleSeverityClick = (log) => {
  setSelectedLog(log);
  setShowModal(true);
};

  return (
    <div className="mt-6 bg-[#16161C] border border-[#374151] p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Activity Log</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className=" border-b border-gray-700  opacity-90 text-sm ">
            <tr>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Content Type</th>
              <th className="px-4 py-3">Affected Asset</th>
              <th className="px-4 py-3">Severity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-gray-700 hover:bg-[#1C1F26]">
                <td className="px-4 py-3 whitespace-nowrap">{log.date}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{log.user}</span>
                    <span className="text-gray-500 text-xs">{log.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${actionStyles[log.action]}`}
                  >
                    {actionIcons[log.action]}
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3">{log.contentType}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{log.asset}</span>
                    <span className="text-gray-500 text-xs">{log.description}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    onClick={() => handleSeverityClick(log)}
                    className={`px-3 py-1 text-xs font-medium cursor-pointer ${severityStyles[log.severity]}`}
                  >
                    {log.severity}
                  </span>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedLog && (
  <Modal onClose={() => setShowModal(false)} title={`${selectedLog.action} Action Details`}>
    <div className="space-y-4 text-sm text-white p-4 md:w-[800px]">
       <h1 className="inline-block  rounded text-md">
         {selectedLog.action.charAt(0).toUpperCase() + selectedLog.action.slice(1).toLowerCase()} Action Details
       </h1>
       
      <div className="p-3 border border-[#212C3B] bg-[#23232F]">
        <div className="text-gray-400 mb-3">Action Type</div>
        <div className={`px-8 inline-block  py-2 border border-[#12DCF080] text-xs `}>
          {selectedLog.action}
        </div>
      </div>
      <div className="p-3 border border-[#212C3B] bg-[#23232F]">
        <div className="text-gray-400 mb-1">Affected Asset</div>
        <div className="text-[#66BDCC]">{selectedLog.asset}</div>
      </div>
      <div className="p-3 border border-[#212C3B] bg-[#23232F]">
        <div className="text-gray-400 mb-1">Action Details</div>
        <div className="text-[#66BDCC]">{selectedLog.description}</div>
      </div>
      <div className="p-3 border border-[#212C3B] bg-[#23232F]">
        <div className="text-gray-400 mb-1">Content Type</div>
        <div className="text-[#66BDCC]">{selectedLog.contentType}</div>
      </div>
      <div className="p-3 border border-[#212C3B] bg-[#23232F]">
        <div className="text-gray-400 mb-1">User Information</div>
        <div className="text-[#66BDCC]">User: {selectedLog.user}</div>
        <div className="text-[#66BDCC]">User ID: {selectedLog.id}</div>
        <div className="text-[#66BDCC]">IP Address: 192.168.1.100</div>
        <div className="text-[#66BDCC]">Timestamp: {selectedLog.date}</div>
      </div>
      <div className="p-3 border border-[#212C3B] bg-[#23232F]">
        <div className="text-gray-400 mb-1">Severity Level</div>
        <div className={`inline-block px-3 py-1 rounded text-xs text-[#66BDCC] `}>
          {selectedLog.severity}
        </div>
      </div>
    </div>
  </Modal>
)}

    </div>
  );
};

export default Systemslogstable;
