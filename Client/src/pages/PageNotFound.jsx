import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFB] min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[520px] bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 md:p-12 text-center">
          {/* Large Stylized 404 */}
          <div className="relative mb-8">
            <h1 className="text-[10rem] font-bold text-slate-50 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-primary opacity-20 animate-pulse">
                explore_off
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
              Page not found
            </h2>
            <p className="text-slate-500 max-w-[320px] mx-auto leading-relaxed">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Buttons - Matching your Login Button Style */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-[#1A1A1A] transition-all active:scale-[0.98]"
            >
              Go Back
            </button>

            <Link
              to="/"
              className="flex-[1.5] py-4 px-6 bg-primary hover:bg-primary-hover rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
            >
              <span>Back to Dashboard</span>
              <span className="material-symbols-outlined text-[18px]">
                home
              </span>
            </Link>
          </div>

          {/* Decorative Footer */}
          <div className="mt-12 pt-8 border-t border-slate-50">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Error Code: 0x404_Lost
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
