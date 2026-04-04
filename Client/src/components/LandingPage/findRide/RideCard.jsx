import { useNavigate } from "react-router-dom";

export default function RideCard({ ride }) {
  const navigate = useNavigate();

  const handleBookSeat = () => {
    navigate(`/book-ride/${ride.id}`);
  };

  // Determine seat availability styling
  const getSeatAvailability = (seatsLeft) => {
    if (seatsLeft >= 2) {
      return {
        color: "text-green-700 dark:text-primary",
        iconColor: "text-green-600 dark:text-primary",
        text: `${seatsLeft} seats left`,
      };
    } else if (seatsLeft === 1) {
      return {
        color: "text-orange-500",
        iconColor: "text-orange-500",
        text: "1 seat left!",
      };
    } else {
      return {
        color: "text-red-500",
        iconColor: "text-red-500",
        text: "Sold out",
      };
    }
  };

  const availability = getSeatAvailability(ride.seatsLeft);

  return (
    <div className="bg-white dark:bg-[#1a2e22] rounded-xl p-5 border border-[#e7f3eb] dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Driver Info */}
        <div className="flex md:flex-col items-center gap-3 md:w-24 shrink-0">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-white dark:border-white/10 shadow-sm"
              style={{
                backgroundImage: `url("${ride.driver.avatar}")`,
              }}
              role="img"
              aria-label={`Driver portrait of ${ride.driver.name}`}
            ></div>
          </div>
          <div className="text-left md:text-center">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {ride.driver.name}
            </h4>
          </div>
        </div>

        {/* Ride Details */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
            {/* Route Timeline */}
            <div className="flex-1 relative">
              {/* Vertical line */}
              <div className="absolute top-2.5 left-[7px] w-0.5 h-[calc(100%-20px)] bg-slate-200 dark:bg-white/10"></div>

              {/* Departure */}
              <div className="flex gap-4 mb-4 relative">
                <div className="w-4 h-4 rounded-full border-[3px] border-slate-900 dark:border-primary bg-white dark:bg-[#1a2e22] shrink-0 z-10 mt-1.5"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">
                      {ride.departure.time}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      {ride.departure.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {ride.departure.location}
                  </p>
                </div>
              </div>

              {/* Arrival */}
              <div className="flex gap-4 relative">
                <div className="w-4 h-4 rounded-full border-[3px] border-slate-900 dark:border-primary bg-white dark:bg-[#1a2e22] shrink-0 z-10 mt-1.5"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">
                      {ride.arrival.time}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      {ride.arrival.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {ride.arrival.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="flex flex-col items-start sm:items-end gap-2 text-right">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                <span className="material-symbols-outlined text-lg">
                  {ride.car.icon || "directions_car"}
                </span>
                <span>
                  {ride.car.model} ({ride.car.color})
                </span>
              </div>
            </div>
          </div>

          {/* Seat Availability & Status */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span
                className={`material-symbols-outlined ${availability.iconColor}`}
              >
                person
              </span>
              <span className={`font-semibold ${availability.color}`}>
                {availability.text}
              </span>
            </div>
            {ride.status && (
              <span className="px-2.5 py-1 rounded-full bg-green-100/80 dark:bg-green-400/10 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                {ride.status}
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-2 md:w-36 md:border-l md:border-slate-100 md:dark:border-white/5 md:pl-6">
          <div className="text-center">
            <span className="block text-2xl font-black text-slate-900 dark:text-white">
              ₹{ride.price}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              per seat
            </span>
          </div>
          <button
            onClick={handleBookSeat}
            disabled={ride.seatsLeft === 0}
            className={`h-10 px-6 text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center w-full md:w-auto mt-2 ${ride.seatsLeft === 0
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-primary hover:bg-green-400 text-white hover:shadow-lg hover:shadow-primary/20"
              }`}
          >
            {ride.seatsLeft === 0 ? "Sold Out" : "Book Seat"}
          </button>
        </div>
      </div>
    </div>
  );
}
