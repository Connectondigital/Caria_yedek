import React from "react";
import PropertyShell from "../components/property/PropertyShell";

export default function PropertyPage() {
  return (
    <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Page Header */}
      <div className="px-8 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              Property OS
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              Connect Real Estate Management • v2.5.0
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Database
            </span>
          </div>
        </div>
      </div>

      {/* Shell Component (Handles KPIs, Filters, Table and Preview) */}
      <div className="flex-1 px-8 pb-8 overflow-hidden">
        <PropertyShell />
      </div>
    </div>
  );
}
