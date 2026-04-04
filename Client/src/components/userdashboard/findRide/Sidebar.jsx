export default function Sidebar({ filters, onFilterChange }) {
  const priceOptions = [
    { id: "under_1000", label: "Under ₹1,000" },
    { id: "1000_5000", label: "₹1,000 - ₹5,000" },
    { id: "5000_10000", label: "₹5,000 - ₹10,000" },
    { id: "10000_20000", label: "₹10,000 - ₹20,000" },
  ];

  const timeOptions = [
    { id: "before_6am", label: "Before 6:00 AM" },
    { id: "6am_12pm", label: "6:00 AM - 12:00 PM" },
    { id: "12pm_6pm", label: "12:00 PM - 6:00 PM" },
    { id: "after_6pm", label: "After 6:00 PM" },
  ];

  const handleReset = () => {
    if (onFilterChange) {
      onFilterChange({ priceFilter: [], timeSlot: [] });
    }
  };

  const handlePriceToggle = (id) => {
    if (!onFilterChange) return;
    const current = filters.priceFilter || [];
    const updated = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    onFilterChange({ ...filters, priceFilter: updated });
  };

  const handleTimeToggle = (id) => {
    if (!onFilterChange) return;
    const current = filters.timeSlot || [];
    const updated = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    onFilterChange({ ...filters, timeSlot: updated });
  };

  return (
    <aside className="lg:col-span-3 space-y-6">
      <div className="bg-white dark:bg-[#15241b] rounded-[2rem] p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 sticky top-28">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
          <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">
            Filters
          </h3>
          <button
            onClick={handleReset}
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg active:scale-95"
          >
            Reset
          </button>
        </div>

        {/* Price Checkboxes */}
        <div className="mb-8 space-y-4">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Price Range
          </label>
          <div className="flex flex-col gap-4">
            {priceOptions.map((opt) => (
              <label key={opt.id} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {opt.label}
                </span>
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    checked={(filters.priceFilter || []).includes(opt.id)}
                    onChange={() => handlePriceToggle(opt.id)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-200 dark:border-slate-600 rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer bg-white dark:bg-[#15241b]"
                  />
                  <span className="material-symbols-outlined absolute pointer-events-none text-white !text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity">
                    check
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-6"></div>

        {/* Departure Time Checkboxes */}
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Departure Time
          </label>
          <div className="flex flex-col gap-4">
            {timeOptions.map((opt) => (
              <label key={opt.id} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {opt.label}
                </span>
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    checked={(filters.timeSlot || []).includes(opt.id)}
                    onChange={() => handleTimeToggle(opt.id)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-200 dark:border-slate-600 rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer bg-white dark:bg-[#15241b]"
                  />
                  <span className="material-symbols-outlined absolute pointer-events-none text-white !text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity">
                    check
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
