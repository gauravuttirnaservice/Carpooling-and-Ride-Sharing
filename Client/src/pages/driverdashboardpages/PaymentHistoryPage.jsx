import { useState, useEffect } from "react";
import DriverNavbar from "../../components/driverdashboard/layout/DriverNavbar";
import axiosInstance from "../../utils/axiosInstance";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchHistory = async (targetPage = 1, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await axiosInstance.get(`/bookings/payment-history/driver?page=${targetPage}&limit=10`);
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
        setPayments(prev => reset ? mappedData : [...prev, ...mappedData]);
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

  const getStatusStyles = (status) => {
    switch (status) {
      case "Successful":
        return "bg-primary/10 text-primary border-primary/20";
      case "Pending":
        return "bg-yellow-400/10 text-yellow-500 border-yellow-400/20";
      case "Failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50">
      <DriverNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12 mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Payment History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            View all your past transactions and ride details.
          </p>
        </div>

        {/* Payment Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Route
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Method
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm font-bold">
                      {payment.date}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {payment.from}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          to {payment.to}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-extrabold text-slate-900 dark:text-white">
                      ₹{payment.amount}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {payment.method}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && payments.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm font-medium">Loading history...</div>
          )}

          {!loading && payments.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm font-medium">No payment history found.</div>
          )}
        </div>

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

export default PaymentHistoryPage;
