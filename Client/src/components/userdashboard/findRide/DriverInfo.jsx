import React from "react";
import { getImageUrl } from "../../../utils/getImageUrl";

const DriverInfo = ({ ride }) => {
  if (!ride) return null;

  const driver = ride.driver || {};
  const driverName = `${driver.firstName || "Unknown"} ${driver.lastName || "Driver"}`;
  const profilePic = getImageUrl(driver.profilePicture, `${driver.firstName || "U"} ${driver.lastName || "D"}`);

  const rating = driver.rating !== undefined ? driver.rating : "4.9";
  const totalRides = driver.totalRides !== undefined ? driver.totalRides : "120";

  return (
    <div className="bg-white dark:bg-[#15241b] rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5">
      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">person</span>
        Driver Profile
      </h3>

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-slate-100 dark:border-white/5 pb-8 mb-8">
        <div className="relative shrink-0">
          <img
            alt={`Portrait of ${driverName}`}
            className="w-[100px] h-[100px] rounded-[1.5rem] object-cover border-4 border-white dark:border-[#15241b] shadow-md"
            src={profilePic}
          />
          <div
            className="absolute -bottom-3 -right-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-xl px-2 py-1 border-4 border-white dark:border-[#15241b] flex items-center gap-1 shadow-sm"
            title="ID Verified"
          >
            <span className="material-symbols-outlined !text-[14px] font-black">
              verified
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider">Trusted</span>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {driverName}
          </h4>
          <div className="flex items-center gap-1 text-yellow-500 mb-3">
            <span className="material-symbols-outlined !text-[20px] fill-current">star</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">
              {rating}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold ml-1.5">
              ({totalRides} trips)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified Identity
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl flex items-center gap-4 min-w-[220px] shrink-0 border border-slate-100 dark:border-white/5">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#15241b] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-2xl text-primary">directions_car</span>
          </div>
          <div>
            <p className="font-black text-slate-900 dark:text-white capitalize leading-tight">
              {ride.carName || "Standard Vehicle"}
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
              {ride.carNumber || "Unregistered"}
            </p>
          </div>
        </div>
      </div>

      {/* Driver Reviews Section */}
      {driver.reviews && driver.reviews.length > 0 && (
        <div className="pt-2">
          <h4 className="text-lg font-black mb-6 text-slate-900 dark:text-white flex items-center gap-2">
            Recent Reviews
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {driver.reviews.map((review) => (
              <div key={review.id} className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-transparent dark:border-white/5 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getImageUrl(
                      review.reviewer?.profilePicture,
                      `${review.reviewer?.firstName || "U"} ${review.reviewer?.lastName || ""}`
                    )}
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {review.reviewer?.firstName || 'Anonymous'} {review.reviewer?.lastName || ''}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500 mt-0.5">
                      <span className="material-symbols-outlined !text-[14px] fill-current">star</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{review.rating}</span>
                      <span className="mx-2 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverInfo;
