import React from "react";
import { Outlet } from "react-router-dom";
import { AdminProvider, useAdmin } from "./AdminContext";
import { DesktopSidebar, MobileSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { Toast } from "./AdminUI";

const AdminLayoutContent = () => {
    const { collapsed, toast } = useAdmin();
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        .admin-theme { font-family:'Sora',sans-serif; }
        .admin-theme * { font-family:'Sora',sans-serif; box-sizing:border-box; }
        @keyframes modalIn { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }
      `}</style>
            <div className="admin-theme min-h-screen bg-slate-50 text-slate-800">
                <DesktopSidebar />
                <MobileSidebar />
                <div className={`transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
                    <AdminTopbar />
                    <main className="p-4 sm:p-6 max-w-7xl mx-auto">
                        <Outlet />
                    </main>
                </div>
                <Toast message={toast.message} type={toast.type} visible={toast.visible} />
            </div>
        </>
    );
};

const AdminLayout = () => {
    return (
        <AdminProvider>
            <AdminLayoutContent />
        </AdminProvider>
    );
};

export default AdminLayout;
