import React from 'react';
import { Building2, Layers, Star, TrendingUp } from 'lucide-react';
import { formatPrice, convertToTL } from './helpers';

const PropertyKpis = ({ properties }) => {
    const total = properties.length;
    const published = properties.filter(p => p.status === 'published').length;
    const featuredByStatus = properties.filter(p => p.featured).length;

    const avgPriceTL = properties.length > 0
        ? properties.reduce((acc, curr) => acc + convertToTL(curr.price, curr.currency), 0) / properties.length
        : 0;

    const kpiData = [
        { label: 'Toplam İlan', value: total, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Yayındaki İlan', value: published, icon: Layers, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Öne Çıkan', value: featuredByStatus, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Ortalama Fiyat (TL)', value: formatPrice(Math.round(avgPriceTL), 'TL'), icon: TrendingUp, color: 'text-[#3BB2B8]', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiData.map((kpi, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                        <kpi.icon size={28} className={kpi.color} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{kpi.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PropertyKpis;
