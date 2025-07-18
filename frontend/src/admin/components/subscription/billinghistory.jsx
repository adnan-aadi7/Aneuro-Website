const Billinghistory = () => {
  const billingData = [
    {
      id: "#53535",
      amount: "$200",
      plan: "Premium",
      period: "May 1–May 31, 2025",
      status: "Paid",
    },
    {
      id: "#53535",
      amount: "$200",
      plan: "Premium",
      period: "May 1–May 31, 2025",
      status: "Paid",
    },
    {
      id: "#53535",
      amount: "$200",
      plan: "Premium",
      period: "May 1–May 31, 2025",
      status: "Paid",
    },
    // You can add more rows here
  ];

  return (
    <div className="text-white w-full px-4 md:px-6">
      <div>
        <h1 className="text-[24px] font-medium opacity-90">Billing History</h1>
        <p className="text-[16px] opacity-70 mt-1">
          Download your previous plan receipts and usage details
        </p>
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="">
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Transaction ID
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Amount Paid
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Subscription Plan
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Billing Period
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((item, idx) => (
              <tr key={idx} className="text-sm text-center">
                <td className="py-3 border-b-2 border-slate-300  px-4">
                  {item.id}
                </td>
                <td className="py-3 border-b-2 border-slate-300  px-4">
                  {item.amount}
                </td>
                <td className="py-3 border-b-2 border-slate-300  px-4">
                  {item.plan}
                </td>
                <td className="py-3 border-b-2 border-slate-300  px-4">
                  {item.period}
                </td>
                <td className="py-3 border-b-2 border-slate-300  px-4">
                  <span className="bg-[#D9FDEB] text-[#2C6B47] px-3 py-1 text-xs font-medium rounded-full">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billinghistory;
