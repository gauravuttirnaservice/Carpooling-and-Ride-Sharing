import React, { useEffect, useState } from "react";
import { Star, Eye, EyeOff } from "lucide-react";
import { useAdmin } from "../../components/admindashboard/AdminContext";
import { useAdminData } from "../../hooks/useAdminData";
import { PageHeader, Card, Stars, Badge, Avatar, Pagination } from "../../components/admindashboard/AdminUI";

const RatingSummary = ({ reviews }) => {
    const valid = reviews.filter((r) => !r.isHidden);
    const avg = valid.length ? (valid.reduce((s, r) => s + parseFloat(r.rating || 0), 0) / valid.length).toFixed(1) : "—";

    return (
        <Card className="p-4 sm:p-5">
            <div className="flex items-start gap-5 sm:gap-8 flex-wrap sm:flex-nowrap">
                <div className="text-center flex-shrink-0">
                    <p className="text-4xl sm:text-5xl font-black text-slate-800">{avg}</p>
                    <Stars rating={Math.round(Number(avg === "—" ? 0 : avg))} />
                    <p className="text-xs text-slate-500 mt-1">{valid.length} reviews</p>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    {[5, 4, 3, 2, 1].map((n) => {
                        const count = valid.filter((r) => Math.round(parseFloat(r.rating || 0)) === n).length;
                        const pct = valid.length ? Math.round((count / valid.length) * 100) : 0;
                        return (
                            <div key={n} className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-5 text-right flex-shrink-0">{n}</span>
                                <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                                <span className="text-xs text-slate-400 w-4 flex-shrink-0">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};


const ReviewCard = ({ review, onToggleHide }) => {
    const reviewerName = review.reviewer ? `${review.reviewer.firstName || ""} ${review.reviewer.lastName || ""}`.trim() : "Unknown User";
    const rideInfo = review.ride ? `${review.ride.origin || "Unknown"} to ${review.ride.destination || "Unknown"}` : "Unknown Ride";

    return (
        <Card className={`p-4 sm:p-5 transition-all ${review.isHidden ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-3">
                <Avatar name={reviewerName} src={review.reviewer?.profilePicture} size="md" gradient="from-amber-400 to-orange-500" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <span className="font-bold text-slate-800 text-sm">{reviewerName}</span>
                            <Stars rating={parseFloat(review.rating || 0)} />
                            {review.isHidden && <Badge status="hidden" />}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => onToggleHide(review.id)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
                                {review.isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mt-2">{review.comment}</p>
                    <p className="text-xs text-slate-400 mt-1.5 font-mono">Ride: {rideInfo.toUpperCase()}</p>
                </div>
            </div>
        </Card>
    );
};

const AdminReviewsPage = () => {
    const { fetchReviews, moderateReview, loading } = useAdminData();
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const limit = 10;

    useEffect(() => {
        const loadReviews = async () => {
            const result = await fetchReviews(page, limit);
            if (result && result.data) {
                setReviews(result.data);
                setTotalPages(result.totalPages || 1);
                setTotalReviews(result.total || result.data.length);
            }
        };
        loadReviews();
    }, [fetchReviews, page]);

    const toggleHide = async (id) => {
        const success = await moderateReview(id);
        if (success) {
            setReviews((p) => p.map((r) => r.id === id ? { ...r, isHidden: !r.isHidden } : r));
        }
    };

    return (
        <div className="space-y-5 sm:space-y-6">
            <PageHeader title="Reviews & Moderation" subtitle={`${totalReviews} total reviews`} />
            {!loading && <RatingSummary reviews={reviews} />}
            <div className="space-y-3">
                {loading && reviews.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 text-sm">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 text-sm border rounded-xl bg-white border-slate-100 shadow-sm">No reviews found.</div>
                ) : (
                    reviews.map((r) => <ReviewCard key={r.id} review={r} onToggleHide={toggleHide} />)
                )}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default AdminReviewsPage;
