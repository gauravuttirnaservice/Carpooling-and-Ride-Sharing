import React, { useEffect, useState } from "react";
import { Users, ShieldCheck, FileText, CheckCircle, AlertTriangle, UserCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { BackButton, PageHeader, Card, EmptyState, Avatar, Badge } from "../../components/admindashboard/AdminUI";


const AdminUserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchUser, verifyAadhar, loading } = useAdminData();
    const [user, setUser] = useState(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const data = await fetchUser(id);
            if (data) setUser(data);
        };
        loadUser();
    }, [id, fetchUser]);

    const profilePic = user?.profilePicture
        ? `${import.meta.env.VITE_BACKEND_URL}${user?.profilePicture}`
        : "https://via.placeholder.com/150?text=Driver";

    const handleVerify = async () => {
        setVerifying(true);
        const success = await verifyAadhar(id);
        if (success) {
            setUser((prev) => ({ ...prev, aadharVerified: true }));
        }
        setVerifying(false);
    };

    if (loading && !user) return <div className="p-10 text-center">Loading User Profile...</div>;
    if (!user) return <EmptyState icon={Users} title="User not found" />;

    const isVerified = user.aadharVerified;

    return (
        <div className="space-y-4 sm:space-y-5 max-w-2xl">
            <BackButton onClick={() => navigate("/admin/users")} label="All Users" />
            <PageHeader title="User Profile" subtitle={`Viewing profile of ${user.firstName} ${user.lastName}`} />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[{ l: "Total Rides", v: user?.totalRides }, { l: "Total Bookings", v: user?.totalBookings }, { l: "Rating", v: user?.rating }].map(({ l, v }) => (
                    <Card key={l} className="p-3 sm:p-4 text-center">
                        <p className="text-xl sm:text-2xl font-black text-slate-800">{v}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{l}</p>
                    </Card>
                ))}
            </div>




            {/* Profile */}
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img src={profilePic} alt="" className="w-20 h-20 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        {/* <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-lg sm:text-xl font-black text-slate-800">{user.firstName} {user.lastName}</h2>
                            <Badge status={isVerified ? "verified" : "pending"} />
                        </div> */}
                        <p className="text-slate-500 text-xs sm:text-sm mb-2 break-all">{user.email} · {user.phoneNumber || "-"}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{user.dateOfBirth || "-"}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{user.address || "-"}</p>
                        <p className="text-xs text-slate-400 mt-2">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </Card>

            {/* KYC
            <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4"><FileText size={15} className="text-violet-500" /><h3 className="font-bold text-slate-800 text-sm sm:text-base">KYC — Aadhar Card</h3></div>
                <AadharCard />
                <div className={`flex items-start gap-2 p-3 rounded-xl my-4 ${isVerified ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                    {isVerified ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />}
                    <p className="text-xs sm:text-sm font-medium text-slate-700">{isVerified ? "Identity verified — Aadhar card authenticated successfully." : "Verification pending — Review Aadhar card details before approving."}</p>
                </div>
                {!isVerified && (
                    <button onClick={handleVerify} disabled={verifying}
                        className={`flex items-center gap-2 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${verifying ? "bg-slate-400" : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-200"}`}>
                        <UserCheck size={14} /> {verifying ? "Verifying..." : "Mark as Verified"}
                    </button>
                )}
            </Card> */}
        </div>
    );
};

export default AdminUserProfilePage;
