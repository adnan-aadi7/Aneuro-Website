import React from "react";
import { Eye, Edit, Trash2, Users } from "lucide-react";

const FunnelTemplates = () => {
  const funnelTemplates = [
    {
      name: "SaaS Lead Generation Funnel",
      pages: "5 pages",
      category: "SaaS",
      tier: "premium",
      status: "active",
      usage: 456,
      created: "1/15/2024",
    },
    {
      name: "E-commerce Product Launch",
      pages: "7 pages",
      category: "E-commerce",
      tier: "basic",
      status: "active",
      usage: 234,
      created: "1/10/2024",
    },
    {
      name: "Coaching Program Funnel",
      pages: "6 pages",
      category: "Coaching",
      tier: "enterprise",
      status: "scheduled",
      usage: 0,
      created: "1/20/2024",
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
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-[#16161C] text-white  w-full mt-3 border border-slate-800 p-5">
      {/* Header */}
      <h1 className="text-3xl font-medium mb-6">All Funnel Templates</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Pages
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Category
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
            {funnelTemplates.map((template, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/50"
              >
                <td className="py-4 px-4 text-white text-sm">
                  {template.name}
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {template.pages}
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {template.category}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                      template.tier
                    )}`}
                  >
                    {template.tier}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                      template.status
                    )}`}
                  >
                    {template.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-blue-400" />
                    {template.usage}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">
                  {template.created}
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

export default FunnelTemplates;
