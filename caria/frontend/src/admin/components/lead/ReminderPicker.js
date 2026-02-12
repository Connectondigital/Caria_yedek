import React from 'react';
import { Bell, Calendar } from 'lucide-react';

const ReminderPicker = ({ currentReminder, onSet }) => {
    const options = [
        { label: '15 DK SONRA', value: 15 },
        { label: '1 SAAT SONRA', value: 60 },
        { label: '3 SAAT SONRA', value: 180 },
        { label: 'YARIN BUGÜN', value: 1440 },
    ];

    const setReminder = (minutes) => {
        const date = new Date(Date.now() + minutes * 60000);
        onSet(date.toISOString());
    };

    return (
        <div className="relative group/rem">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group-hover/rem:border-blue-500 transition-all">
                <Bell size={14} className={currentReminder ? "text-blue-500" : "text-slate-400"} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    {currentReminder ? 'KURULDU' : 'HATIRLAT'}
                </span>
            </button>

            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/rem:opacity-100 group-hover/rem:translate-y-0 group-hover/rem:pointer-events-auto transition-all z-[100]">
                <div className="p-2 space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">TAKİP ZAMANI</p>
                    {options.map(opt => (
                        <button
                            key={opt.label}
                            onClick={() => setReminder(opt.value)}
                            className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-between"
                        >
                            {opt.label}
                            <Calendar size={10} className="text-slate-400" />
                        </button>
                    ))}
                    {currentReminder && (
                        <>
                            <div className="h-px bg-slate-50 dark:bg-slate-800 my-1" />
                            <button
                                onClick={() => onSet(null)}
                                className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                HATIRLATICIYI KALDIR
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReminderPicker;
