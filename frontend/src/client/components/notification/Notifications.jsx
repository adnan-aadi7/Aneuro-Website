import { useEffect, useState } from "react";
import axiosInstance from "../../../store/axiosInstance";
import logo from "../../../assets/auth/logo.png";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example userId (take from localStorage or props)
  const userId = localStorage.getItem("userId") || "689ecac7a242990a31248975";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get(
          `/notifications/${userId}`
        );
        if (res.data.success) {
          setNotifications(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-semibold mb-8">Notifications</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Notifications</h1>
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div
              key={n._id || i}
              className="flex items-start gap-4 py-4 border-b border-[#393945]"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mt-1">
                <img
                  src={logo}
                  alt="Aneuro Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-lg mb-0.5">{n.title}</div>
                <div className="text-gray-300 text-sm">{n.message}</div>
              </div>
              <div className="text-gray-400 text-xs whitespace-nowrap mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-6 text-gray-400 text-sm">
          Displaying{" "}
          <span className="text-cyan-400 font-medium">{notifications.length}</span>{" "}
          of{" "}
          <a href="#" className="text-cyan-400 underline">
            {notifications.length}
          </a>
        </div>
      </div>
    </div>
  );
}
