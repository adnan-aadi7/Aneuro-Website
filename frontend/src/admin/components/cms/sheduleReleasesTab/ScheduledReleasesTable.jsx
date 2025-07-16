import React from "react";
import { Edit, Trash2, Mail, Zap, Filter } from "lucide-react";

const ScheduledReleasesTable = () => {
  const scheduledReleases = [
    {
      content: "Customer Retention Series",
      type: "Email Sequence",
      icon: "mail",
      scheduledDate: "2/1/2024",
      time: "09:00",
      tier: "enterprise",
      status: "scheduled",
    },
    {
      content: "AI Business Automation Pack",
      type: "Prompt Pack",
      icon: "zap",
      scheduledDate: "2/5/2024",
      time: "14:30",
      tier: "premium",
      status: "scheduled",
    },
    {
      content: "Coaching Program Funnel",
      type: "Funnel Template",
      icon: "filter",
      scheduledDate: "2/10/2024",
      time: "10:00",
      tier: "basic",
      status: "scheduled",
    },
  ];

  const getTierBadge = (tier) => {
    const styles = {
      premium: "bg-blue-100 text-blue-800",
      basic: "bg-green-100 text-green-800",
      enterprise: "bg-purple-100 text-purple-800",
    };
    return styles[tier] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case "mail":
        return <Mail className="w-4 h-4 mr-2" />;
      case "zap":
        return <Zap className="w-4 h-4 mr-2" />;
      case "filter":
        return <Filter className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg- text-white  w-full mt-3 border border-slate-800 p-5">
      {/* Header */}
      <h1 className="text-3xl font-medium mb-6">All Scheduled Releases</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Content
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Type
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Scheduled Date
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Time
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Tier
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {scheduledReleases.map((release, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/50"
              >
                <td className="py-4 px-4 text-white text-sm">
                  {release.content}
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  <div className="flex items-center">
                    {getIcon(release.icon)}
                    {release.type}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {release.scheduledDate}
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {release.time}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                      release.tier
                    )}`}
                  >
                    {release.tier}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                      release.status
                    )}`}
                  >
                    {release.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledReleasesTable;
