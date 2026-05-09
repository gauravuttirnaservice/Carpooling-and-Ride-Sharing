import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/getImageUrl";

const RideCard = ({ ride, onCancel }) => {
  const isCancelled = ride.status === "cancelled" || ride.status === "rejected";
  const isPending = ride.status === "pending";
  const isOngoing = ride.status === "ongoing";
  const isUpcoming = ride.status === "upcoming" || ride.status === "scheduled" || ride.status === "approved";
  const isCompleted = ride.status === "completed";

  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/reviews', {
        rideId: ride.rideId,
        rating: rating,
        comment: reviewText
      });

      if (response.data.success) {
        toast.success(response.data.message, { position: "top-center" });
        setIsRating(false);
        setHasRated(true);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = () => {
    switch (ride.status) {
      case "pending": return { color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20", icon: "hourglass_empty", label: "Pending" };
      case "approved":
      case "upcoming":
      case "scheduled": return { color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20", icon: "schedule", label: "Scheduled" };
      case "ongoing": return { color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20", icon: "directions_car", label: "Ongoing" };
      case "completed": return { color: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700", icon: "check_circle", label: "Completed" };
      case "cancelled":
      case "rejected": return { color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20", icon: "cancel", label: "Cancelled" };
      default: return { color: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700", icon: "info", label: ride.status };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`group relative bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col h-full border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${(isUpcoming || isPending || isOngoing)
      ? "border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      : "border-slate-100 dark:border-slate-800 opacity-80 hover:opacity-100"
      }`}>
      {/* Decorative Glow */}
      {(isUpcoming || isOngoing) && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-500"></div>
      )}
      {isPending && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-500"></div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10 w-full">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border shadow-sm ${statusConfig.color}`}>
          <span className="material-symbols-outlined text-[16px]">{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
          <div className={`text-2xl font-black font-sans tracking-tight ${isCancelled ? "text-slate-400 line-through decoration-red-400/50" : "text-slate-900 dark:text-white"}`}>
            <span className="text-sm font-bold mr-0.5 text-slate-500">₹</span>{ride.price}
          </div>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="relative mb-8 z-10 w-full">
        <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-700"></div>

        {/* Pickup */}
        <div className="flex gap-4 items-start mb-6 relative">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-slate-900 z-10 mt-0.5 ${isCancelled ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isCancelled ? 'bg-slate-400' : 'bg-emerald-500'}`}></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Point</p>
            <p className={`text-sm md:text-base font-bold leading-snug ${isCancelled ? "text-slate-500" : "text-slate-900 dark:text-white"}`}>{ride.pickup}</p>
          </div>
        </div>

        {/* Dropoff */}
        <div className="flex gap-4 items-start relative">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-slate-900 z-10 mt-0.5 ${isCancelled ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
            <span className="material-symbols-outlined text-[14px]">location_on</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dropoff Point</p>
            <p className={`text-sm md:text-base font-bold leading-snug ${isCancelled ? "text-slate-500" : "text-slate-900 dark:text-white"}`}>{ride.dropoff}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 mb-6 z-10 border border-slate-100 dark:border-slate-800/80 w-full transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3 items-center sm:border-r border-slate-200 dark:border-slate-700/80 pr-2">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-[18px]">event</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Departure</p>
              <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">{ride.date || ride.time}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 overflow-hidden">
              {ride.driverProfilePicture ? (
                <img src={getImageUrl(ride.driverProfilePicture, ride.driver)} alt={ride.driver} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Driver</p>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{ride.driver}</p>
              </div>
              {ride.driverPhoneNumber && <p className="text-[11px] font-semibold text-slate-500 tracking-wide mt-0.5 truncate">{ride.driverPhoneNumber}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-auto flex flex-col gap-3 relative z-10 w-full">
        {isRating ? (
          <div className="w-full bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
            <p className="text-xs font-black text-slate-900 dark:text-white mb-3 text-center uppercase tracking-widest">Rate Experience</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <span className={`material-symbols-outlined text-3xl transition-colors ${(hoverRating || rating) >= star ? 'text-amber-400 font-solid' : 'text-slate-200 dark:text-slate-600'}`} style={{ fontVariationSettings: (hoverRating || rating) >= star ? '"FILL" 1' : '"FILL" 0' }}>
                    star
                  </span>
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Leave a comment (optional)..."
              className="w-full text-[13px] p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white mb-4 outline-none focus:border-amber-400 dark:focus:border-amber-500 resize-none h-20 transition-colors placeholder:text-slate-400"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsRating(false)}
                className="flex-[0.8] py-3.5 font-bold text-[11px] uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className={`flex-[1.2] py-3.5 font-bold text-[11px] uppercase tracking-widest text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Submit Review'}
              </button>
            </div>
          </div>
        ) : isCancelled ? (
          <div className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 py-3.5 px-4 rounded-xl border border-red-100 dark:border-red-500/20 text-[13px] font-bold flex items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>{ride.cancellationMsg || "This trip was cancelled."}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {(isUpcoming || isPending) && (
              <>
                <button
                  onClick={() => onCancel(ride.id)}
                  className="w-full bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 py-3.5 px-2 rounded-xl font-bold text-[11px] uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 dark:hover:text-red-400 hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Cancel</span>
                </button>
              </>
            )}



            {isCompleted && !hasRated && (
              <button
                onClick={() => setIsRating(true)}
                className="w-full bg-gradient-to-tr from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest active:scale-[0.98] transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 border border-amber-500/50"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                Rate Driver
              </button>
            )}

            {isCompleted && hasRated && (
              <div className="w-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                Feedback Sent
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideCard;
