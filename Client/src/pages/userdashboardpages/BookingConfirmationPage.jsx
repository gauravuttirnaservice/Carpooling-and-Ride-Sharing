import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../../contexts/BookingContext";

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingContext();
  const { ride, passengers, total, booking } = bookingData || {};

  useEffect(() => {
    if (!ride || !booking) {
      navigate('/find-ride');
    }
  }, [ride, booking, navigate]);

  if (!ride || !booking) return null;

  // Use the departure time from the ride object, falling back to current time
  const rawDateStr = ride.departureTime || ride.departure?.time;
  let dateStr = "";
  if (rawDateStr) {
    const rawDate = new Date(rawDateStr);
    dateStr = !isNaN(rawDate.getTime())
      ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(rawDate)
      : rawDateStr; // If it's already a formatted string from FindRidePage
  } else {
    dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const originLocation = ride.origin || ride.departure?.location || "Unknown";
  const dropLocation = ride.destination || ride.arrival?.location || "Unknown";

  const driverName = ride.driver
    ? (ride.driver.firstName ? `${ride.driver.firstName} ${ride.driver.lastName || ""}` : ride.driver.name)
    : "Your Driver";

  return (
    /* h-screen + overflow-hidden removes all scrolling */
    /* items-center + justify-center keeps everything perfectly centered */
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 h-screen w-full overflow-hidden flex items-center justify-center font-sans">
      <main className="w-full max-w-sm p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {/* Header Section */}
          <div className="bg-primary p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3 backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-3xl font-bold">
                check
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Booking Confirmed!
            </h1>
            <p className="text-sm text-slate-800 font-medium opacity-80">
              Your ride is all set.
            </p>
          </div>

          {/* Body Section */}
          <div className="p-6 space-y-5">
            {/* Route Timeline */}
            <div className="relative flex space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20"></div>
                <div className="w-0.5 h-10 border-l-2 border-dashed border-slate-200 dark:border-slate-700 my-1"></div>
                <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full ring-4 ring-slate-100 dark:ring-slate-800"></div>
              </div>
              <div className="flex-1 -mt-1">
                <div className="mb-4">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Pickup Location
                  </label>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">
                    {originLocation}
                  </p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Drop Location
                  </label>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">
                    {dropLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Time
                </label>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-base text-primary">
                    schedule
                  </span>
                  <span className="font-bold text-[11px]">
                    {dateStr}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Driver Name
                </label>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-base text-primary">
                    person
                  </span>
                  <span className="font-bold text-[11px]">{driverName}</span>
                </div>
              </div>

              <div className="col-span-2 bg-primary/5 border border-primary/20 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-bold text-emerald-700 dark:text-primary uppercase tracking-widest">
                    Total Price
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {passengers} seat{passengers > 1 ? 's' : ''} + Service Fee
                  </p>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{total}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-1">
              <button
                onClick={() => navigate("/my-ride")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-emerald-400 text-slate-900 text-sm font-bold rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 active:scale-[0.95]"
              >
                View Rides
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmationPage;
