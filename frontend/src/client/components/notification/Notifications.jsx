import logo from "../../../assets/auth/logo.png";

const notifications = [
  {
    title: "Reminder Email Sent",
    description: "A follow-up reminder was sent to john@example.com.",
    date: "June 17, 2025 – 4:30 PM",
  },
  {
    title: "Feedback Received",
    description:
      "Thanks for submitting your feedback! Our team will review it shortly.",
    date: "June 17, 2025 – 4:30 PM",
  },
  {
    title: "Expiring Current Plan",
    description:
      "Your current plan will expire in 3 days. Consider renewing or upgrading.",
    date: "June 17, 2025 – 4:30 PM",
  },
  {
    title: "Quiz Completed",
    description:
      "You've successfully completed the Aneuro cognitive quiz. Your responses have been recorded.",
    date: "June 17, 2025 – 4:30 PM",
  },
  {
    title: "Reminder Email Sent",
    description: "A follow-up reminder was sent to john@example.com.",
    date: "June 17, 2025 – 4:30 PM",
  },
];

export default function Notifications() {
  return (
    <div className="  p-6 text-white">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Notifications</h1>
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div
              key={i}
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
                <div className="text-gray-300 text-sm">{n.description}</div>
              </div>
              <div className="text-gray-400 text-xs whitespace-nowrap mt-1">
                {n.date}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-6 text-gray-400 text-sm">
          Displaying <span className="text-cyan-400 font-medium">25</span> of{" "}
          <a href="#" className="text-cyan-400 underline">
            1200
          </a>
        </div>
      </div>
    </div>
  );
}
