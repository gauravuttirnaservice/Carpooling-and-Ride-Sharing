import React, { useEffect, useState } from "react";
import { Ticket, IndianRupee, CreditCard } from "lucide-react";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { PageHeader, StatCard, FilterBar, Card, DataTable, TR, TD, EmptyState, Badge, Pagination } from "../../components/admindashboard/AdminUI";

const MobileBookingCard = ({ b }) => {
    const passengerName = b.passenger ? `${b.passenger.firstName || ""} ${b.passenger.lastName || ""}`.trim() : "Unknown";
    const dateStr = new Date(b.createdAt).toLocaleDateString();

    return (
        <div className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0"><Ticket size={14} className="text-violet-600" /></div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm">{passengerName}</p>
                        <p className="font-mono text-[10px] text-slate-500">B-{b.id} · R-{b.rideId}</p>
                    </div>
                    <Badge status={b.status} />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-400">{dateStr}</p>
                    <p className="text-sm font-black text-slate-800">₹{b.totalPrice}</p>
                </div>
            </div>
        </div>
    );
};

const AdminBookingsPage = () => {
    const { search } = useAdmin();
    const { fetchBookings, loading } = useAdminData();
    const [filter, setFilter] = useState("all");
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const limit = 10;

    useEffect(() => {
        const loadBookings = async () => {
            const result = await fetchBookings(page, limit, filter);
            if (result && result.data) {
                setBookings(result.data);
                setTotalPages(result.totalPages || 1);
                setTotalBookings(result.total || result.data.length);
            }
        };
        const timeoutId = setTimeout(() => loadBookings(), 300);
        return () => clearTimeout(timeoutId);
    }, [fetchBookings, page, filter, search]);

    useEffect(() => {
        setPage(1);
    }, [filter, search]);

    // Note: Revenue and completed count should ideally come from backend dashboard stats 
    // now that bookings are paginated.
    const revenue = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + parseFloat(b.totalPrice || 0), 0);
    const completed = bookings.filter((b) => b.status === "confirmed").length;

    return (
        <div className="space-y-5 sm:space-y-6">
            <PageHeader title="Bookings & Transactions" subtitle={`${totalBookings} total bookings`} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString()}`} icon={IndianRupee} gradient="from-emerald-500 to-teal-600" loading={loading} />
                <StatCard label="Confirmed Bookings" value={completed} icon={CreditCard} gradient="from-violet-500 to-indigo-600" loading={loading} />
            </div>
            <FilterBar options={["all", "pending", "confirmed", "cancelled"]} active={filter} onChange={setFilter} />
            <Card>
                <div className="hidden md:block">
                    <DataTable headers={["Booking ID", "Ride", "Passenger", "Date", "Total Price", "Status"]}>
                        {loading && bookings.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10">Loading bookings...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={6}><EmptyState icon={Ticket} title="No bookings found" subtitle="Try adjusting filters" /></td></tr>
                        ) : bookings.map((b) => {
                            const passengerName = b.passenger ? `${b.passenger.firstName || ""} ${b.passenger.lastName || ""}`.trim() : "Unknown";
                            const dateStr = new Date(b.createdAt).toLocaleDateString();
                            return (
                                <TR key={b.id}>
                                    <TD><span className="font-mono text-xs font-bold text-slate-500">B-{b.id}</span></TD>
                                    <TD><span className="font-mono text-xs font-bold text-slate-500">R-{b.rideId}</span></TD>
                                    <TD><span className="font-semibold text-slate-800">{passengerName}</span></TD>
                                    <TD>{dateStr}</TD>
                                    <TD><span className="font-black text-slate-800">₹{b.totalPrice}</span></TD>
                                    <TD><Badge status={b.status} /></TD>
                                </TR>
                            );
                        })}
                    </DataTable>
                </div>
                <div className="md:hidden">
                    {loading && bookings.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 text-sm">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                        <EmptyState icon={Ticket} title="No bookings found" subtitle="Try adjusting filters" />
                    ) : (
                        bookings.map((b) => <MobileBookingCard key={b.id} b={b} />)
                    )}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </Card>
        </div>
    );
};

export default AdminBookingsPage;
