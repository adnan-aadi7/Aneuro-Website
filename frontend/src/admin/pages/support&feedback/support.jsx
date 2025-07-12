import { MoreVertical } from 'lucide-react';

const data = Array(8).fill({
  name: 'Devon Lane',
  email: 'Devon@gmail.con',
  category: 'Support',
  assignedTo: 'Support Agent',
  date: '06/11/2025',
  status: 'Resolved',
});

export default function Support() {
  return (
    <div className='text-white'>
      <h1 className="text-[32px] font-medium">All Users</h1>
      <p className="opacity-70 text-[20px]">Let’s make the day productive</p>

<div
  className="p-6 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
  style={{
    backgroundImage: ` url('/Frame 2.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
>

        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm font-semibold text-white/70 border-b border-[#2E2F3E]">
              <th className="pb-3">User Name <span className="inline-block rotate-180">↓</span></th>
              <th className="pb-3">Email Address</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Assigned To</th>
              <th className="pb-3">Submitted On</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ticket, idx) => (
              <tr key={idx} className="text-sm border-b border-[#2E2F3E] hover:bg-[#222431] transition-colors">
                <td className="flex items-center gap-2 px-4 py-3 rounded-l-lg">
                  <img
                    src="/avatar.jpg"
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  {ticket.name}
                </td>
                <td>{ticket.email}</td>
                <td>{ticket.category}</td>
                <td>{ticket.assignedTo}</td>
                <td>{ticket.date}</td>
                <td>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                    ${ticket.status === 'Resolved'
                      ? 'bg-[#C2FFE3] text-[#1A7759]'
                      : 'bg-[#D2FFF8] text-[#007872]'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="text-center rounded-r-lg">
                  <MoreVertical size={16} className="cursor-pointer text-white/70" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
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
  );
}
