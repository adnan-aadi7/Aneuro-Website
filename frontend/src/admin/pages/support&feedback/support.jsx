import { useEffect, useState } from 'react';
import { MoreVertical, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets } from '../../../store/Slice/TicketSlice';

export default function Support() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets = [], count = 0 } = useSelector((state) => state.ticket);
  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil(count / limit);

  useEffect(() => {
    dispatch(getTickets({ page, limit }));
  }, [dispatch, page]);

  return (
    <div className='text-white'>
      <h1 className="text-[32px] font-medium">All Users</h1>
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
               <tr className="text-left text-sm font-semibold text-white/70">
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">User Name <span className="inline-block "><ArrowDown size={14}/></span></th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Email Address</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Category</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Assigned To</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Submitted On</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Status</th>
                 <th className="py-4 px-6 border-b border-slate-300 whitespace-nowrap">Action</th>
               </tr>
             </thead>
            <tbody>
  {tickets.map((ticket, idx) => (
    <tr
      onClick={() => navigate('/admin/support/feedback/user-detail', { state: { ticket } })}
      key={ticket._id || idx}
      className="text-sm hover:bg-[#222431] transition-colors rounded-lg cursor-pointer"
    >
      <td className="flex flex-row items-center gap-2 px-6 py-4 border-b border-slate-300 ">
        <img
          src={ticket.profileImage || "/Frame 1000006611.png"}
          alt="avatar"
          className="w-10 h-9 rounded-full "
        />
        {ticket.name}
      </td>
      <td className="py-4 px-6 border-b border-slate-300  ">
        {ticket.email}
      </td>
      <td className="py-4 px-6 border-b border-slate-300 ">
        {Array.isArray(ticket.category) ? ticket.category.join(", ") : ticket.category}
      </td>
      <td className="py-4 px-6 border-b border-slate-300 ">
        {ticket.assignedTo}
      </td>
      <td className="py-4 px-6 border-b border-slate-300 ">
        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "-"}
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
      <td className="text-center py-4 px-6 border-b border-slate-300  ">
        <MoreVertical size={16} className="cursor-pointer text-white/70" />
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-2 text-sm">
          <button
            className="px-2 py-1 text-white/70"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-md ${p === page ? 'bg-[#00D1FF] text-black font-semibold' : 'bg-[#1B1D29] text-white/70'}`}
            >
              {p}
            </button>
          ))}
          <button
            className="px-2 py-1 text-white/70"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
