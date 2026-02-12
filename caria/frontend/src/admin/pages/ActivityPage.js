import React, { useState, useMemo } from 'react';
import {
    Users, Briefcase, Home, Filter,
    MessageCircle, Phone, FileText, Activity as ActivityIcon,
    Search, Clock, ChevronRight
} from 'lucide-react';
import { useAdminStore } from '../state/adminStore';

const ActivityPage = () => {
    const { activities } = useAdminStore();
    const [filter, setFilter] = useState('All');

    const filteredActivities = useMemo(() => {
        if (filter === 'All') return activities;
        return activities.filter(a => a.type === filter.toLowerCase());
    }, [activities, filter]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'lead': return <Briefcase size={16} className="text-orange-500" />;
            case 'client': return <Users size={16} className="text-[#3BB2B8]" />;
            case 'property': return <Home size={16} className="text-blue-500" />;
            case 'note': return <MessageCircle size={16} className="text-purple-500" />;
            default: return <ActivityIcon size={16} className="text-slate-400" />;
        }
    };

    const activityTypes = ['All', 'Lead', 'Client', 'Property', 'Note'];

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950 font-sans">
            <div className="px-8 pt-8 pb-6">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-[#3BB2B8]/10 rounded-xl flex items-center justify-center text-[#3BB2B8]">
                                <ActivityIcon size={18} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                                Aktivite Merkezi
                            </h1>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1">
                            Connect OS • Global İşlem ve Aktivite Takibi
                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto scrollbar-hidden">
                    <div className="flex items-center gap-2 border-r border-slate-100 dark:border-slate-800 pr-4 mr-2">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Filtrele:</span>
                    </div>
                    {activityTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border shrink-0 ${filter === type
                                ? 'bg-[#3BB2B8] text-white border-[#3BB2B8] shadow-lg shadow-cyan-500/20'
                                : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#3BB2B8]'
                                }`}
                        >
                            {type === 'All' ? 'TÜMÜ' : type.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 px-8 pb-8 overflow-y-auto scrollbar-hidden">
                <div className="w-full space-y-4">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map((act) => (
                            <div
                                key={act.id}
                                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-5 group hover:border-[#3BB2B8] transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3BB2B8]/5 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                                    {getActivityIcon(act.type)}
                                </div>

                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{act.title}</h3>
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Clock size={10} /> {act.time}
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                        {act.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black px-2 py-1 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-lg border border-slate-100 dark:border-slate-800 uppercase tracking-widest">
                                                {act.entity}
                                            </span>
                                        </div>
                                        <button className="flex items-center gap-1 text-[10px] font-black text-[#3BB2B8] uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            Detay <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Henüz bir aktivite gerçekleşmedi</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
