import { useState } from "react";

const RideCard = ({ ride, onUpdate }) => {
  const isUpcoming = ride.status === "upcoming" || ride.status === "scheduled";

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: ride.status === "upcoming" ? "scheduled" : ride.status,
    totalSeats: ride.totalSeats,
    fare: ride.fare,
  });

  const handleSave = () => {
    onUpdate(ride.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      status: ride.status === "upcoming" ? "scheduled" : ride.status,
      totalSeats: ride.totalSeats,
      fare: ride.fare,
    });
    setIsEditing(false);
  };

  const handleCancelRide = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this ride? All associated passenger bookings will also be cancelled. This action cannot be undone."
    );
    if (isConfirmed) {
      onUpdate(ride.id, { ...editData, status: 'cancelled' });
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none ${isUpcoming ? "hover:border-primary" : "opacity-70 hover:opacity-100"
        } transition-all group relative flex flex-col h-full`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border outline-none cursor-pointer"
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              {/* Note: Cancel is handled via a dedicated button now */}
            </select>
          ) : (
            <span
              className={`${isUpcoming
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                } text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border`}
            >
              {ride.status}
            </span>
          )}
          {!isUpcoming && !isEditing && (
            <span className="text-slate-400 text-[10px] font-bold tracking-tight uppercase">
              {ride.date}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
            {isUpcoming ? "Fare / Seat" : "Earnings"}
          </p>
          {isEditing ? (
            <div className="flex items-center gap-1 justify-end mt-1">
              <span className="text-slate-900 dark:text-white font-black">₹</span>
              <input
                type="number"
                value={editData.fare}
                onChange={(e) => setEditData({ ...editData, fare: e.target.value })}
                className="w-16 border border-slate-200 dark:border-slate-700 rounded p-1 text-sm text-slate-900 dark:text-white bg-transparent outline-none text-right"
              />
            </div>
          ) : (
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{ride.fare}
            </p>
          )}
        </div>
      </div>

      {isUpcoming && ride.driverVerified === false && (
        <div className="mb-6 bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm">
          <p className="text-orange-800 dark:text-orange-400 text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            Pending Admin Verification
          </p>
          <p className="text-orange-700 dark:text-orange-500 text-xs mt-1 font-medium">
            Until the admin verifies your document, this ride will not be published.
          </p>
        </div>
      )}

      {/* Route */}
      <div className="relative space-y-8 mb-8 pl-8">
        <div
          className={`absolute left-3 top-2 bottom-2 w-0.5 border-l-2 ${isUpcoming
            ? "border-dashed border-slate-100 dark:border-slate-800"
            : "border-slate-50 dark:border-slate-800"
            }`}
        ></div>

        <div className="relative">
          <div
            className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${isUpcoming
              ? "bg-primary shadow-lg shadow-primary/30"
              : "bg-slate-300"
              }`}
          ></div>
          {isUpcoming && (
            <p className="text-[10px] text-primary font-extrabold uppercase tracking-widest">
              Pickup point
            </p>
          )}
          <p
            className={`${isUpcoming
              ? "text-slate-900 dark:text-white font-bold text-base"
              : "text-slate-600 dark:text-slate-400 font-bold text-sm"
              } leading-tight`}
          >
            {ride.from}
          </p>
        </div>

        <div className="relative">
          <div
            className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${isUpcoming
              ? "bg-slate-900 dark:bg-slate-700 shadow-sm"
              : "bg-slate-300"
              }`}
          ></div>
          {isUpcoming && (
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              Drop destination
            </p>
          )}
          <p
            className={`${isUpcoming
              ? "text-slate-900 dark:text-white font-bold text-base"
              : "text-slate-600 dark:text-slate-400 font-bold text-sm"
              } leading-tight`}
          >
            {ride.to}
          </p>
        </div>
      </div>

      {/* Stats */}
      {isUpcoming ? (
        <div className="flex justify-between items-center py-5 border-y border-slate-50 dark:border-slate-800/50 mb-8">
          <div className="text-center flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Available Seats
            </p>
            {isEditing ? (
              <input
                type="number"
                className="w-12 border border-slate-200 dark:border-slate-700 rounded p-1 text-sm text-center text-slate-900 dark:text-white bg-transparent outline-none mt-1 mx-auto block"
                value={editData.totalSeats}
                onChange={(e) => setEditData({ ...editData, totalSeats: e.target.value })}
              />
            ) : (
              <p className="font-bold text-slate-900 dark:text-white text-lg mt-1">
                {ride.totalSeats}
              </p>
            )}
          </div>
          <div className="text-center flex-1 border-x border-slate-50 dark:border-slate-800/50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Booked
            </p>
            <p className="font-bold text-primary text-lg mt-1">{ride.passengers}</p>
          </div>
          {/* <div className="text-center flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Empty
            </p>
            <p className="font-bold text-slate-900 dark:text-white text-lg mt-1">
              {isEditing ? editData.totalSeats - ride.bookedSeats : ride.emptySeats}
            </p>
          </div> */}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Trip Completed
            </p>
            <p className="font-bold text-yellow-500 text-sm">{ride.rating} ★</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Passengers
            </p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {ride.passengers}
            </p>
          </div>
        </div>
      )}
      {/* Passenger List */}
      {ride.passengerList && ride.passengerList.length > 0 && (
        <div className="mb-6 mx-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Passenger Details
          </p>
          <div className="space-y-3">
            {ride.passengerList.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {p.profilePicture ? (
                      <img src={`http://localhost:3000${p.profilePicture}`} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{p.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      {p.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {p.seats} {p.seats > 1 ? 'Seats' : 'Seat'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isEditing ? (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleCancel}
            className="flex-1 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all bg-primary hover:bg-green-400 text-white shadow-lg shadow-primary/20 active:scale-95"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 mt-auto flex-wrap">
          {isUpcoming && (
            <>
              <button
                onClick={handleCancelRide}
                className="w-full sm:w-auto flex-1 font-black py-4 px-4 rounded-2xl text-[10px] xl:text-xs uppercase tracking-widest transition-all active:scale-[0.98] border-2 border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                Cancel
              </button>
              <button
                onClick={() => {
                  const isConfirmed = window.confirm("Are you sure you want to mark this ride as completed? This action cannot be undone.");
                  if (isConfirmed) {
                    onUpdate(ride.id, { ...editData, status: 'completed' });
                  }
                }}
                className="w-full sm:w-auto flex-1 font-black py-4 px-4 rounded-2xl text-[10px] xl:text-xs uppercase tracking-widest transition-all active:scale-[0.98] border-2 border-emerald-100 dark:border-emerald-900/30 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Done
              </button>
            </>
          )}
          <button
            onClick={() => {
              if (isUpcoming) setIsEditing(true);
            }}
            className={`w-full ${isUpcoming ? 'flex-1' : ''} font-black py-4 px-4 rounded-2xl text-[10px] xl:text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isUpcoming
              ? "bg-slate-900 dark:bg-slate-800 hover:bg-primary hover:text-slate-900 text-white shadow-lg shadow-slate-900/10"
              : "bg-white dark:bg-transparent border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-bold hover:bg-slate-50"
              }`}
          >
            {isUpcoming ? (
              <>
                <span className="material-symbols-outlined text-lg">edit</span>
                Manage
              </>
            ) : "Trip Completed"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RideCard;
