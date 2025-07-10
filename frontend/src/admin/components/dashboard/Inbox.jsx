import React from "react";

const messages = [
  {
    id: 1,
    name: "John Deo",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    subject: "Issue with the latest update",
    time: "2 hour ago",
  },
  {
    id: 2,
    name: "John Deo",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    subject: "Issue with the latest update",
    time: "2 hour ago",
  },
  {
    id: 3,
    name: "John Deo",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    subject: "Issue with the latest update",
    time: "2 hour ago",
  },
  {
    id: 4,
    name: "John Deo",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    subject: "Issue with the latest update",
    time: "2 hour ago",
  },
  {
    id: 5,
    name: "John Deo",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    subject: "Issue with the latest update",
    time: "2 hour ago",
  },
];

const Inbox = () => {
  return (
    <div className="bg-[#2B2B38]  p-6 w-full max-w-full mt-10">
      <div className="text-white text-2xl font-normal mb-4">Inbox</div>
      <div className="flex flex-col divide-y divide-[#39394a]">
        {messages.map((msg) => (
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
