import React, { useEffect, useState } from "react";
import { Users, Car, Ticket, IndianRupee, Activity } from "lucide-react";
import { PageHeader, StatCard, Card, Pagination } from "../../components/admindashboard/AdminUI";
import { useAdminData } from "../../hooks/useAdminData";

const ACT_COLORS = {
    user: { bg: "bg-violet-100", text: "text-violet-600" },
    ride: { bg: "bg-blue-100", text: "text-blue-600" },
    booking: { bg: "bg-amber-100", text: "text-amber-600" },
};
const ACT_ICONS = { user: Users, ride: Car, booking: Ticket };

const ActivityFeed = ({ recentActivity, loading, page, setPage, totalPages }) => (
    <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4"><Activity size={16} className="text-violet-500" />
            <h2 className="font-bold text-slate-800 text-sm sm:text-base">Recent Activity</h2>
        </div>
        <div className="space-y-0.5">
            {loading ? (
                <div className="p-4 text-center text-slate-500 text-sm">Loading activity...</div>
            ) : (!recentActivity || recentActivity.length === 0) ? (
                <div className="p-4 text-center text-slate-500 text-sm">No recent activity.</div>
            ) : (
                recentActivity.map(({ id, text, time, type }) => {
                    const Icon = ACT_ICONS[type] || Users;
                    const c = ACT_COLORS[type] || ACT_COLORS.user;
                    const date = new Date(time);
                    const timeStr = isNaN(date.getTime()) ? time : `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    return (
                        <div key={id} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}><Icon size={13} className={c.text} /></div>
                            <p className="flex-1 text-xs sm:text-sm text-slate-700 leading-snug">{text}</p>
                            <span className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0">{timeStr}</span>
                        </div>
                    );
                })
            )}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </Card>
);

const AdminDashboardPage = () => {
    const { fetchStats, loading } = useAdminData();
    const [stats, setStats] = useState({ totalUsers: 0, getActiveRides: 0, totalBookings: 0, findTotalRevenue: 0, recentActivity: [], activityPage: 1, activityTotalPages: 1 });
    const [page, setPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchStats(page, limit);
            if (data) setStats(data);
        };
        loadStats();
    }, [fetchStats, page]);

    const STAT_ITEMS = [
        { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, gradient: "from-violet-500 to-indigo-600" },
        { label: "Active Rides", value: stats.getActiveRides.toLocaleString(), icon: Car, gradient: "from-cyan-500 to-blue-600" },
        { label: "Total Bookings", value: stats.totalBookings.toLocaleString(), icon: Ticket, gradient: "from-amber-500 to-orange-600" },
        { label: "Revenue", value: `₹${(stats.findTotalRevenue || 0).toLocaleString()}`, icon: IndianRupee, gradient: "from-emerald-500 to-teal-600" },
    ];

    return (
        <div className="space-y-5 sm:space-y-6">
            <PageHeader title="Dashboard Overview" subtitle="Welcome back, Admin. Here's what's happening today." />
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {STAT_ITEMS.map((s) => <StatCard key={s.label} {...s} loading={loading} />)}
            </div>
            <ActivityFeed recentActivity={stats.recentActivity} loading={loading} page={page} setPage={setPage} totalPages={stats.activityTotalPages} />
        </div>
    );
};

export default AdminDashboardPage;
