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
  console.log("userPayments", userPayments);

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

  // Helpers for CSV numeric amount and currency split
  const getAmountNumber = (amount) => {
    const num = Number(amount || 0);
    return num.toFixed(2);
  };
  const getCurrency = (currency) => (currency || 'usd').toUpperCase();

  // Get invoice identifier to display (prefer Stripe invoiceId from metadata)
  const getInvoiceId = (payment) => {
    return (payment && payment.metadata && payment.metadata.invoiceId)
      || payment?.stripePaymentIntentId
      || payment?._id
      || 'N/A';
  };

  // Shorten invoice id for display (show first and last few chars)
  const getInvoiceShort = (payment) => {
    const full = getInvoiceId(payment);
    if (!full || full === 'N/A') return 'Invoice #N/A';
    const str = String(full);
    const head = str.slice(0, 6);
    const tail = str.slice(-6);
    return `${head}...${tail}`;
  };

  // Slug for filenames using invoice id
  const getInvoiceSlug = (payment) => {
    const full = getInvoiceId(payment);
    if (!full || full === 'N/A') return 'payment';
    const str = String(full);
    return `${str.slice(0, 6)}_${str.slice(-6)}`;
  };

  const formatPlanLabel = (plan) => {
    if (!plan) return '';
    return String(plan).charAt(0).toUpperCase() + String(plan).slice(1);
  };

  // Build Excel-compatible HTML table with column widths sized to content
  const exportAsExcelHtml = (headers, rows, filename) => {
    // Compute width per column by character length
    const colWidthsPx = headers.map((h, colIdx) => {
      const headerLen = String(h).length;
      const maxDataLen = rows.reduce((max, r) => {
        const cell = r[colIdx] == null ? '' : String(r[colIdx]);
        return Math.max(max, cell.length);
      }, 0);
      const chars = Math.max(headerLen, maxDataLen) + 2; // padding
      const px = Math.min(500, Math.max(60, Math.round(chars * 8))); // clamp
      return px;
    });

    const colgroup = colWidthsPx
      .map((w) => `<col style="width:${w}px;">`)
      .join('');

    const thead = `<thead><tr>${headers
      .map((h) => `<th style="text-align:left;border:1px solid #ddd;padding:6px;background:#f3f4f6;">${h}</th>`) 
      .join('')}</tr></thead>`;

    const tbody = `<tbody>${rows
      .map(
        (r) =>
          `<tr>${r
            .map((c) => `<td style="text-align:left;border:1px solid #ddd;padding:6px;">${c == null ? '' : String(c)}</td>`)
            .join('')}</tr>`
      )
      .join('')}</tbody>`;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
      <table style="border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:12px;">
        <colgroup>${colgroup}</colgroup>
        ${thead}
        ${tbody}
      </table>
    </body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.xls') ? filename : `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download single bill as Excel (HTML table export)
  const downloadSingleBill = (payment) => {
    const headers = [
      'Invoice',
      'Billing date',
      'Amount',
      'Currency',
      'Plan',
      'Status',
      'Customer Email',
      'Payment ID',
      'Stripe Payment Intent ID',
      'Stripe Subscription ID'
    ];

    const row = [
      getInvoiceId(payment),
      formatDate(payment.createdAt),
      getAmountNumber(payment.amount),
      getCurrency(payment.currency),
      formatPlanLabel(payment.plan),
      payment.status,
      payment.customerEmail,
      payment._id,
      (payment.stripePaymentIntentId || 'N/A'),
      (payment.stripeSubscriptionId || 'N/A')
    ];

    exportAsExcelHtml(headers, [row], `invoice_${getInvoiceSlug(payment)}`);
  };

  // Download all bills as Excel (HTML table export)
  const downloadAllBills = () => {
    if (!userPayments || userPayments.length === 0) {
      alert('No billing data available to download');
      return;
    }

    // Create headers
    const headers = [
      'Invoice',
      'Billing date',
      'Amount',
      'Currency',
      'Plan',
      'Status',
      'Customer Email',
      'Payment ID',
      'Stripe Payment Intent ID',
      'Stripe Subscription ID'
    ];

    // Create data rows
    const dataRows = userPayments.map(payment => [
      getInvoiceId(payment),
      formatDate(payment.createdAt),
      getAmountNumber(payment.amount),
      getCurrency(payment.currency),
      formatPlanLabel(payment.plan),
      payment.status,
      payment.customerEmail,
      payment._id,
      payment.stripePaymentIntentId || 'N/A',
      payment.stripeSubscriptionId || 'N/A'
    ]);

    exportAsExcelHtml(headers, dataRows, `billing_history_${new Date().toISOString().split('T')[0]}`);
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
                    <div className="text-gray-100 font-medium pl-6 py-4" title={getInvoiceId(payment)}>
                      {getInvoiceShort(payment)}
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
