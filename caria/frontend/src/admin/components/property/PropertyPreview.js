import React from 'react';
import {
    X, Edit3, Copy, Power, Link, Tag,
    Bed, Bath, Square, TrendingUp, DollarSign,
    Maximize2, Image as ImageIcon
} from 'lucide-react';
import { formatPrice, getStatusLabel } from './helpers';

const PropertyPreview = ({ property, onClose }) => {
    if (!property) return (
        <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={32} className="text-slate-300" />
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Önizleme İçin Seçin</div>
            </div>
        </div>
    );

    const tags = ["Luxury", "Seaview", "Investment"];

    return (
        <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest px-2">Hızlı Bakış</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                    <X size={18} className="text-slate-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hidden">
                {/* Cover Image */}
                <div className="relative aspect-[4/3] group cursor-pointer">
                    <img src={property.coverImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="text-white" size={32} />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-[#3BB2B8] text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase shadow-lg">
                            {property.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Header Info */}
                    <div className="space-y-2">
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
                            {property.title}
                        </h1>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {property.location}, {property.region}
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="p-5 bg-[#3BB2B8]/5 dark:bg-[#3BB2B8]/10 rounded-3xl border border-[#3BB2B8]/20 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Satış Fiyatı</div>
                            <div className="text-2xl font-black text-[#3BB2B8] tracking-tighter">
                                {formatPrice(property.price, property.currency)}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kod</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase">CE-{2034 + property.id}</div>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <Bed size={16} className="mx-auto mb-1 text-slate-400" />
                            <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{property.beds} Yatak</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <Bath size={16} className="mx-auto mb-1 text-slate-400" />
                            <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{property.baths} Banyo</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <Square size={16} className="mx-auto mb-1 text-slate-400" />
                            <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{property.sqm} m²</div>
                        </div>
                    </div>

                    {/* Investment Metrics */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={14} className="text-[#3BB2B8]" /> Yatırım Analizi
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">ROI %</div>
                                <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">%{property.roiPct}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Kira Getirisi</div>
                                <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                    {formatPrice(property.rentYield, property.currency)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase rounded-lg tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Mini Gallery */}
                    {property.galleryImages && property.galleryImages.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GALERİ</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {property.galleryImages.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800">HIZLI İŞLEMLER</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => window.location.hash = `property-edit/${property.id}`}
                                className="flex items-center gap-3 p-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl hover:bg-black dark:hover:bg-slate-700 transition-all group"
                            >
                                <Edit3 size={18} />
                                <span className="text-[10px] font-black uppercase tracking-wider">DÜZENLE</span>
                            </button>
                            <button className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#3BB2B8] transition-all group">
                                <Copy size={18} />
                                <span className="text-[10px] font-black uppercase tracking-wider">KOPYALA</span>
                            </button>
                            <button className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all border ${property.status === 'published'
                                ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20'
                                : 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20'
                                }`}>
                                <Power size={18} />
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                    {property.status === 'published' ? 'KALDIR' : 'YAYINLA'}
                                </span>
                            </button>
                            <button className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#3BB2B8] transition-all group">
                                <Link size={18} />
                                <span className="text-[10px] font-black uppercase tracking-wider">LİNK</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPreview;
