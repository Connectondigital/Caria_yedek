import React from 'react';
import { Star, MoreVertical, MapPin, User, Building2 } from 'lucide-react';
import { formatPrice, getStatusColor, getStatusLabel } from './helpers';

const PropertyTable = ({ properties, selectedId, onSelect, onToggleFeatured }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="overflow-auto scrollbar-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">İlan Details</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Bölge</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Fiyat</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Durum</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Danışman</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {properties.map((property) => (
                            <tr
                                key={property.id}
                                onClick={() => onSelect(property)}
                                className={`group cursor-pointer transition-all duration-200 ${selectedId === property.id
                                    ? 'bg-cyan-50/50 dark:bg-cyan-900/10'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <td className="p-4 min-w-[280px]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                            <img src={property.coverImage} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-sm font-black text-slate-900 dark:text-white truncate">{property.title}</div>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <MapPin size={12} className="text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{property.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{property.region}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-black text-[#3BB2B8] tracking-tight">{formatPrice(property.price, property.currency)}</div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">PEŞİN</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${getStatusColor(property.status)}`}>
                                        {getStatusLabel(property.status)}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <User size={12} className="text-slate-500" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{property.agentName}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFeatured(property.id);
                                            }}
                                            className={`p-2 rounded-xl transition-all ${property.featured
                                                ? 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-900/20'
                                                : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                                } border border-transparent`}
                                        >
                                            <Star size={16} fill={property.featured ? "currentColor" : "none"} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.hash = `property-edit/${property.id}`;
                                            }}
                                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#3BB2B8] hover:text-white rounded-lg text-[10px] font-black tracking-widest transition-all uppercase"
                                        >
                                            EDİT
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {properties.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">Eşleşen İlan Bulunamadı</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyTable;
