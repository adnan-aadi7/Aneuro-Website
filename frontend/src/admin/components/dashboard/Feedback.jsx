import React from "react";

const users = [
  {
    name: "Alice Roy",
    since: "2015",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    feedback:
      "Lorem ipsum dolor sit amet, consectetur  iscing elit. Vivamus viverra auctor velit. Vestibulum id velit aliquam, placerat lacus",
    rating: 5,
  },
  {
    name: "Alice Roy",
    since: "2015",
    img: "https://randomuser.me/api/portraits/women/47.jpg",
    feedback:
      "Lorem ipsum dolor sit amet, consectetur  iscing elit. Vivamus viverra auctor velit. Vestibulum id velit aliquam, placerat lacus",
    rating: 5,
  },
  {
    name: "Alice Roy",
    since: "2015",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    feedback:
      "Lorem ipsum dolor sit amet, consectetur  iscing elit. Vivamus viverra auctor velit. Vestibulum id velit aliquam, placerat lacus",
    rating: 5,
  },
];

const Feedback = () => {
  return (
    <div className="bg-[#32303A]  lg:p-8 mt-10 p-3">
      <h2 className="text-white text-2xl font-medium mb-8">Recent Feedback</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 ">
        {users.map((user, idx) => (
          <div
            key={idx}
            className="w-full max-w-full relative shadow-lg overflow-hidden "
          >
            {/* Blurred circle at bottom right */}
            <div
              className="absolute right-[-30px] bottom-[-30px] w-[118px] h-[102px] opacity-50 z-0"
              style={{
                background: "#12DCF0",
                filter: "blur(100px)",
                borderRadius: "50%",
              }}
            />
            <div className="bg-[#1DE6FB] flex items-center gap-4 p-4 relative z-10 ">
              <img
                src={user.img}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-black font-semibold text-lg leading-tight ">
                  {user.name}
                </div>
                <div className="text-xs text-[#2B9EB3]">
                  User since {user.since}
                </div>
              </div>
            </div>
            <div className="p-4 min-h-[120px] flex flex-col justify-between relative z-10">
              <div className="text-[#BFC3C9] text-sm mb-4">{user.feedback}</div>
              <div className="flex gap-1">
                {[...Array(user.rating)].map((_, i) => (
                  <span key={i} className="text-[#FFB800] text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
