import React from "react";
import { Menu, Home, ChevronRight, Search, Bell } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { useLocation, useNavigate } from "react-router-dom";

const LABELS = { admin: "Dashboard", users: "Users", rides: "Rides", bookings: "Bookings", reviews: "Reviews", settings: "Settings" };

export const AdminTopbar = () => {
    const { search, setSearch, setSidebarOpen } = useAdmin();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const parts = pathname.split("/").filter(Boolean);
    const base = parts.length > 1 ? parts[1] : "admin";
    const label = LABELS[base] || "Page";
    const isDetail = parts.length > 2;

    return (
        <header className="h-14 sm:h-16 bg-white border-b border-slate-100 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 gap-3">
            <div className="flex items-center gap-2 min-w-0">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"><Menu size={18} className="text-slate-600" /></button>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                    <Home size={12} className="flex-shrink-0" />
                    <ChevronRight size={10} />
                    <span className="text-slate-700 font-bold">{label}</span>
                    {isDetail && <><ChevronRight size={10} /><span className="text-slate-500">Detail</span></>}
                </div>
                <span className="sm:hidden text-sm font-bold text-slate-800 truncate">{label}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                <div className="relative hidden sm:block">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                        className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl w-36 md:w-48 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all" />
                </div>

                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
                    <div className="hidden md:block"><p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Admin</p><p className="text-[10px] sm:text-xs text-slate-400">Super Admin</p></div>
                </div>


                <div className="flex items-center pl-2 sm:pl-3 border-l border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 
               text-xs sm:text-sm font-semibold 
               text-slate-700 
               bg-slate-100 hover:bg-red-50 
               hover:text-red-600 
               rounded-lg 
               transition-all duration-200 
               active:scale-95"
                    >

                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};
