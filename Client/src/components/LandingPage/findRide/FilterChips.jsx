import { useState } from "react";

export default function FilterChips() {
  const [activeFilter, setActiveFilter] = useState("cheapest");

  const filters = [
    { id: "cheapest", label: "Cheapest", icon: "attach_money" },
    { id: "earliest", label: "Earliest", icon: "schedule" },
    { id: "topRated", label: "Top Rated", icon: "star" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto py-1 px-1 -mx-1 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === filter.id
            ? "bg-primary/20 text-slate-900 dark:text-white ring-1 ring-primary/50 hover:bg-primary hover:text-slate-900"
            : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {filter.icon}
          </span>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
