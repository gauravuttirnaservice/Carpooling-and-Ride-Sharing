import React, { useEffect, useState } from "react";
import { Car, Navigation, MapPin, Clock, Users, IndianRupee, ShieldCheck, CheckCircle, Ban } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { BackButton, PageHeader, Card, EmptyState, Badge, InfoRow, Avatar, ConfirmDialog } from "../../components/admindashboard/AdminUI";

const RouteInfoCard = ({ ride, isCancelled }) => {
    const depDate = new Date(ride.departureTime);
    const arrDate = ride.arrivalTime ? new Date(ride.arrivalTime) : null;

    return (
        <Card className="p-4 sm:p-5">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm sm:text-base"><Navigation size={14} className="text-violet-500" />Route Information</h3>
            <InfoRow icon={MapPin} label="From" value={ride.origin} />
            <InfoRow icon={MapPin} label="To" value={ride.destination} />
            <InfoRow icon={Clock} label="Departure" value={`${depDate.toLocaleDateString()} · ${depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
            <InfoRow icon={Clock} label="Arrival" value={arrDate ? `${arrDate.toLocaleDateString()} · ${arrDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "TBD"} />
            <InfoRow icon={Users} label="Seats" value={`${ride.availableSeats} available`} />
            <InfoRow icon={IndianRupee} label="Price" value={`₹${ride.pricePerSeat}/seat`} />
            <div className="mt-3"><Badge status={isCancelled ? "cancelled" : ride.status} /></div>
        </Card>
    );
};

const DriverCard = ({ ride, isDriverVerified, onVerify, verifying }) => {
    const driverName = ride.driver ? `${ride.driver.firstName || ""} ${ride.driver.lastName || ""}`.trim() : "Unknown";
    const profilePic = ride.driver?.profilePicture
        ? `${import.meta.env.VITE_BACKEND_URL}${ride.driver?.profilePicture}`
        : null;

    return (
        <Card className="p-4 sm:p-5">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm sm:text-base"><Car size={14} className="text-violet-500" />Driver & Vehicle</h3>
            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                {profilePic ? (
                    <img src={profilePic} alt={driverName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm bg-slate-200" />
                ) : (
                    <Avatar name={driverName} size="md" gradient="from-violet-400 to-indigo-600" />
                )}
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-800 text-sm">{driverName}</p><p className="text-xs text-slate-500">Driver</p></div>
                {isDriverVerified && <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"><CheckCircle size={10} />Verified</div>}
            </div>
            <InfoRow icon={Car} label="Car Name" value={ride.carName || "N/A"} />
            <InfoRow icon={Car} label="Car Number" value={ride.carNumber || "N/A"} />
            <InfoRow icon={ShieldCheck} label="Aadhar Card" value={ride.aadharCard || "N/A"} />
            {ride.drivingLicense && (
                <div className="flex items-start sm:items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                    <ShieldCheck size={13} className="text-slate-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="text-xs text-slate-500 w-24 flex-shrink-0">Driving License</span>
                    <a href={`${import.meta.env.VITE_BACKEND_URL}${ride.drivingLicense}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-violet-600 hover:underline break-all">View Document</a>
                </div>
            )}
            {!isDriverVerified && (
                <button onClick={onVerify} disabled={verifying} className={`mt-4 flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${verifying ? "bg-slate-400" : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"}`}>
                    <ShieldCheck size={14} /> {verifying ? "Verifying..." : "Verify Driver"}
                </button>
            )}
        </Card>
    );
};

const DriverOtherRides = ({ rides, currentRideId }) => {
    const otherRides = rides.filter(r => r.id !== currentRideId);

    // if (otherRides.length === 0) {
    //     return (
    //         <Card className="p-4 sm:p-5 mt-4">
    //             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm sm:text-base"><Car size={14} className="text-violet-500" />Driver's Other Rides (0)</h3>
    //             <p className="text-sm text-slate-500">No other rides found for this driver.</p>
    //         </Card>
    //     );
    // }

    // return (
    //     <Card className="p-4 sm:p-5 mt-4">
    //         <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm sm:text-base"><Car size={14} className="text-violet-500" />Driver's Other Rides ({otherRides.length})</h3>
    //         <div className="space-y-3">
    //             {otherRides.map(r => {
    //                 const d = new Date(r.departureTime);
    //                 return (
    //                     <div key={r.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
    //                         <div>
    //                             <p className="text-sm font-bold text-slate-800">{r.origin} → {r.destination}</p>
    //                             <p className="text-xs text-slate-500">{d.toLocaleDateString()} · {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    //                         </div>
    //                         <div className="flex items-center gap-2">
    //                             <Badge status={r.status} />
    //                             <a href={`/admin/rides/${r.id}`} className="text-xs font-semibold text-violet-600 hover:underline">View</a>
    //                         </div>
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //     </Card>
    // );
};

const AdminRideDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchRide, verifyDriver, cancelRide, loading } = useAdminData();

    const [originalRide, setOriginalRide] = useState(null);
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [driverVerified, setDriverVerified] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [allRides, setAllRides] = useState([]);

    useEffect(() => {
        const loadRide = async () => {
            const data = await fetchRide(id);
            if (data) {
                setOriginalRide(data);
                if (data.otherRides) {
                    setAllRides(data.otherRides);
                }
            }
        };
        loadRide();
    }, [id, fetchRide]);

    if (loading && !originalRide) return <div className="p-10 text-center">Loading Ride Data...</div>;
    if (!originalRide) return <EmptyState icon={Car} title="Ride not found" />;

    const isCancelled = cancelled || originalRide.status === "cancelled";
    const isDriverVerified = driverVerified !== null ? driverVerified : originalRide.driverVerified;

    const handleVerifyStatusChange = async () => {
        setActionLoading(true);
        const success = await verifyDriver(id);
        if (success) {
            setDriverVerified(true);
        }
        setActionLoading(false);
    };

    const handleCancelSubmit = async () => {
        setActionLoading(true);
        const success = await cancelRide(id);
        if (success) {
            setCancelled(true);
        }
        setActionLoading(false);
        setCancelModal(false);
    };

    const driverRides = allRides || [];

    return (
        <div className="space-y-4 sm:space-y-5 max-w-3xl">
            <BackButton onClick={() => navigate("/admin/rides")} label="All Rides" />
            <PageHeader title="Ride Details" subtitle={`${originalRide.origin} → ${originalRide.destination}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RouteInfoCard ride={originalRide} isCancelled={isCancelled} />
                <DriverCard ride={originalRide} isDriverVerified={isDriverVerified} onVerify={handleVerifyStatusChange} verifying={actionLoading} />
            </div>

            <DriverOtherRides rides={driverRides} currentRideId={id} />

            {!isCancelled && (
                <button onClick={() => setCancelModal(true)} disabled={actionLoading} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${actionLoading ? "bg-slate-200 text-slate-500" : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"}`}>
                    <Ban size={14} /> Force Cancel Ride
                </button>
            )}
            <ConfirmDialog open={cancelModal} onClose={() => setCancelModal(false)} title="Force Cancel Ride" danger
                message={`Are you sure you want to force cancel this ride (${originalRide.origin} → ${originalRide.destination})? This cannot be undone.`}
                onConfirm={handleCancelSubmit} />
        </div>
    );
};

export default AdminRideDetailPage;
