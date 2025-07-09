import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const users = [
  {
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.con",
    startDate: "June 11, 2025",
    lastQuestion: "Q4",
    reminderSent: { value: "Yes" },
    action: "Send",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  ...Array(2).fill({
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.con",
    startDate: "June 11, 2025",
    lastQuestion: "Q6",
    reminderSent: { value: "Yes", subtext: "Sent On June 17" },
    action: "Resend",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  }),
  ...Array(5).fill({
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.con",
    startDate: "June 11, 2025",
    lastQuestion: "Q6",
    reminderSent: { value: "Yes" },
    action: "Resend",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  }),
];

const ACTIONS = ["Send", "Resend", "Cancel"];

const Table = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // index of open dropdown
  const [rowActions, setRowActions] = useState(users.map((u) => u.action));
  const dropdownRefs = useRef([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleActionChange = (rowIdx, action) => {
    setRowActions((actions) =>
      actions.map((a, idx) => (idx === rowIdx ? action : a))
    );
    setOpenDropdown(null);
  };

  return (
    <div className="overflow-x-auto bg-[#232432] mt-10 p-5">
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-300 text-sm border-b border-gray-600">
            <th className="py-4 px-4 font-medium">
              Name
              <span className="inline-block align-middle ml-2 text-2xl">↓</span>
            </th>
            <th className="py-4 px-4 font-medium">User ID</th>
            <th className="py-4 px-4 font-medium">Email Address</th>
            <th className="py-4 px-4 font-medium">Start Date</th>
            <th className="py-4 px-4 font-medium">Last Question Reached</th>
            <th className="py-4 px-4 font-medium">Reminder Sent</th>
            <th className="py-4 px-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-400 last:border-b-0 hover:bg-[#26263a] transition-colors"
            >
              <td className="py-3 px-4 flex items-center gap-3 min-w-[180px]">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-500"
                />
                <span className="text-white font-medium">{user.name}</span>
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[100px]">
                {user.userId}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[180px]">
                {user.email}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[150px]">
                {user.startDate}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[120px]">
                {user.lastQuestion}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[120px]">
                <span className="block text-white font-medium">
                  {user.reminderSent.value}
                </span>
                {user.reminderSent.subtext && (
                  <span className="block text-xs text-gray-400 mt-1">
                    {user.reminderSent.subtext}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 min-w-[120px] relative">
                <button
                  className="flex items-center gap-2 bg-green-200 text-green-900 font-semibold px-6 py-1 rounded-full text-sm shadow-sm hover:bg-green-300 transition-colors w-[110px] justify-center"
                  style={{
                    backgroundColor: "#BBF7D0",
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem",
                  }}
                  onClick={() =>
                    setOpenDropdown(openDropdown === idx ? null : idx)
                  }
                  type="button"
                >
                  {rowActions[idx]}
                  <FiChevronDown size={18} />
                </button>
                {openDropdown === idx && (
                  <div
                    ref={(el) => (dropdownRefs.current[idx] = el)}
                    className="absolute right-0 mt-2 w-32 bg-[#232432] rounded-lg shadow-lg border border-[#2A2A39] z-50 p-2"
                  >
                    {ACTIONS.map((action) => (
                      <label
                        key={action}
                        className="flex items-center justify-between gap-2 py-1 cursor-pointer"
                      >
                        <span className="text-white text-sm">{action}</span>
                        <input
                          type="checkbox"
                          checked={rowActions[idx] === action}
                          onChange={() => handleActionChange(idx, action)}
                          className="accent-cyan-400 w-4 h-4 rounded border-2 border-cyan-400 bg-transparent focus:ring-0"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
