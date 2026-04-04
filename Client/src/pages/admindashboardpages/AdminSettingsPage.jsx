import React, { useEffect, useState } from "react";
import { MapPin, Map, Plus, Trash } from "lucide-react";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { PageHeader, Card, Modal, ConfirmDialog, EmptyState } from "../../components/admindashboard/AdminUI";

const CityRow = ({ city, onDelete }) => (
    <div className="flex flex-col px-4 sm:px-5 py-3.5 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0"><MapPin size={13} className="text-violet-600" /></div>
                <div className="min-w-0"><p className="font-bold text-slate-800 text-sm truncate">{city.CityName || city.name || "Unknown City"}</p></div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button onClick={() => onDelete(city.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500"><Trash size={13} /></button>
            </div>
        </div>
        {city.points && city.points.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-11">
                {city.points.map(p => (
                    <span key={p.id} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {p.PointName}
                    </span>
                ))}
            </div>
        )}
    </div>
);

const CityFormModal = ({ open, onClose, onSave, loading }) => {
    const [name, setName] = useState("");
    const [points, setPoints] = useState([""]);
    const [error, setError] = useState("");

    const handleAddPoint = () => setPoints([...points, ""]);
    const handlePointChange = (index, value) => {
        const newPoints = [...points];
        newPoints[index] = value;
        setPoints(newPoints);
        setError(""); // Clear error when typing
    };
    const handleRemovePoint = (index) => {
        setPoints(points.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!name.trim()) {
            setError("City Name is required");
            return;
        }
        const validPoints = points.filter(p => p.trim());
        if (validPoints.length === 0) {
            setError("At least one valid point is required");
            return;
        }

        setError("");
        onSave(name.trim(), validPoints);

        // Let the parent component handle closing. Here we reset everything
        setName("");
        setPoints([""]);
    };

    const handleClose = () => {
        setName("");
        setPoints([""]);
        setError("");
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title="Add New City with Points">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-sm font-semibold rounded-lg border border-red-100">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">City Name</label>
                    <input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        placeholder="e.g. Ahmedabad"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-white"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider flex justify-between items-center">
                        Pick-up / Drop Points
                    </label>
                    <div className="space-y-2">
                        {points.map((point, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={point}
                                    onChange={(e) => handlePointChange(index, e.target.value)}
                                    placeholder="e.g. Airport, Station..."
                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-white"
                                />
                                {points.length > 1 && (
                                    <button onClick={() => handleRemovePoint(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash size={16} /></button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddPoint} className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"><Plus size={12} /> Add another point</button>
                </div>
                <button onClick={handleSave} disabled={loading} className={`w-full text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-violet-200 ${loading ? "bg-slate-400" : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"}`}>
                    {loading ? "Adding..." : "Add City"}
                </button>
            </div>
        </Modal>
    );
};

const AdminSettingsPage = () => {
    const { fetchCities, addCityWithPoints, deleteCity } = useAdminData();
    const [cities, setCities] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCities = async () => {
            setLoading(true);
            const data = await fetchCities();
            if (data) setCities(data);
            setLoading(false);
        };
        loadCities();
    }, [fetchCities]);

    const handleSave = async (cityName, points) => {
        setActionLoading(true);
        const newCity = await addCityWithPoints({ CityName: cityName, Points: points });
        if (newCity) {
            const data = await fetchCities();
            if (data) setCities(data);
        }
        setActionLoading(false);
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        setActionLoading(true);
        const success = await deleteCity(id);
        if (success) {
            setCities((p) => p.filter((c) => c.id !== id));
        }
        setActionLoading(false);
        setDeleteModal(null);
    };

    return (
        <div className="space-y-5 sm:space-y-6 max-w-2xl">
            <PageHeader title="System Configuration" subtitle="Manage supported cities and platform settings" />

            <Card>
                <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2"><Map size={15} className="text-violet-500" /><h2 className="font-bold text-slate-800 text-sm sm:text-base">City Management</h2><span className="bg-violet-100 text-violet-700 text-xs font-black px-2 py-0.5 rounded-full">{cities.length}</span></div>
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm shadow-violet-200">
                        <Plus size={13} /><span className="hidden sm:inline">Add City</span><span className="sm:hidden">Add</span>
                    </button>
                </div>
                <div>
                    {loading ? (
                        <div className="p-10 text-center text-slate-500 text-sm">Loading cities...</div>
                    ) : cities.length === 0 ? (
                        <EmptyState icon={MapPin} title="No cities configured" subtitle="Add your first city below." />
                    ) : (
                        cities.map((c) => <CityRow key={c.id} city={c} onDelete={(id) => setDeleteModal(id)} />)
                    )}
                </div>
            </Card>
            <CityFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} loading={actionLoading} />
            <ConfirmDialog open={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={() => handleDelete(deleteModal)} title="Delete City" danger message="Are you sure you want to remove this city? All associated rides may be affected." />
        </div>
    );
};

export default AdminSettingsPage;
