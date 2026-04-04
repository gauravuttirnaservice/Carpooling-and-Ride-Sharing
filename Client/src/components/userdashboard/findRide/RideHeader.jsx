import React from "react";

const RideHeader = ({ ride }) => {
  if (!ride) return null;

  const departureDate = new Date(ride.departureTime);
  const dateFormatted = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(departureDate);
  const timeFormatted = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(departureDate);

  return (
    <div className="bg-white dark:bg-[#15241b] rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
      {/* Subtle decorative accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[100px] pointer-events-none"></div>

      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="bg-primary/10 text-primary-darker dark:text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-primary/20 transition-colors">
            {dateFormatted}
          </span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
          <span>{ride.origin}</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700 mx-1 material-symbols-outlined !text-4xl">east</span>
          <span className="sm:hidden text-primary material-symbols-outlined !text-3xl">south</span>
          <span>{ride.destination}</span>
        </h1>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-slate-400 !text-[18px]">schedule</span>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-bold">
              {timeFormatted}
            </p>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-primary/10 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-primary !text-[18px]">airline_seat_recline_normal</span>
            <p className="text-emerald-700 dark:text-primary text-sm font-bold">
              {ride.availableSeats} seats left
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHeader;
