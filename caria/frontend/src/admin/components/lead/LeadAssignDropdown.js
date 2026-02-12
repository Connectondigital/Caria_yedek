import React from 'react';
import { UserCheck, ChevronDown } from 'lucide-react';

const LeadAssignDropdown = ({ currentAssignee, advisors, onAssign }) => {
    return (
        <div className="relative group/assign">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group-hover/assign:border-[#3BB2B8] transition-all">
                <UserCheck size={14} className={currentAssignee ? "text-[#3BB2B8]" : "text-slate-400"} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    {currentAssignee || 'ATA'}
                </span>
                <ChevronDown size={12} className="text-slate-400" />
            </button>

            <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/assign:opacity-100 group-hover/assign:translate-y-0 group-hover/assign:pointer-events-auto transition-all z-[100]">
                <div className="p-2 space-y-1">
                    <button
                        onClick={() => onAssign(null)}
                        className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        SAHİPSİZ HAVUZ
                    </button>
                    <div className="h-px bg-slate-50 dark:bg-slate-800 my-1" />
                    {advisors.map(name => (
                        <button
                            key={name}
                            onClick={() => onAssign(name)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${currentAssignee === name
                                    ? 'bg-[#3BB2B8]/10 text-[#3BB2B8]'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeadAssignDropdown;
