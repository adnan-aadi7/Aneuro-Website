import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserPayments } from "../../../store/Slice/PaymentSlice";

const Billinghistory = ({ user }) => {
  const dispatch = useDispatch();
  const { userPayments, userPaymentsLoading, userPaymentsError } = useSelector((state) => state.payment);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPayments(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <div className="text-white w-full px-4 md:px-6">
      <div>
        <h1 className="text-[24px] font-medium opacity-90">Billing History</h1>
        <p className="text-[16px] opacity-70 mt-1">
          Download your previous plan receipts and usage details
        </p>
      </div>
      <div className="mt-6 w-full overflow-x-auto">
        <table className="w-full  border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left">
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Transaction ID
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Amount Paid
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Subscription Plan
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Billing Date
              </th>
              <th className="pb-2 border-b-2 border-slate-300 whitespace-nowrap px-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {userPaymentsLoading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : userPaymentsError ? (
              <tr><td colSpan="5" className="text-red-400">{userPaymentsError}</td></tr>
            ) : userPayments && userPayments.length > 0 ? (
              userPayments.map((item, idx) => (
                <tr key={item._id || idx} className="text-sm text-left">
                  <td className="py-3 border-b-2 border-slate-300  px-4">
                    {item.stripePaymentIntentId || item._id || "-"}
                  </td>
                  <td className="py-3 border-b-2 border-slate-300  px-4">
                    {item.amount ? `$${item.amount}` : "-"}
                  </td>
                  <td className="py-3 border-b-2 border-slate-300  px-4">
                    {item.plan || "-"}
                  </td>
                  <td className="py-3 border-b-2 border-slate-300  px-4">
                    {item.billingDate ? new Date(item.billingDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 border-b-2 border-slate-300  px-4">
                    <span className="bg-[#D9FDEB] text-[#2C6B47] px-3 py-1 text-xs font-medium rounded-full">
                      {item.status || "-"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">No billing history found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billinghistory;
