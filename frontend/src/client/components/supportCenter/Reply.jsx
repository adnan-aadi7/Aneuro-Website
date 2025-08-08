import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketById } from "../../../store/Slice/TicketSlice";

const Reply = ({ ticketId }) => {
  const dispatch = useDispatch();
  const ticket = useSelector((state) => state.ticket.currentTicket);
  const loading = useSelector((state) => state.ticket.loading);

  useEffect(() => {
    if (ticketId) {
      dispatch(getTicketById(ticketId));
    }
  }, [dispatch, ticketId]);
  console.log("ticket Reply", ticket);

  if (loading) {
    return <div className="text-gray-400 text-center py-8">Loading replies...</div>;
  }
  if (!ticket || !ticket.replies || ticket.replies.length === 0) {
    return <div className="text-gray-400 text-center py-8">No replies found.</div>;
  }

  return (
    <div className="max-w-full mx-auto mt-8">
      {ticket.replies.map((reply, idx) => (
        <div
          key={idx}
          className="p-8 rounded bg-[#232432] relative mb-6"
          style={{ boxShadow: "0 0 0 3px inset, 0 2px 82px 0 #0e7490 inset" }}
        >
          {/* Header */}
          <div className="flex items-center mb-2">
            <img
              src="/Avatar.png"
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-500 mr-3"
            />
            <span className="font-semibold text-white text-base">Reply To:</span>
          </div>
          {/* Subject */}
          <div className="mt-2 mb-2">
          <span className="font-semibold text-white text-lg">
  {ticket.category?.length
    ? typeof ticket.category === "string"
      ? ticket.category
      : ticket.category.join(", ")
    : "Support Ticket"} – Ticket #{ticketId}
</span>
          </div>
          {/* Greeting and Reply Message */}
          <div className="text-gray-200 text-sm mb-4 mt-2">
            <p className="mb-2">Hi {ticket.name},</p>
            <p className="mb-4">{reply.message}</p>
            <p className="mb-2">Thank You For Your Patience.<br />Regards,<br />Support Center</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reply;
