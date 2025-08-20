import { useEffect, useState } from 'react';
import { MoreVertical, ArrowDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, updateTicketStatus } from '../../../store/Slice/TicketSlice';

export default function Support() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets = [], count = 0, pagination } = useSelector((state) => state.ticket);
  const [page, setPage] = useState(1);
  const [rowLoading, setRowLoading] = useState({}); // { [ticketId]: boolean }
  const [filters, setFilters] = useState({
    status: '',
    email: ''
  });
  const limit = 10;
  const totalPages = pagination?.totalPages || Math.ceil(count / limit);

  useEffect(() => {
    dispatch(getTickets({ page, limit, ...filters }));
  }, [dispatch, page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleToggleStatus = async (e, ticket) => {
    e.stopPropagation();
    if (!ticket?._id) return;
    const newStatus = ticket.status === 'CLOSED' ? 'OPEN' : 'CLOSED';
    setRowLoading(prev => ({ ...prev, [ticket._id]: true }));
    try {
      await dispatch(updateTicketStatus({ ticketId: ticket._id, status: newStatus })).unwrap();
    } catch {
      // Optional: could show a toast here; slice stores error
    } finally {
      setRowLoading(prev => ({ ...prev, [ticket._id]: false }));
    }
  };

  return (
    <div className='text-white'>
      <h1 className="text-[32px] font-medium">All Tickets</h1>
      <p className="opacity-70 text-[20px]">Let's make the day productive</p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
          <input
            type="text"
            placeholder="Search by email..."
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            className="bg-[#1B1D29] border border-white/20  px-10 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#00D1FF]"
          />
        </div>
        
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-[#1B1D29] border border-white/20  px-4 py-2 text-white focus:outline-none focus:border-[#00D1FF]"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

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
      onClick={() => navigate(`/admin/support/feedback/user-detail/${ticket._id}`, { state: { ticketId: ticket._id } })}
      key={ticket._id || idx}
      className="text-sm hover:bg-[#222431] transition-colors rounded-lg cursor-pointer"
    >
      <td className="flex flex-row items-center gap-2 px-6 py-5 border-b border-slate-300">
        <img
          src={ticket.profileImage || "/Frame 1000006611.png"}
          alt="avatar"
          className="w-10 h-9 rounded-full "
        />
        {ticket.name}
      </td>
      <td className="py-4 px-6 border-b border-slate-300">
        {ticket.email}
      </td>
      <td className="py-4 px-6 border-b border-slate-300">
        {Array.isArray(ticket.category) ? ticket.category.join(", ") : ticket.category}
      </td>
      <td className="py-4 px-6 border-b border-slate-300">
        {ticket.assignedTo || "Not Assigned"}
      </td>
      <td className="py-4 px-6 border-b border-slate-300">
        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "-"}
      </td>
      <td className="py-4 px-6 border-b border-slate-300">
        <button
          onClick={(e) => handleToggleStatus(e, ticket)}
          disabled={!!rowLoading[ticket._id]}
          className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed 
            ${ticket.status === 'CLOSED'
              ? 'bg-[#C2FFE3] text-[#1A7759]'
              : 'bg-[#D2FFF8] text-[#007872]'}`}
        >
          {rowLoading[ticket._id] ? (ticket.status === 'CLOSED' ? 'Reopening...' : 'Closing...') : ticket.status}
        </button>
      </td>
      <td className="text-center py-4 px-6 border-b border-slate-300">
        <MoreVertical size={16} className="cursor-pointer text-white/70" />
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 text-sm">
            <button
              className="px-2 py-1 text-white/70 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-md ${pageNum === page ? 'bg-[#00D1FF] text-black font-semibold' : 'bg-[#1B1D29] text-white/70'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              className="px-2 py-1 text-white/70 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
