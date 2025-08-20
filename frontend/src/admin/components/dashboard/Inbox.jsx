import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInboxLatest, selectInboxMessages, selectAdminDashboardLoading } from "../../../store/Slice/DashboardSliceAdmin";

const Inbox = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectInboxMessages);
  const loading = useSelector(selectAdminDashboardLoading);

  useEffect(() => {
    dispatch(fetchInboxLatest(5));
  }, [dispatch]);

  return (
    <div className="bg-[#2B2B38]  p-6 w-full max-w-full mt-10">
      <div className="text-white text-2xl font-normal mb-4">Inbox</div>
      <div className="flex flex-col divide-y divide-[#39394a]">
        {loading.inbox && (
          <div className="py-6 text-center text-gray-400">Loading...</div>
        )}
        {!loading.inbox && messages.length === 0 && (
          <div className="py-6 text-center text-gray-400">No messages</div>
        )}
        {!loading.inbox && messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-center py-4 px-2 justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-white text-base leading-tight">
                  {msg.name}
                </div>
                <div className="text-sm text-gray-400 leading-tight">
                  {msg.subject}
                </div>
              </div>
            </div>
            <div className="text-xs text-cyan-400 whitespace-nowrap">
              {msg.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
