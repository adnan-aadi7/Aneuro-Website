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

  // Helpers matching client BillingHistory template
  const getAmountNumber = (amount) => {
    const num = Number(amount || 0);
    return num.toFixed(2);
  };
  const getCurrency = (currency) => (currency || 'usd').toUpperCase();
  const getInvoiceId = (payment) => {
    return (payment && payment.metadata && payment.metadata.invoiceId)
      || payment?.stripePaymentIntentId
      || payment?._id
      || 'N/A';
  };
  const getInvoiceShort = (payment) => {
    const full = getInvoiceId(payment);
    if (!full || full === 'N/A') return 'N/A';
    const str = String(full);
    const head = str.slice(0, 6);
    const tail = str.slice(-6);
    return `${head}...${tail}`;
  };
  const getInvoiceSlug = (payment) => {
    const full = getInvoiceId(payment);
    if (!full || full === 'N/A') return 'payment';
    const str = String(full);
    return `${str.slice(0, 6)}_${str.slice(-6)}`;
  };

  // Excel-compatible HTML export with auto-sized columns
  const exportAsExcelHtml = (headers, rows, filename) => {
    const colWidthsPx = headers.map((h, colIdx) => {
      const headerLen = String(h).length;
      const maxDataLen = rows.reduce((max, r) => {
        const cell = r[colIdx] == null ? '' : String(r[colIdx]);
        return Math.max(max, cell.length);
      }, 0);
      const chars = Math.max(headerLen, maxDataLen) + 2;
      const px = Math.min(500, Math.max(60, Math.round(chars * 8)));
      return px;
    });

    const colgroup = colWidthsPx.map((w) => `<col style="width:${w}px;">`).join('');
    const thead = `<thead><tr>${headers.map((h) => `<th style="text-align:left;border:1px solid #ddd;padding:6px;background:#f3f4f6;">${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td style="text-align:left;border:1px solid #ddd;padding:6px;">${c == null ? '' : String(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table style="border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:12px;"><colgroup>${colgroup}</colgroup>${thead}${tbody}</table></body></html>`;

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

  // Download all bills as Excel (match table columns)
  const downloadAllBills = () => {
    if (!userPayments || userPayments.length === 0) {
      alert('No billing data available to download');
      return;
    }

    const headers = [
      'Invoice',
      'Billing date',
      'Amount',
      'Currency',
      'Plan',
      'Users',
      'Status',
      'Customer Email',
      'Payment ID',
      'Stripe Payment Intent ID',
      'Stripe Subscription ID',
    ];

    const rows = userPayments.map((p) => [
      getInvoiceId(p),
      p.billingDate ? formatDate(p.billingDate) : (p.createdAt ? formatDate(p.createdAt) : ''),
      getAmountNumber(p.amount),
      getCurrency(p.currency),
      p.plan || '-',
      p.users || '-',
      p.status || '-',
      p.customerEmail || p.email || '-',
      p._id || '-',
      p.stripePaymentIntentId || 'N/A',
      p.stripeSubscriptionId || 'N/A',
    ]);

    exportAsExcelHtml(headers, rows, `billing_history_${new Date().toISOString().split('T')[0]}`);
  };

  // Download single bill as Excel (match client template)
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
      'Stripe Subscription ID',
    ];

    const row = [
      getInvoiceId(payment),
      formatDate(payment.billingDate || payment.createdAt),
      getAmountNumber(payment.amount),
      getCurrency(payment.currency),
      payment.plan || '-',
      payment.status || '-',
      payment.customerEmail || payment.email || '-',
      payment._id || '-',
      payment.stripePaymentIntentId || 'N/A',
      payment.stripeSubscriptionId || 'N/A',
    ];

    exportAsExcelHtml(headers, [row], `invoice_${getInvoiceSlug(payment)}`);
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
                <button onClick={downloadAllBills} title="Download all" className="text-teal-400 hover:text-teal-300">
                  <Download size={16} />
                </button>
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
                  <td className="py-4 px-0 text-white text-sm" title={getInvoiceId(row)}>{getInvoiceShort(row)}</td>
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
