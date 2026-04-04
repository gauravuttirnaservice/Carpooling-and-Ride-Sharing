import React, { useEffect, useState } from "react";
import { Car, Eye, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { PageHeader, FilterBar, Card, DataTable, TR, TD, EmptyState, Badge, ActionBtn, Pagination } from "../../components/admindashboard/AdminUI";

const MobileRideCard = ({ ride, onView }) => {
    const d = new Date(ride.departureTime);
    const dateStr = d.toLocaleDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const driverName = ride.driver ? `${ride.driver.firstName || ""} ${ride.driver.lastName || ""}`.trim() : "Unknown";

    return (
        <div className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><Car size={15} className="text-blue-600" /></div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm flex items-center gap-1"><MapPin size={11} className="text-violet-500 flex-shrink-0" />{ride.origin} → {ride.destination}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{driverName}</p>
                        <p className="text-xs text-slate-400">{dateStr} · {timeStr}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <Badge status={ride.status} /><p className="text-xs font-bold text-slate-700">₹{ride.pricePerSeat}/seat</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-slate-400">{ride.availableSeats} seats · {ride.carName}</p>
                    <ActionBtn onClick={onView} icon={Eye} label="View" variant="primary" />
                </div>
            </div>
        </div>
    );
};

const AdminRidesPage = () => {
    const navigate = useNavigate();
    const { search } = useAdmin();
    const [rides, setRides] = useState([]);
    const [page, setPage] = useState(1);
    const { fetchRides, filter, setFilter, loading } = useAdminData();

    const [totalPages, setTotalPages] = useState(1);
    const [totalRides, setTotalRides] = useState(0);
    const limit = 10;

    useEffect(() => {
        const loadRides = async () => {
            const result = await fetchRides(page, limit, filter, search);

            if (result && result.data) {
                setRides(result.data);
                setTotalPages(result.totalPages || 1);
                setTotalRides(result.total || result.data.length);
            }
        };

        const timeoutId = setTimeout(loadRides, 300);

        return () => clearTimeout(timeoutId);
    }, [fetchRides, page, limit, filter, search]);

    // Reset page when filter or search changes
    useEffect(() => {
        setPage(1);
    }, [filter, search]);

    return (
        <div className="space-y-5 sm:space-y-6">
            <PageHeader title="Ride Management" subtitle={`${totalRides} total rides`} />
            <FilterBar options={["all", "scheduled", "ongoing", "completed", "cancelled"]} active={filter} onChange={setFilter} />
            <Card>
                <div className="hidden md:block">
                    <DataTable headers={["Route", "Departure", "Seats", "Price/Seat", "Driver", "Status", "Action"]}>
                        {loading && rides.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-10">Loading rides...</td></tr>
                        ) : rides.length === 0 ? (
                            <tr><td colSpan={7}><EmptyState icon={Car} title="No rides found" subtitle="Try adjusting your filters" /></td></tr>
                        ) : rides.map((r) => {
                            const d = new Date(r.departureTime);
                            const driverName = r.driver ? `${r.driver.firstName || ""} ${r.driver.lastName || ""}`.trim() : "Unknown";
                            return (
                                <TR key={r.id}>
                                    <TD><div className="flex items-center gap-2"><MapPin size={12} className="text-violet-500 flex-shrink-0" /><span className="font-semibold text-slate-800 text-sm whitespace-nowrap">{r.origin} → {r.destination}</span></div></TD>
                                    <TD className="whitespace-nowrap">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {d.toLocaleDateString()}</TD>
                                    <TD>{r.availableSeats}</TD>
                                    <TD><span className="font-bold text-slate-800">₹{r.pricePerSeat}</span></TD>
                                    <TD>{driverName}</TD>
                                    <TD><Badge status={r.status} /></TD>
                                    <TD><ActionBtn onClick={() => navigate(`/admin/rides/${r.id}`)} icon={Eye} label="View" variant="primary" /></TD>
                                </TR>
                            );
                        })}
                    </DataTable>
                </div>
                <div className="md:hidden">
                    {loading && rides.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 text-sm">Loading rides...</div>
                    ) : rides.length === 0 ? (
                        <EmptyState icon={Car} title="No rides found" subtitle="Try adjusting your filters" />
                    ) : (
                        rides.map((r) => <MobileRideCard key={r.id} ride={r} onView={() => navigate(`/admin/rides/${r.id}`)} />)
                    )}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </Card>
        </div>
    );
};

export default AdminRidesPage;
