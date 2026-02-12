import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';

const PropertyFilters = ({ filters, setFilters, onAddNew }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 min-w-[300px] focus-within:border-[#3BB2B8] transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Arama (Başlık, bölge, danışman)..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <select
                    value={filters.region}
                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wider outline-none focus:border-[#3BB2B8] min-w-[150px]"
                >
                    <option value="All">Tüm Bölgeler</option>
                    <option value="Girne">Girne</option>
                    <option value="İskele">İskele</option>
                    <option value="Gazimağusa">Gazimağusa</option>
                    <option value="Lefkoşa">Lefkoşa</option>
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wider outline-none focus:border-[#3BB2B8] min-w-[150px]"
                >
                    <option value="All">Tüm Durumlar</option>
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                    <option value="archived">Arşiv</option>
                </select>

                <button
                    onClick={() => setFilters({ ...filters, featuredOnly: !filters.featuredOnly })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${filters.featuredOnly
                            ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-[#3BB2B8] dark:bg-slate-900 dark:border-slate-800'
                        }`}
                >
                    <StarIcon filled={filters.featuredOnly} /> Öne Çıkan
                </button>
            </div>

            <button
                onClick={onAddNew}
                className="flex items-center gap-2 bg-[#3BB2B8] hover:bg-[#329ba1] text-white px-8 py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl shadow-cyan-500/20 active:scale-95 uppercase tracking-widest"
            >
                <Plus size={18} strokeWidth={3} /> YENİ İLAN
            </button>
        </div>
    );
};

const StarIcon = ({ filled }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default PropertyFilters;
