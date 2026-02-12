import React from 'react';
import { User, MapPin, ChevronRight, Star, Clock } from 'lucide-react';

const ClientTable = ({ clients, selectedId, onSelect }) => {
    const getTagStyle = (tag) => {
        switch (tag) {
            case 'VIP': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'SICAK': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'GECİKMİŞ': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
        }
    };

    const getStageLabel = (stage) => {
        const stages = {
            'New': 'Yeni',
            'Interested': 'İlgili',
            'First Contact': 'İlk Temas',
            'Negotiation': 'Pazarlık',
            'Closed': 'Satış Kapandı',
            'Lost': 'Kaybedildi'
        };
        return stages[stage] || stage;
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-all">
            <div className="overflow-auto scrollbar-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Aşama / Link</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bütçe</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bölge</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Danışman</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {clients.map((client) => (
                            <tr
                                key={client.id}
                                onClick={() => onSelect(client)}
                                className={`group cursor-pointer transition-all duration-200 ${selectedId === client.id
                                    ? 'bg-cyan-50/50 dark:bg-cyan-900/10'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <User size={18} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{client.name}</div>
                                            <div className={`mt-1 inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${getTagStyle(client.tag)}`}>
                                                {client.tag}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                                        {getStageLabel(client.stage)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase italic">
                                        <Clock size={10} /> {client.lastActivity}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-black text-[#3BB2B8] tracking-tight">
                                        {client.currency === 'GBP' ? '£' : '₺'}{client.budget.toLocaleString('tr-TR')}
                                    </div>
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">POTANSİYEL</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">{client.region}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800 inline-block">
                                        {client.consultant}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.hash = `client-edit/${client.id}`;
                                            }}
                                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#3BB2B8] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            EDİT
                                        </button>
                                        <ChevronRight size={18} className="text-[#3BB2B8]" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] italic">Müşteri Bulunamadı</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientTable;
