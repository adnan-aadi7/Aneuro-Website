import React from "react";
import { Download } from "lucide-react";

const BillingHistory = () => {
  const billingData = [
    {
      invoice: "Invoice #001",
      date: "Dec30, 2025",
      amount: "USD $20.00",
      plan: "Starter",
      users: 10,
    },
    {
      invoice: "Invoice #001",
      date: "Dec30, 2025",
      amount: "USD $20.00",
      plan: "Starter",
      users: 10,
    },
    {
      invoice: "Invoice #001",
      date: "Dec30, 2025",
      amount: "USD $20.00",
      plan: "Starter",
      users: 10,
    },
    {
      invoice: "Invoice #001",
      date: "Dec30, 2025",
      amount: "USD $20.00",
      plan: "Starter",
      users: 10,
    },
    {
      invoice: "Invoice #001",
      date: "Dec30, 2025",
      amount: "USD $20.00",
      plan: "Starter",
      users: 10,
    },
  ];

  return (
    <div className=" text-white mt-10">
      <div className="max-w-full mx-auto ">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-4xl font-bold mb-5">Billing History</h1>
            <p className="text-gray-400 text-base">
              Download your previous plan receipts and usage details
            </p>
          </div>
          <button className="bg-cyan-400 hover:bg-cyan-300 text-gray-900 px-4 py-2 font-medium transition-colors mt-10 ml-1">
            Download All
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#2A2A39]  shadow-lg overflow-hidden mt-6">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-0 p-0 bg-[#2A2A39] text-white text-sm font-bold border-b border-gray-700">
            <div className="pl-6 py-4 flex items-center gap-2">
              <span>Invoice</span>
              <Download className="w-4 h-4" />
            </div>
            <div className="pl-4 py-4">Billing date</div>
            <div className="pl-4 py-4">Amount</div>
            <div className="pl-4 py-4">Plan</div>
            <div className="pl-4 py-4">Users</div>
            <div className="pl-4 py-4">Action</div>
          </div>

          {/* Table Body */}
          <div>
            {billingData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-0 border-b border-gray-700 hover:bg-[#262634] transition-colors items-center"
              >
                <div className="text-gray-100 font-medium pl-6 py-4">
                  {row.invoice}
                </div>
                <div className="text-gray-100 pl-4 py-4">{row.date}</div>
                <div className="text-gray-100 pl-4 py-4">{row.amount}</div>
                <div className="text-gray-100 pl-4 py-4">{row.plan}</div>
                <div className="text-gray-100 pl-4 py-4">{row.users}</div>
                <div className="pl-4 py-4">
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <Download className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
