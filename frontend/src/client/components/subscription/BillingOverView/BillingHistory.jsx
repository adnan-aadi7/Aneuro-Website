import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download } from "lucide-react";
import { fetchUserPayments } from "../../../../store/Slice/PaymentSlice";

const BillingHistory = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { userPayments, userPaymentsLoading, userPaymentsError } = useSelector((state) => state.payment);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPayments(userId));
    }
  }, [dispatch, userId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format amount for display
  const formatAmount = (amount, currency = 'usd') => {
    return `${currency.toUpperCase()} $${amount.toFixed(2)}`;
  };

  // Download single bill as Excel
  const downloadSingleBill = (payment) => {
    const data = [
      ['Invoice Details'],
      [''],
      ['Invoice Number:', payment.stripePaymentIntentId ? `Invoice #${payment.stripePaymentIntentId.slice(-8)}` : `Payment #${payment._id?.slice(-8)}`],
      ['Date:', formatDate(payment.createdAt)],
      ['Amount:', formatAmount(payment.amount, payment.currency)],
      ['Plan:', payment.plan],
      ['Status:', payment.status],
      ['Customer Email:', payment.customerEmail],
      [''],
      ['Payment ID:', payment._id],
      ['Stripe Payment Intent:', payment.stripePaymentIntentId || 'N/A'],
      ['Stripe Subscription ID:', payment.stripeSubscriptionId || 'N/A'],
    ];

    // Convert to CSV format
    const csvContent = data.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_${payment._id?.slice(-8) || 'payment'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all bills as Excel
  const downloadAllBills = () => {
    if (!userPayments || userPayments.length === 0) {
      alert('No billing data available to download');
      return;
    }

    // Create headers
    const headers = [
      'Invoice Number',
      'Date',
      'Amount',
      'Plan',
      'Status',
      'Customer Email',
      'Payment ID',
      'Stripe Payment Intent',
      'Stripe Subscription ID'
    ];

    // Create data rows
    const dataRows = userPayments.map(payment => [
      payment.stripePaymentIntentId ? `Invoice #${payment.stripePaymentIntentId.slice(-8)}` : `Payment #${payment._id?.slice(-8)}`,
      formatDate(payment.createdAt),
      formatAmount(payment.amount, payment.currency),
      payment.plan,
      payment.status,
      payment.customerEmail,
      payment._id,
      payment.stripePaymentIntentId || 'N/A',
      payment.stripeSubscriptionId || 'N/A'
    ]);

    // Combine headers and data
    const allData = [headers, ...dataRows];
    const csvContent = allData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `billing_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" text-white mt-10">
      <div className="max-w-full mx-auto ">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-4xl font-bold mb-5">Billing History</h1>
            <p className="text-gray-400 text-base">
              Download your previous plan receipts and usage details
            </p>
          </div>
          <button 
            className="bg-cyan-400 hover:bg-cyan-300 text-gray-900 px-4 py-2 font-medium transition-colors mt-10 ml-1"
            onClick={downloadAllBills}
            disabled={!userPayments || userPayments.length === 0}
          >
            Download All
          </button>
        </div>

        {/* Loading State */}
        {userPaymentsLoading && (
          <div className="bg-[#2A2A39] p-8 text-center">
            <div className="text-white text-lg">Loading billing history...</div>
          </div>
        )}

        {/* Error State */}
        {userPaymentsError && (
          <div className="bg-[#2A2A39] p-8 text-center">
            <div className="text-red-400 text-lg">Error loading billing history: {userPaymentsError}</div>
          </div>
        )}

        {/* Table */}
        {!userPaymentsLoading && !userPaymentsError && (
          <div className="bg-[#2A2A39]  shadow-lg overflow-hidden mt-6">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-0 p-0 bg-[#2A2A39] text-white text-sm font-bold border-b border-gray-700">
              <div className="pl-6 py-4 flex items-center gap-2">
                <span>Invoice</span>
                <Download className="w-4 h-4" />
              </div>
              <div className="pl-4 py-4">Billing date</div>
              <div className="pl-4 py-4">Amount</div>
              <div className="pl-4 py-4">Plan</div>
              <div className="pl-4 py-4">Status</div>
              <div className="pl-4 py-4">Action</div>
            </div>

            {/* Table Body */}
            <div>
              {userPayments && userPayments.length > 0 ? (
                userPayments.map((payment, index) => (
                  <div
                    key={payment._id || index}
                    className="grid grid-cols-6 gap-0 border-b border-gray-700 hover:bg-[#262634] transition-colors items-center"
                  >
                    <div className="text-gray-100 font-medium pl-6 py-4">
                      {payment.stripePaymentIntentId ? `Invoice #${payment.stripePaymentIntentId.slice(-8)}` : `Payment #${payment._id?.slice(-8) || index + 1}`}
                    </div>
                    <div className="text-gray-100 pl-4 py-4">
                      {formatDate(payment.createdAt)}
                    </div>
                    <div className="text-gray-100 pl-4 py-4">
                      {formatAmount(payment.amount, payment.currency)}
                    </div>
                    <div className="text-gray-100 pl-4 py-4 capitalize">
                      {payment.plan}
                    </div>
                    <div className="text-gray-100 pl-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="pl-4 py-4">
                      <button 
                        onClick={() => downloadSingleBill(payment)}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-5 h-5 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No billing history found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingHistory;
