import { ArrowDown, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const data = Array(8).fill({
  name: 'Devon Lane',
  Transactionid: '#53535',
  AmountPaid: '$200',
  Subscriptionplan: 'Premium',
  status: 'Paid',
  RefundRequest:"Requested"
});

const BillingOverview =()=>{
   const navigate = useNavigate();
    return(
       <div className='text-white'>
            <h1 className="text-[32px] font-medium">Billing Overview</h1>
            <p className="opacity-70 text-[20px]">Let’s make the day productive</p>
      
           <div
             className="p-6 mt-6 shadow-md text-white font-inter w-full"
             style={{
               backgroundImage: `url('/Frame 2.png')`,
               backgroundSize: 'cover',
               backgroundRepeat: 'no-repeat',
               backgroundPosition: 'center',
             }}
           >
     
              <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-y-2 sm:border-spacing-y-0">
            <thead>
               <tr className="text-left text-sm font-semibold text-white">
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">User Name <span className="inline-block "><ArrowDown size={14}/></span></th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Transaction ID	</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Amount Paid</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Subscription Plan </th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Status</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Refund Request</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Action</th>
               </tr>
             </thead>
            <tbody>
  {data.map((ticket, idx) => (
    <tr
      onClick={() => navigate('/admin/manage-subscription/user-detail')}
      key={idx}
      className="text-sm hover:bg-[#222431] transition-colors rounded-lg cursor-pointer"
    >
      <td className="flex flex-row items-center gap-2 px-6 py-4 border-b border-slate-300 ">
        <img
          src="/Frame 1000006611.png"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        {ticket.name}
      </td>
      <td className="py-4 px-6 border-b border-slate-300 ">
        {ticket.Transactionid}
      </td>
      <td className="py-4 px-6 border-b border-slate-300 ">
        {ticket.AmountPaid}
      </td>
      <td className="py-4 px-6 border-b border-slate-300 ">
        {ticket.Subscriptionplan}
      </td>
   
      <td className="py-4 px-6 border-b border-slate-300 ">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full 
            ${ticket.status === 'Resolved'
              ? 'bg-[#C2FFE3] text-[#1A7759]'
              : 'bg-[#D2FFF8] text-[#007872]'}`}
        >
          {ticket.status}
        </span>
      </td>
       <td className="py-4 px-6 border-b border-slate-300 ">
        {ticket.RefundRequest}
      </td>
      <td className="text-center py-4 px-6 border-b border-slate-300  ">
        <MoreVertical size={16} className="cursor-pointer text-white/70" />
      </td>
    </tr>
  ))}
</tbody>

            </table>
            </div>

             <div className="mt-12 flex justify-center items-center gap-2 text-sm">
          <button className="px-2 py-1 text-white/70">Previous</button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-md ${page === 1 ? 'bg-[#00D1FF] text-black font-semibold' : 'bg-[#1B1D29] text-white/70'}`}
            >
              {page}
            </button>
          ))}
          <button className="px-2 py-1 text-white/70">Next</button>
        </div>
           </div>
      </div>
    )
}

export default BillingOverview;