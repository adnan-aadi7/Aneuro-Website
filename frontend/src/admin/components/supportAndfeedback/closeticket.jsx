import React from 'react';
import { Download } from 'lucide-react';
import CloseTicketReply from './CloseTicketReply';

const Closeticket = ({ tickets = [], onReopenTicket }) => {
  if (!tickets.length) {
    return <div className="py-12 text-white px-4 md:px-8 mt-6">No closed tickets found.</div>;
  }
  return (
    <div className=''>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="py-12 text-white px-4 md:px-8 mt-6 shadow-md font-inter w-full overflow-x-auto"
          style={{
            backgroundImage: `url('/bgimg.png')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: "0 0 0  inset, 0 2px 25px 0 #0e7490 inset"
          }}
        >
          {/* Subject (use first category or fallback) */}
          <div className="mt-4 mb-2">
            <span className="font-semibold text-white text-xl">
              {Array.isArray(ticket.category) && ticket.category.length > 0
                ? ticket.category[0]
                : 'Support Ticket'}
            </span>
          </div>

          {/* Message Body */}
          <div className="text-gray-200 text-sm mb-4 mt-5">
            <p className="mb-4">Hi Aneuro Support Team,</p>
            <p className="mb-4">
              {ticket.message}
              <br />
              {ticket.category && ticket.category.length > 1 && (
                <>
                  <span className="text-xs text-cyan-400">
                    Categories: {ticket.category.join(', ')}
                  </span>
                  <br />
                </>
              )}
              Looking Forward To Your Assistance.
            </p>
            <p className="mb-2">
              Best Regards,
              <br />
              {ticket.name}
            </p>
          </div>

          {/* Attachment */}
          {ticket.fileUrl && (
            <div className="flex items-center gap-2 bg-[#202735] border border-[#12DCF0] px-4 py-3 mt-8 w-max ">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs">PDF</div>
              <div className="text-sm">{ticket.fileUrl.split('/').pop()}</div>
              <div className="text-xs text-gray-400">
                {ticket.fileSize ? `${ticket.fileSize}KB` : ''}
              </div>
              <a href={ticket.fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="text-white text-lg" />
              </a>
            </div>
          )}

          {/* Replies Section */}
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold text-white">Reply To: {ticket?.email || "User"} </h4>
              {ticket.replies.map((reply, index) => (
                <div
                  key={reply._id || index}
                  className="bg-[#1a1f2e] border border-[#12DCF0] p-4 rounded-lg text-sm text-gray-200"
                >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {reply.repliedBy === 'admin' ? 'Support Team' : ticket?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </span>
                    </div>
                  <p className="mb-2">{reply.message}</p>
                 
                </div>
              ))}
            </div>
          )}

          {/* Close Ticket Reply */}
          <CloseTicketReply
            ticket={ticket}
            onReopenTicket={() => onReopenTicket && onReopenTicket(ticket._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Closeticket;
