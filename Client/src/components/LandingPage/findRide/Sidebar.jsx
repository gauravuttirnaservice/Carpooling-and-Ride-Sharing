import { useState } from "react";

export default function Sidebar() {
  const [priceRange, setPriceRange] = useState({ min: 250, max: 350 });
  const [selectedTime, setSelectedTime] = useState("6:00 - 12:00");

  const timeSlots = [
    "Before 6:00",
    "6:00 - 12:00",
    "12:00 - 18:00",
    "After 18:00",
  ];

  const handleReset = () => {
    setPriceRange({ min: 250, max: 350 });
    setSelectedTime("6:00 - 12:00");
  };

  return (
    <aside className="lg:col-span-3 space-y-6">
      <div className="bg-white dark:bg-[#1a2e22] rounded-xl p-5 border border-[#e7f3eb] dark:border-white/5 shadow-sm sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Filters
          </h3>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-primary hover:text-green-400"
          >
            Reset All
          </button>
        </div>

        {/* Price Range Slider */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Price Range
          </label>
          <div className="px-2">
            <div className="relative h-1 bg-slate-200 dark:bg-white/10 rounded-full mb-6">
              {/* Active range */}
              <div
                className="absolute left-[20%] right-[30%] h-full bg-primary rounded-full"
                style={{
                  left: `${((priceRange.min - 200) / 400) * 100}%`,
                  right: `${100 - ((priceRange.max - 200) / 400) * 100}%`,
                }}
              ></div>
              {/* Min thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"
                style={{ left: "20%" }}
              ></div>
              {/* Max thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"
                style={{ right: "30%" }}
              ></div>
              {/* Price labels */}
              <div className="absolute -bottom-6 left-[20%] -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-400">
                ₹{priceRange.min}
              </div>
              <div className="absolute -bottom-6 right-[30%] translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-400">
                ₹{priceRange.max}
              </div>
            </div>
          </div>
        </div>

        {/* Departure Time */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Departure Time
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2 px-3 border rounded-lg text-xs font-medium transition-colors text-center ${
                  selectedTime === slot
                    ? "border-primary bg-primary/10 font-bold text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
