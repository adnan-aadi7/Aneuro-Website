import React from 'react';
import { Download } from 'lucide-react';

const Openticket = ({ tickets = [] }) => {
  if (!tickets.length) {
    return <div className="py-12 text-white px-4 md:px-8 mt-6">No open tickets found.</div>;
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="py-12 text-white px-4 md:px-8 mt-6 shadow-md font-inter w-full overflow-x-auto"
          style={{
            backgroundImage: `url('/Group 1000004911.png')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
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

          {/* Ticket Message */}
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

          {/* Ticket Attachment */}
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
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Reply To: {ticket?.email || "User"}</h3>
              <div className="space-y-4">
                {ticket.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className={`p-4 rounded-lg ${
                      reply.repliedBy === 'admin'
                        ? 'bg-[#1E293B] text-white border border-[#12DCF0]/40'
                        : 'bg-[#2D2D2D] text-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {reply.repliedBy === 'admin' ? 'Support Team' : ticket?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="text-sm prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: reply.message }}
                    />
                    {reply.fileUrl && (
                      <a
                        href={reply.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-blue-400 text-xs underline"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Openticket;
