import Billinghistory from "../../components/subscription/billinghistory";
import Subscriptiontier from "../../components/subscription/subscriptiontier";
// import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  // const navigate = useNavigate();
  return (
    <div className="text-white">
      <div>
        <h1 className="text-[32px] font-medium inline-block pb-1">
          User Details
        </h1>
        <p className="text-[20px] opacity-70 mt-1">
          Let's make the day productive
        </p>
      </div>

      <div
        className="p-2 md:p-6 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
        style={{
          background: `
      radial-gradient(
        circle at bottom right,
        rgba(29, 116, 125, 0.4) 0%,
        transparent 30%
      ),
      #2A2A39
    `,
          backgroundBlendMode: "normal",
        }}
      >
        <div className="p-2  rounded-md mb-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-3  md:justify-between md:items-center">
            <div className="flex items-center gap-4">
              <img
                src="/Frame 1000006611.png"
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Devon Lane</p>
                <p className="text-sm text-gray-400">yourname@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* <button
                  onClick={() => navigate("/admin/manage-subscription/refund-request")}
                  className="bg-transparent cursor-pointer border border-gray-600 px-4 py-2 text-sm font-medium"
                >
                  View Refund Request
                </button> */}
            </div>
          </div>
        </div>

        <h1 className="text-[24px] font-medium inline-block pb-1 opacity-70">
          Subscription Tier
        </h1>
        <p className="text-[16px] opacity-70 mt-1">
          Download your previous plan receipts and useage details
        </p>

        <div className="flex flex-col gap-12">
          <Subscriptiontier />
          <Billinghistory />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
