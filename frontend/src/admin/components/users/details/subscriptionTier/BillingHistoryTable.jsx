import React from "react";
import { ChevronDown, Download } from "lucide-react";

export default function BillingHistoryTable() {
  const billingData = [
    {
      invoice: "Invoice #001",
      billingDate: "Dec30, 2025",
      amount: "USD $20.00",
      plan: "Starter",
      users: "10",
    },
  ];

  return (
    <div className="w-full bg-[#2A2A39] ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-medium mb-2">
          Billing History
        </h1>
        <p className="text-slate-400 text-sm">
          Download your previous plan receipts and useage details
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-0 text-slate-300 font-medium text-sm">
                <div className="flex items-center gap-2">
                  Invoice
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Billing date
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Amount
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Plan
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Users
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                <Download size={16} className="text-teal-400" />
              </th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((row, index) => (
              <tr key={index} className="border-b border-slate-700">
                <td className="py-4 px-0 text-white text-sm">{row.invoice}</td>
                <td className="py-4 px-6 text-slate-300 text-sm">
                  {row.billingDate}
                </td>
                <td className="py-4 px-6 text-slate-300 text-sm">
                  {row.amount}
                </td>
                <td className="py-4 px-6 text-slate-300 text-sm">{row.plan}</td>
                <td className="py-4 px-6 text-slate-300 text-sm">
                  {row.users}
                </td>
                <td className="py-4 px-6">
                  <button className="text-teal-400 hover:text-teal-300 transition-colors">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
