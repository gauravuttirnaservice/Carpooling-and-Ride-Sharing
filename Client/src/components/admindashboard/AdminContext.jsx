import { createContext, useContext, useState, useCallback } from "react";

export const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const showToast = useCallback((message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    return (
        <AdminContext.Provider value={{ search, setSearch, sidebarOpen, setSidebarOpen, collapsed, setCollapsed, toast, showToast }}>
            {children}
        </AdminContext.Provider>
    );
};
