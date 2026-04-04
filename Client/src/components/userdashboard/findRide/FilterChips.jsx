export default function FilterChips({ sortBy, onSortChange }) {
  const filters = [
    { id: "cheapest", label: "Cheapest", icon: "attach_money" },
    { id: "earliest", label: "Earliest", icon: "schedule" },
    { id: "topRated", label: "Top Rated", icon: "star" },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pt-2 pb-2 md:pb-0 scrollbar-hide shrink-0">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => {
            if (onSortChange) onSortChange(filter.id);
          }}
          className={`group flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-black tracking-wide whitespace-nowrap transition-all duration-300 ${sortBy === filter.id
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md transform -translate-y-0.5"
            : "bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm hover:border-slate-300 dark:hover:border-white/20"
            }`}
        >
          <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${sortBy === filter.id ? "scale-110" : "group-hover:scale-110 text-slate-400 dark:text-slate-500"}`}>
            {filter.icon}
          </span>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
