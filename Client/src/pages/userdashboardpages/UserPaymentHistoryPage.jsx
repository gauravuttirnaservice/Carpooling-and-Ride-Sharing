import { useState, useEffect } from "react";
import UserNavbar from "../../components/userdashboard/layout/UserNavbar";
import axiosInstance from "../../utils/axiosInstance";
import React from "react";

const UserPaymentHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
      case "failed":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    }
  };

  const fetchHistory = async (targetPage = 1, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await axiosInstance.get(`/bookings/payment-history/user?page=${targetPage}&limit=10`);
      if (response.data.success) {
        const mappedData = response.data.data.map((item) => ({
          id: item.id,
          date: new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          from: item.ride?.origin || 'N/A',
          to: item.ride?.destination || 'N/A',
          amount: item.totalPrice,
          method: "Razorpay", // Default for now
          status: item.paymentStatus === 'paid' ? 'Successful' : item.paymentStatus === 'failed' ? 'Failed' : 'Pending',
        }));
        setTransactions(prev => reset ? mappedData : [...prev, ...mappedData]);
        setHasMore(targetPage < response.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch payment history", error);
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage, false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <UserNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-4">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Payment History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
            View all your past transactions, track expenses, and manage ride receipts.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  {["Date", "Route", "Amount", "Method", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-8 py-5 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/80">
                {transactions.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                          <span className="material-symbols-outlined text-[18px] text-slate-500 dark:text-slate-400">calendar_month</span>
                        </div>
                        <span className="text-[15px] font-bold text-slate-900 dark:text-white">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          {item.from}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-1 py-1">
                          {item.to}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-lg font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                      ₹{item.amount}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">
                          {item.method.toLowerCase().includes('card') ? 'credit_card' : item.method.toLowerCase().includes('cash') ? 'payments' : 'account_balance_wallet'}
                        </span>
                        <span className="text-[15px] font-medium text-slate-600 dark:text-slate-300">
                          {item.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right sm:text-left whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${getStatusStyles(
                          item.status,
                        )}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.status.toLowerCase() === 'successful' ? 'check_circle' : item.status.toLowerCase() === 'failed' ? 'cancel' : 'schedule'}
                        </span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loading indicator for initial load */}
          {loading && transactions.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm font-medium">Loading history...</div>
          )}

          {/* Empty state */}
          {!loading && transactions.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm font-medium">No payment history found.</div>
          )}
        </div>

        {/* Load More feature */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load More Transactions"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPaymentHistoryPage;
