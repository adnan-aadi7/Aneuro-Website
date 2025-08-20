import React, { useEffect } from "react";
import { ChevronDown, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPayments } from "../../../../../store/Slice/PaymentSlice";

export default function BillingHistoryTable({ user }) {
  const dispatch = useDispatch();
  const { userPayments, userPaymentsLoading, userPaymentsError } = useSelector(
    (state) => state.payment
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPayments(user._id));
    }
  }, [dispatch, user?._id]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format amount for display
  const formatAmount = (amount, currency = 'usd') => {
    return `${currency.toUpperCase()} $${Number(amount).toFixed(2)}`;
  };

  // Download single bill as CSV in a proper invoice format
  const downloadSingleBill = (payment) => {
    const csvEscape = (value) => {
      const str = value == null ? '' : String(value);
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const headers = [
      'Invoice Number',
      'Billing Date',
      'Amount',
      'Plan',
      'Status',
      'Customer Name',
      'Customer Email',
      'Users',
      'Payment ID',
      'Stripe Payment Intent',
      'Stripe Subscription ID',
    ];

    const values = [
      payment.stripePaymentIntentId
        ? `Invoice #${payment.stripePaymentIntentId.slice(-8)}`
        : `Payment #${payment._id?.slice(-8)}`,
      formatDate(payment.billingDate || payment.createdAt),
      formatAmount(payment.amount, payment.currency),
      payment.plan || '-',
      payment.status || '-',
      payment.name || (payment.userId && payment.userId.name) || '-',
      payment.customerEmail || payment.email || '-',
      payment.users || '-',
      payment._id || '-',
      payment.stripePaymentIntentId || 'N/A',
      payment.stripeSubscriptionId || 'N/A',
    ];

    const csvContent = [
      headers.map(csvEscape).join(','),
      values.map(csvEscape).join(','),
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_${payment._id?.slice(-8) || 'payment'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#2A2A39] ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-medium mb-2">
          Billing History
        </h1>
        <p className="text-slate-400 text-sm">
          Download your previous plan receipts and usage details
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-0 text-slate-300 font-medium text-sm">
                <div className="flex items-center gap-2">
                  Invoice
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Billing date
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Amount
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Plan
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Users
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                <Download size={16} className="text-teal-400" />
              </th>
            </tr>
          </thead>
          <tbody>
            {userPaymentsLoading ? (
              <tr>
                <td colSpan="6" className="text-center text-white py-8">
                  Loading billing history...
                </td>
              </tr>
            ) : userPaymentsError ? (
              <tr>
                <td colSpan="6" className="text-center text-red-400 py-8">
                  {userPaymentsError}
                </td>
              </tr>
            ) : userPayments && userPayments.length > 0 ? (
              userPayments.map((row, index) => (
                <tr key={row._id || index} className="border-b border-slate-700">
                  <td className="py-4 px-0 text-white text-sm">{row.invoiceNumber || row.stripeSubscriptionId || row._id || "-"}</td>
                  <td className="py-4 px-6 text-slate-300 text-sm">
                    {row.billingDate ? formatDate(row.billingDate) : "-"}
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-sm">
                    {row.amount ? formatAmount(row.amount, row.currency) : "-"}
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-sm">{row.plan || "-"}</td>
                  <td className="py-4 px-6 text-slate-300 text-sm">{row.users || "-"}</td>
                  <td className="py-4 px-6">
                    <button className="text-teal-400 hover:text-teal-300 transition-colors" onClick={() => downloadSingleBill(row)}>
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-white py-8">
                  No billing history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
