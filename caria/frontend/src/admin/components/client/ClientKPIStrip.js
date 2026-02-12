import React, { useMemo } from 'react';
import { Users, Star, Flame, Clock, FileText } from 'lucide-react';

const ClientKPIStrip = ({ clients }) => {
    const stats = useMemo(() => {
        return {
            total: clients.length,
            vip: clients.filter(c => c.tag === 'VIP').length,
            hot: clients.filter(c => c.tag === 'SICAK').length,
            delayed: clients.filter(c => c.tag === 'GECİKMİŞ').length,
            offers: clients.filter(c => c.stage === 'Negotiation' || c.stage === 'Closed').length // Mock logic
        };
    }, [clients]);

    const cards = [
        { label: 'TOPLAM MÜŞTERİ', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'VIP MÜŞTERİ', value: stats.vip, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'SICAK FIRSAT', value: stats.hot, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'GECİKMİŞ', value: stats.delayed, icon: Clock, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
        { label: 'BU AY TEKLİF', value: stats.offers, icon: FileText, color: 'text-[#3BB2B8]', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:border-[#3BB2B8] transition-all">
                    <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center shrink-0`}>
                        <card.icon size={24} className={card.color} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">{card.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClientKPIStrip;
