import React, { useEffect, useState } from "react";
import { Users, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { PageHeader, Card, DataTable, TR, TD, EmptyState, Avatar, Badge, ActionBtn, Pagination } from "../../components/admindashboard/AdminUI";

const MobileUserCard = ({ user, onView }) => (
    <div className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
        <Avatar name={`${user.firstName} ${user.lastName}`} src={user.profilePicture} size="md" />
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <p className="text-xs text-slate-400">{user.phoneNumber || "-"}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge status={user.aadharVerified ? "verified" : "pending"} />
                    <ActionBtn onClick={onView} icon={Eye} label="View" variant="primary" />
                </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    </div>
);

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const { search } = useAdmin();
    const { fetchUsers, loading } = useAdminData();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 10;

    useEffect(() => {
        const loadUsers = async () => {
            const result = await fetchUsers(page, limit, search);
            if (result && result.data) {
                setUsers(result.data);
                setTotalPages(result.totalPages || 1);
                setTotalUsers(result.total || result.data.length);
            }
        };
        // Debounce search
        const timeoutId = setTimeout(() => {
            loadUsers();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchUsers, page, search]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <div className="space-y-5 sm:space-y-6">
            <PageHeader title="User Management" subtitle={`${totalUsers} registered users`} />
            <Card>
                <div className="hidden md:block">
                    <DataTable headers={["User", "Email", "Phone", "Joined", "Action"]}>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10">Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6}><EmptyState icon={Users} title="No users found" subtitle="Try adjusting your search" /></td></tr>
                        ) : users.map((u) => (
                            <TR key={u.id}>
                                <TD><div className="flex items-center gap-3"><Avatar name={`${u.firstName} ${u.lastName}`} src={u.profilePicture} size="md" /><span className="font-semibold text-slate-800 text-sm">{u.firstName} {u.lastName}</span></div></TD>
                                <TD>{u.email}</TD><TD>{u.phoneNumber || "-"}</TD>
                                <TD className="text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</TD>
                                <TD><ActionBtn onClick={() => navigate(`/admin/users/${u.id}`)} icon={Eye} label="View" variant="primary" /></TD>
                            </TR>
                        ))}
                    </DataTable>
                </div>
                <div className="md:hidden">
                    {loading && users.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 text-sm">Loading users...</div>
                    ) : users.length === 0 ? (
                        <EmptyState icon={Users} title="No users found" subtitle="Try adjusting your search" />
                    ) : (
                        users.map((u) => <MobileUserCard key={u.id} user={u} onView={() => navigate(`/admin/users/${u.id}`)} />)
                    )}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </Card>
        </div>
    );
};

export default AdminUsersPage;
