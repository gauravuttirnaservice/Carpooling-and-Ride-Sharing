import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Car, Ticket, Star as StarIcon, Settings, Menu, X } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { Avatar } from "./AdminUI";

const NAV = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Rides", icon: Car, path: "/admin/rides" },
    { label: "Bookings", icon: Ticket, path: "/admin/bookings" },
    { label: "Reviews", icon: StarIcon, path: "/admin/reviews" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const NavItem = ({ item, collapsed }) => {
    const { pathname } = useLocation();
    const { setSidebarOpen } = useAdmin();

    // Custom logic to check active state based on nested routes
    const active = pathname === item.path || (pathname.startsWith(item.path + "/") && item.path !== "/admin");
    const Icon = item.icon;

    return (
        <Link
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-0.5 transition-all relative group focus:outline-none ${collapsed ? "justify-center" : ""} ${active ? "text-white" : "text-slate-400 hover:text-white"}`}
        >
            {active && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-indigo-600/10 rounded-lg mx-2" />
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-400 rounded-full" />
                </>
            )}
            <Icon size={17} className={`relative z-10 flex-shrink-0 ${active ? "text-violet-400" : "group-hover:text-violet-300"}`} />
            {!collapsed && <span className="relative z-10 text-sm font-medium whitespace-nowrap">{item.label}</span>}
            {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                    {item.label}
                </div>
            )}
        </Link>
    );
};

const SidebarLogo = ({ collapsed }) => (
    <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg"><Car size={17} className="text-white" /></div>
        {!collapsed && (
            <div>
                <span className="font-black text-white text-base tracking-tight">RideAdmin</span>
                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Control Panel</p>
            </div>
        )}
    </div>
);

export const DesktopSidebar = () => {
    const { collapsed, setCollapsed } = useAdmin();
    return (
        <aside className={`hidden lg:flex fixed left-0 top-0 h-full bg-slate-900 flex-col z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
            <SidebarLogo collapsed={collapsed} />
            <nav className="flex-1 py-4 overflow-y-auto">{NAV.map((item) => <NavItem key={item.path} item={item} collapsed={collapsed} />)}</nav>
            <div className={`p-3 border-t border-slate-700/50 ${collapsed ? "flex justify-center" : ""}`}>
                <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full">
                    <Menu size={15} />{!collapsed && <span className="text-xs font-medium">Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export const MobileSidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useAdmin();
    return (
        <>
            {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
            <aside className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-slate-900 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg"><Car size={17} className="text-white" /></div>
                        <div><span className="font-black text-white text-base tracking-tight">RideAdmin</span><p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Control Panel</p></div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X size={17} /></button>
                </div>
                <nav className="flex-1 py-4 overflow-y-auto">{NAV.map((item) => <NavItem key={item.path} item={item} collapsed={false} />)}</nav>
                <div className="px-4 py-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <Avatar name="A" size="md" gradient="from-violet-500 to-indigo-600" />
                        <div><p className="text-sm font-bold text-white">Admin User</p><p className="text-xs text-slate-400">Super Administrator</p></div>
                    </div>
                </div>
            </aside>
        </>
    );
};
