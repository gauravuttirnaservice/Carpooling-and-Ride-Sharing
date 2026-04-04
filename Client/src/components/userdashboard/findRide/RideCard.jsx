import { useNavigate } from "react-router-dom";

export default function RideCard({ ride }) {
  const navigate = useNavigate();

  const handleBookSeat = () => {
    navigate(`/book-ride/${ride.id}`);
  };

  const getSeatAvailability = (seatsLeft) => {
    if (seatsLeft >= 2) {
      return {
        pillBg: "bg-emerald-50 dark:bg-emerald-500/10",
        color: "text-emerald-700 dark:text-emerald-400",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        text: `${seatsLeft} seats left`,
      };
    } else if (seatsLeft === 1) {
      return {
        pillBg: "bg-orange-50 dark:bg-orange-500/10",
        color: "text-orange-600 dark:text-orange-400",
        iconColor: "text-orange-500 dark:text-orange-400",
        text: "1 seat left!",
      };
    } else {
      return {
        pillBg: "bg-red-50 dark:bg-red-500/10",
        color: "text-red-600 dark:text-red-400",
        iconColor: "text-red-500 dark:text-red-400",
        text: "Sold out",
      };
    }
  };

  const availability = getSeatAvailability(ride.seatsLeft);

  return (
    <div
      onClick={handleBookSeat}
      className="group relative bg-white dark:bg-[#15241b] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-white/5 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 overflow-hidden"
    >
      {/* Decorative background gradient on hover */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 relative z-10">

        {/* Driver Info Column */}
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-28 shrink-0 relative">
          <div className="relative">
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-cover bg-center ring-4 ring-white dark:ring-[#15241b] shadow-md transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url("${ride.driver.avatar}")`,
              }}
              role="img"
            ></div>
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#15241b] rounded-full p-0.5">
              <div className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <span className="material-symbols-outlined !text-[12px]">star</span>
                {ride.driver.rating !== undefined ? ride.driver.rating : "4.8"}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {ride.driver.name.split(' ')[0]} {/* Display first name boldly */}
            </h4>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Driver
            </span>
          </div>
        </div>

        {/* Route Details Column */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative flex flex-col gap-6">
            {/* Timeline track */}
            <div className="absolute top-3 left-[9px] w-[3px] h-[calc(100%-24px)] bg-gradient-to-b from-slate-200 via-slate-200 to-slate-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700 rounded-full"></div>

            {/* Animated dot moving along track on hover */}
            <div className="absolute left-[9px] w-[3px] h-0 bg-primary rounded-full transition-all duration-700 ease-out group-hover:h-[calc(100%-24px)] top-3 z-0 opacity-0 group-hover:opacity-100"></div>

            {/* Departure */}
            <div className="flex gap-5 relative z-10">
              <div className="w-[22px] h-[22px] rounded-full border-4 border-white dark:border-[#15241b] bg-slate-800 dark:bg-white shrink-0 mt-1 flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-800 hidden"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                    {ride.departure.time.replace(/(AM|PM)/i, '').trim()}<span className="text-sm font-bold text-slate-500 ml-0.5">{ride.departure.time.match(/(AM|PM)/i)?.[0]}</span>
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-base">
                    {ride.departure.city}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium bg-slate-50 dark:bg-white/5 inline-block px-2.5 py-1 rounded-md self-start truncate max-w-[200px] sm:max-w-xs">
                  {ride.departure.location}
                </p>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex gap-5 relative z-10">
              <div className="w-[22px] h-[22px] rounded-full border-4 border-white dark:border-[#15241b] bg-primary shrink-0 mt-1 shadow-sm"></div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                    {ride.arrival.time.replace(/(AM|PM)/i, '').trim()}<span className="text-sm font-bold text-slate-500 ml-0.5">{ride.arrival.time.match(/(AM|PM)/i)?.[0]}</span>
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-base">
                    {ride.arrival.city}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium bg-slate-50 dark:bg-white/5 inline-block px-2.5 py-1 rounded-md self-start truncate max-w-[200px] sm:max-w-xs">
                  {ride.arrival.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Price Column */}
        <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 md:w-40 shrink-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5">

          <div className="flex flex-col items-start md:items-end">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total</span>
            <div className="flex items-start">
              <span className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {ride.price}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${availability.pillBg} ${availability.color}`}>
              <span className={`material-symbols-outlined text-[16px] ${availability.iconColor}`}>person</span>
              <span className="text-sm font-bold">{availability.text}</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleBookSeat(); }}
              disabled={ride.seatsLeft === 0}
              className={`hidden md:flex h-11 px-6 text-sm font-bold rounded-xl transition-all items-center justify-center w-full mt-2 ${ride.seatsLeft === 0
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-primary dark:bg-white dark:text-slate-900 dark:hover:bg-primary dark:hover:text-white shadow-lg shadow-black/5 hover:shadow-primary/25 hover:-translate-y-0.5"
                }`}
            >
              {ride.seatsLeft === 0 ? "Unavailable" : "Select Ride"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile only Button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleBookSeat(); }}
        disabled={ride.seatsLeft === 0}
        className={`md:hidden w-full h-12 mt-5 text-sm font-bold rounded-xl transition-all flex items-center justify-center ${ride.seatsLeft === 0
          ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
          : "bg-slate-900 text-white hover:bg-primary dark:bg-white dark:text-slate-900 shadow-md"
          }`}
      >
        {ride.seatsLeft === 0 ? "Unavailable" : "Select Ride"}
      </button>
    </div>
  );
}
