import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';

const ClientActionsBar = ({ onSearch, onFilterTag, activeTag, onNewClient }) => {
    const tags = [
        { label: 'VIP', value: 'VIP', color: 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-900/20' },
        { label: 'SICAK', value: 'SICAK', color: 'bg-orange-50 text-orange-500 border-orange-100 dark:bg-orange-900/20' },
        { label: 'GECİKMİŞ', value: 'GECİKMİŞ', color: 'bg-red-50 text-red-500 border-red-100 dark:bg-red-900/20' },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6 transition-all">
            <div className="flex flex-wrap items-center gap-4 flex-1">
                {/* Search */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 min-w-[320px] focus-within:border-[#3BB2B8] transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="İsim, lokasyon veya danışman ara..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onFilterTag('All')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${activeTag === 'All'
                            ? 'bg-[#3BB2B8] text-white border-[#3BB2B8]'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        TÜMÜ
                    </button>
                    {tags.map((tag) => (
                        <button
                            key={tag.value}
                            onClick={() => onFilterTag(tag.value)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${activeTag === tag.value
                                ? `${tag.color} ring-2 ring-offset-2 ring-current ring-opacity-20`
                                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#3BB2B8]'
                                }`}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* New Button */}
            <button
                onClick={() => window.location.hash = 'client-create'}
                className="flex items-center gap-2 bg-[#3BB2B8] hover:bg-[#329ba1] text-white px-8 py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl shadow-cyan-500/20 active:scale-95 uppercase tracking-widest"
            >
                <Plus size={18} strokeWidth={3} /> YENİ MÜŞTERİ
            </button>
        </div>
    );
};

export default ClientActionsBar;
