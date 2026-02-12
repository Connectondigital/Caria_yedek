import React from 'react';
import { FileText, Plus, MoreVertical, Globe, Lock } from 'lucide-react';

const PageList = ({ pages, selectedPageId, onSelectPage, onAddPage }) => {
    return (
        <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-white dark:bg-slate-950">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">SAYFALAR</h2>
                <button
                    onClick={onAddPage}
                    className="p-1.5 bg-[#3BB2B8]/10 text-[#3BB2B8] rounded-lg hover:bg-[#3BB2B8] hover:text-white transition-all shadow-sm"
                >
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {pages.map(page => (
                    <button
                        key={page.id}
                        onClick={() => onSelectPage(page)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border text-left group ${selectedPageId === page.id
                            ? 'bg-[#3BB2B8] border-[#3BB2B8] text-white shadow-lg shadow-cyan-500/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400'}`}
                    >
                        <div className={`p-2 rounded-xl ${selectedPageId === page.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <FileText size={18} className={selectedPageId === page.id ? 'text-white' : 'text-slate-500'} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="text-sm font-bold truncate tracking-tight">{page.title}</div>
                                {page.status === 'published' ? <Globe size={10} /> : <Lock size={10} />}
                            </div>
                            <div className={`text-[10px] font-medium tracking-wide truncate ${selectedPageId === page.id ? 'text-white/70' : 'text-slate-400'}`}>
                                /{page.slug}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                    SON GÜNCELLEME: <br /> 2 saat önce
                </div>
            </div>
        </div>
    );
};

export default PageList;
