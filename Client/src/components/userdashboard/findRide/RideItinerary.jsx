import React from "react";
import MapView from "../../Mapview/MapView.jsx";

const RideItinerary = ({ ride }) => {
  if (!ride) return null;

  const depTime = new Date(ride.departureTime);
  const arrTime = new Date(ride.arrivalTime);

  const depFormatted = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(depTime);
  const arrFormatted = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(arrTime);

  const durationMs = arrTime - depTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationString = `${hours}h ${minutes}m`;

  return (
    <div className="bg-white dark:bg-[#15241b] rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">route</span>
          Itinerary & Route
        </h3>

        <div className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 !text-[16px]">schedule</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {durationString} journey
          </span>
        </div>
      </div>

      <div className="relative pl-4 mb-10">
        {/* Continuous Track Line */}
        <div className="absolute top-2 left-[23px] w-1.5 h-[calc(100%-16px)] bg-slate-100 dark:bg-white/5 rounded-full z-0"></div>
        <div className="absolute top-2 left-[23px] w-1.5 h-1/2 bg-gradient-to-b from-slate-800 to-primary dark:from-white dark:to-primary rounded-full z-0"></div>

        {/* Origin */}
        <div className="flex gap-6 relative z-10 mb-8 mt-1">
          <div className="w-4 h-4 rounded-full border-4 border-white dark:border-[#15241b] bg-slate-800 dark:bg-white shrink-0 mt-1 shadow-sm ring-4 ring-slate-50 dark:ring-white/5"></div>
          <div className="flex flex-col -mt-1">
            <p className="text-slate-900 dark:text-white text-lg font-black flex items-center gap-3">
              {depFormatted}
              <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
              {ride.origin}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              Main City Center / Departure Point
            </p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex gap-6 relative z-10 mt-1">
          <div className="w-4 h-4 rounded-full border-4 border-white dark:border-[#15241b] bg-primary shrink-0 mt-1 shadow-sm ring-4 ring-primary/10"></div>
          <div className="flex flex-col -mt-1">
            <p className="text-slate-900 dark:text-white text-lg font-black flex items-center gap-3">
              {arrFormatted}
              <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
              {ride.destination}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              Main City Center / Arrival Point
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl overflow-hidden min-h-[400px] w-full relative z-0 border-[6px] border-slate-50 dark:border-white/5 shadow-inner bg-slate-100 dark:bg-slate-800 isolate">
        <MapView
          originLat={ride.originLat}
          originLng={ride.originLng}
          destLat={ride.destLat}
          destLng={ride.destLng}
          originName={ride.origin}
          destName={ride.destination}
        />
        {/* Map overlay gradient to blend edges subtly */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none z-10"></div>
      </div>
    </div>
  );
};

export default RideItinerary;
