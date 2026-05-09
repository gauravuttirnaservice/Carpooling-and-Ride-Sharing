import React from "react";
import { X, CheckCircle, Star, AlertTriangle, TrendingUp, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";

export const BADGE_MAP = {
    verified: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-100   text-amber-700   border border-amber-200",
    scheduled: "bg-blue-100    text-blue-700    border border-blue-200",
    ongoing: "bg-violet-100  text-violet-700  border border-violet-200",
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-100     text-red-700     border border-red-200",
    confirmed: "bg-cyan-100    text-cyan-700    border border-cyan-200",
    active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    inactive: "bg-slate-100   text-slate-500   border border-slate-200",
    hidden: "bg-slate-100   text-slate-500   border border-slate-200",
};

export const Badge = ({ status }) => {
    const key = String(status);
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${BADGE_MAP[key] || BADGE_MAP.pending}`}>{key}</span>;
};

export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
);

export const Modal = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: "modalIn .2s ease-out" }}>
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><X size={17} /></button>
                </div>
                <div className="px-5 sm:px-6 py-5">{children}</div>
            </div>
        </div>
    );
};

export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, danger }) => (
    <Modal open={open} onClose={onClose} title={title}>
        <div className="flex items-start gap-3 mb-5">
            <div className={`p-2 rounded-xl flex-shrink-0 ${danger ? "bg-red-100" : "bg-amber-100"}`}>
                <AlertTriangle size={17} className={danger ? "text-red-500" : "text-amber-500"} />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} className={`px-4 py-2 text-sm rounded-xl text-white font-semibold ${danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"} transition-colors`}>Confirm</button>
        </div>
    </Modal>
);

export const Toast = ({ message, type, visible }) => (
    <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:w-auto z-[100] flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"} ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
        {type === "success" ? <CheckCircle size={15} className="flex-shrink-0" /> : <X size={15} className="flex-shrink-0" />}
        {message}
    </div>
);

export const Stars = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} className={i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} />)}
    </div>
);

export const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3"><Icon size={22} className="text-slate-400" /></div>
        <p className="font-bold text-slate-600 text-sm mb-1">{title}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
);

export const FilterBar = ({ options, active, onChange }) => (
    <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
            <button key={opt} onClick={() => onChange(opt)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all ${active === opt ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600"}`}>
                {opt}
            </button>
        ))}
    </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
    <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">{title}</h1>
            {subtitle && <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{subtitle}</p>}
        </div>
        {action}
    </div>
);

export const StatCard = ({ label, value, icon: Icon, gradient, change }) => (
    <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
            {change && <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg"><TrendingUp size={10} />{change}</span>}
        </div>
        <p className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">{value}</p>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>
    </Card>
);

export const BackButton = ({ onClick, label = "Back" }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 font-semibold transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors"><ChevronRight size={14} className="rotate-180" /></div>
        {label}
    </button>
);

export const Avatar = ({ name, src, size = "md", gradient = "from-violet-400 to-indigo-500" }) => {
    const sz = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl" };
    if (src) {
        const imgSrc = getImageUrl(src, name);
        return (
            <div className={`rounded-xl flex-shrink-0 overflow-hidden ${sz[size]}`}>
                <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
            </div>
        );
    }
    return <div className={`rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black flex-shrink-0 ${sz[size]}`}>{name?.[0] || "?"}</div>;
};

export const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start sm:items-center gap-3 py-2 border-b border-slate-50 last:border-0">
        {Icon && <Icon size={13} className="text-slate-400 flex-shrink-0 mt-0.5 sm:mt-0" />}
        <span className="text-xs text-slate-500 w-24 flex-shrink-0">{label}</span>
        <span className="text-sm font-semibold text-slate-800 break-all">{value}</span>
    </div>
);

export const ActionBtn = ({ onClick, icon: Icon, label, variant = "primary" }) => {
    const s = { primary: "bg-violet-50 text-violet-600 hover:bg-violet-100", danger: "bg-red-50 text-red-600 hover:bg-red-100", ghost: "bg-slate-50 text-slate-600 hover:bg-slate-100" };
    return <button onClick={onClick} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${s[variant]}`}>{Icon && <Icon size={12} />}{label}</button>;
};

export const DataTable = ({ headers, children }) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[580px]">
            <thead><tr className="border-b border-slate-100">{headers.map((h) => <th key={h} className="text-left px-4 sm:px-5 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);
export const TR = ({ children }) => <tr className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">{children}</tr>;
export const TD = ({ children, className = "" }) => <td className={`px-4 sm:px-5 py-3 sm:py-4 text-sm text-slate-600 ${className}`}>{children}</td>;

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Prev
            </button>
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Only show 5 pages around the current page, or first/last
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold transition-all ${currentPage === page ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-slate-600 hover:bg-slate-100"}`}
                            >
                                {page}
                            </button>
                        );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-slate-400 text-xs sm:text-sm px-1">...</span>;
                    }
                    return null;
                })}
            </div>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};
