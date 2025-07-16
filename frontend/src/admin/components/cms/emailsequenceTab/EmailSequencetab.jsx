import React from "react";
import { Eye, Edit, Trash2, Users } from "lucide-react";

const EmailSequences = () => {
  const sequences = [
    {
      name: "Sales Mastery Course",
      emails: "12 emails",
      tier: "premium",
      status: "active",
      usage: 1247,
      created: "1/15/2024",
    },
    {
      name: "Lead Generation Funnel",
      emails: "8 emails",
      tier: "basic",
      status: "active",
      usage: 892,
      created: "1/10/2024",
    },
    {
      name: "Customer Retention Series",
      emails: "15 emails",
      tier: "enterprise",
      status: "scheduled",
      usage: 0,
      created: "1/20/2024",
    },
    {
      name: "Sales Mastery Course",
      emails: "12 emails",
      tier: "premium",
      status: "active",
      usage: 1247,
      created: "1/15/2024",
    },
    {
      name: "Lead Generation Funnel",
      emails: "8 emails",
      tier: "basic",
      status: "active",
      usage: 892,
      created: "1/10/2024",
    },
    {
      name: "Customer Retention Series",
      emails: "15 emails",
      tier: "enterprise",
      status: "scheduled",
      usage: 0,
      created: "1/20/2024",
    },
    {
      name: "Sales Mastery Course",
      emails: "12 emails",
      tier: "premium",
      status: "active",
      usage: 1247,
      created: "1/15/2024",
    },
    {
      name: "Lead Generation Funnel",
      emails: "8 emails",
      tier: "basic",
      status: "active",
      usage: 892,
      created: "1/10/2024",
    },
    {
      name: "Customer Retention Series",
      emails: "15 emails",
      tier: "enterprise",
      status: "scheduled",
      usage: 0,
      created: "1/20/2024",
    },
  ];

  const getTierBadge = (tier) => {
    const styles = {
      premium: "bg-blue-600 text-white",
      basic: "bg-green-600 text-white",
      enterprise: "bg-purple-600 text-white",
    };
    return styles[tier] || "bg-gray-600 text-white";
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-600 text-white",
      scheduled: "bg-blue-600 text-white",
    };
    return styles[status] || "bg-gray-600 text-white";
  };

  return (
    <div className="bg-[#16161C] text-white w-full mt-4 border border-slate-800 p-5">
      {/* Header */}
      <h1 className="text-3xl font-medium mb-6">All Email Sequences</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Emails
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Tier
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Usage
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Created
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sequences.map((sequence, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/50"
              >
                <td className="py-4 px-4 text-white text-sm">
                  {sequence.name}
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {sequence.emails}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                      sequence.tier
                    )}`}
                  >
                    {sequence.tier}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                      sequence.status
                    )}`}
                  >
                    {sequence.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-blue-400" />
                    {sequence.usage}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {sequence.created}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
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

export default EmailSequences;
