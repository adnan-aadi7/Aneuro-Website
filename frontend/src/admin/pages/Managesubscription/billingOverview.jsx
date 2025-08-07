import { ArrowDown, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../store/Slice/UserSlice";
import { fetchStripeProducts, fetchUserCardInfo } from "../../../store/Slice/PaymentSlice";

const BillingOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;

  const users = useSelector((state) => state.user.users);
  const usersLoading = useSelector((state) => state.user.usersLoading);
  const totalPages = useSelector((state) => state.user.totalPages);
  const stripeProducts = useSelector((state) => state.payment.products);
  const productsLoading = useSelector((state) => state.payment.productsLoading);

  useEffect(() => {
    dispatch(getAllUsers({ page, limit }));
    dispatch(fetchStripeProducts());
  }, [dispatch, page, limit]);
  console.log( "users subscription",users);

  // Helper to get price from Stripe products by plan name
  const getStripePrice = (plan) => {
    if (!stripeProducts || stripeProducts.length === 0 || !plan) return "-";
    const match = stripeProducts.find(
      (p) =>
        p.plan?.toLowerCase() === plan.toLowerCase() ||
        p.name?.toLowerCase() === plan.toLowerCase()
    );
    return match && match.price ? `$${match.price}` : "-";
  };

  const handleUserClick = (user) => {
    // Fetch user card information before navigating
    dispatch(fetchUserCardInfo(user._id));
    
    // Navigate to user detail page
    navigate("/admin/manage-subscription/user-detail", { state: { user } });
  };

  return (
    <div className="text-white">
      <h1 className="text-[32px] font-medium font-dmsans">Billing Overview</h1>
      <p className="opacity-70 text-[20px]">Let's make the day productive</p>

      <div
        className="p-6 mt-6 shadow-md text-white font-inter w-full"
        style={{
          backgroundImage: `url('/Frame 2.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-y-2 sm:border-spacing-y-0">
            <thead>
              <tr className="text-left text-sm font-semibold text-white ">
                <th className="font-dmsans py-4 px-6 border-b border-slate-300 whitespace-nowrap">
                  User Name{" "}
                  <span className="inline-block ">
                    <ArrowDown size={14} />
                  </span>
                </th>
                <th className="font-dmsans py-4 px-6 border-b border-slate-300 whitespace-nowrap">
                  Transaction ID{" "}
                </th>
                <th className="font-dmsans py-4 px-6 border-b border-slate-300 whitespace-nowrap">
                  Amount Paid
                </th>
                <th className="font-dmsans py-4 px-6 border-b border-slate-300 whitespace-nowrap">
                  Subscription Plan{" "}
                </th>
                <th className="font-dmsans py-4 px-6 border-b border-slate-300 whitespace-nowrap">
                  Status
                </th>
               
                
                <th className="font-dmsans py-4 px-6 border-b border-slate-300 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {usersLoading || productsLoading ? (
                <tr><td colSpan="9">Loading...</td></tr>
              ) : (
                users.map((user) => (
                  <tr
                    onClick={() => handleUserClick(user)}
                    key={user._id}
                    className="text-sm hover:bg-[#222431] transition-colors rounded-lg cursor-pointer"
                  >
                    <td className="flex flex-row items-center gap-2 px-6 py-4 border-b border-slate-300 ">
                      <img
                        src={user.profileImage || "/Frame 1000006611.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      {user.name}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-300 ">
                      {user.subscription?.stripeSubscriptionId || "-"}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-300 ">
                    {getStripePrice(user.subscription?.plan)}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-300 ">
                      {user.subscription?.plan || "N/A"}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-300 ">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full 
              ${
                user.subscription?.status === "active"
                  ? "bg-[#C2FFE3] text-[#1A7759]"
                  : user.subscription?.status === "inactive"
                  ? "bg-[#FFE3E3] text-[#A71D2A]"
                  : "bg-[#D2FFF8] text-[#007872]"
              }`}
                      >
                        {user.subscription?.status === "active"
                          ? "Paid"
                          : user.subscription?.status === "inactive"
                          ? "Unpaid"
                          : (user.subscription?.status || "N/A")}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-slate-300 ">
                     
                    </td>
                  
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex justify-center items-center gap-2 text-sm">
          <button
            className="px-2 py-1 text-white/70"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {[...Array(totalPages || 1)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`w-8 h-8 rounded-md ${
                page === idx + 1
                  ? "bg-[#00D1FF] text-black font-semibold"
                  : "bg-[#1B1D29] text-white/70"
              }`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-2 py-1 text-white/70"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingOverview;
