const StatsCard = ({
  label,
  value,
  subtext,
  icon,
  iconBgColor,
  iconColor,
  borderHoverColor,
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-between group hover:${borderHoverColor} transition-all`}
    >
      <div>
        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
          {label}
        </p>
        <h3 className="text-5xl font-black text-slate-900 dark:text-white mt-3 tracking-tighter">
          {value}
        </h3>
        {subtext && (
          <p className="text-[11px] text-primary font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            {subtext}
          </p>
        )}
      </div>
      <div
        className={`h-20 w-20 ${iconBgColor} rounded-[1.5rem] flex items-center justify-center ${iconColor} group-hover:bg-${iconColor.split("-")[1] || "primary"} ${
          iconColor.includes("yellow")
            ? "group-hover:text-white"
            : "group-hover:text-slate-900"
        } transition-all duration-300`}
      >
        <span className="material-symbols-outlined text-[32px] font-bold">
          {icon}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
