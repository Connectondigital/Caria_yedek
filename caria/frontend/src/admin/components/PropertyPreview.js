import React from 'react';
import {
    X, Maximize2, Edit3, Power, Link, ImageIcon,
    Bed, Bath, Square, TrendingUp, DollarSign,
    MapPin, Calendar, Clock, ChevronRight, Share2, Map as MapIcon
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { mapStyles } from '../../config/mapStyles';

const PropertyPreview = ({ property, onClose }) => {
    if (!property) return (
        <div className="h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Eye size={32} className="text-slate-300" />
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Önizleme İçin Bir İlan Seçin</div>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Panel */}
            <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#3BB2B8] bg-cyan-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded-lg border border-cyan-100 dark:border-cyan-800/50 font-mono tracking-tighter">
                        {property.code}
                    </span>
                    <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[200px]">
                        {property.title}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm border border-slate-100 dark:border-slate-800">
                        <Share2 size={16} className="text-slate-500" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors md:hidden">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 scrollbar-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Media & Core Info */}
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-2xl overflow-hidden group">
                            <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-white/30 transition-all">
                                    <Maximize2 size={14} /> Tam Ekran
                                </button>
                            </div>
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-[#3BB2B8] text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase shadow-lg">
                                    {property.type}
                                </span>
                                <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase shadow-lg">
                                    {property.region}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <Bed size={16} className="mx-auto mb-1 text-slate-400" />
                                <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{property.beds} Yatak</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <Bath size={16} className="mx-auto mb-1 text-slate-400" />
                                <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{property.baths} Banyo</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <Square size={16} className="mx-auto mb-1 text-slate-400" />
                                <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{property.area} m²</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#3BB2B8]/5 dark:bg-[#3BB2B8]/10 rounded-2xl border border-[#3BB2B8]/20">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Satış Fiyatı</div>
                                <div className="text-2xl font-black text-[#3BB2B8] tracking-tighter">
                                    {property.currency === 'GBP' ? '£' : '₺'}{property.price.toLocaleString('tr-TR')}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Durum</div>
                                <div className={`text-xs font-black uppercase ${property.status === 'Aktif' ? 'text-green-600' : 'text-slate-400'}`}>
                                    {property.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Metrics & Actions */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <TrendingUp size={14} className="text-[#3BB2B8]" /> Yatırım Metrikleri (Tahmini)
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Yıllık ROI</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">%{property.roi || '5.2'}</div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-[#3BB2B8] h-full" style={{ width: `${(property.roi || 5.2) * 10}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Kira Getirisi (Yıllık)</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {property.currency === 'GBP' ? '£' : '₺'}{property.rentalYield?.toLocaleString('tr-TR') || '12.400'}
                                    </div>
                                    <div className="text-[8px] text-slate-400 mt-2 italic">* Bölgesel piyasa verilerine göredir.</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Hızlı İşlemler</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center gap-3 p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all group">
                                    <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">Düzenle</span>
                                </button>
                                <button className={`flex items-center gap-3 p-4 rounded-2xl transition-all group border ${property.status === 'Aktif' ? 'bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100' : 'bg-green-50 border-green-100 text-green-600 hover:bg-green-100'}`}>
                                    <Power size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">
                                        {property.status === 'Aktif' ? 'DURDUR' : 'YAYINLA'}
                                    </span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#3BB2B8] text-slate-600 dark:text-slate-400 transition-all group">
                                    <Link size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">Linki Kopyala</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#3BB2B8] text-slate-600 dark:text-slate-400 transition-all group">
                                    <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">Galeri</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <MapIcon size={14} className="text-[#3BB2B8]" /> Konum (Harita)
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-32">
                                <AdminPropertyMap property={property} />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-2">
                                <div className="flex items-center gap-1.5"><Calendar size={12} /> Eklenme: 12.01.2024</div>
                                <div className="flex items-center gap-1.5"><Clock size={12} /> Son Güncelleme: {property.updatedAt}</div>
                            </div>
                            <div className="text-[9px] text-slate-400 italic">Bu ilan şu an Caria Estates, Properstar ve Rightmove üzerinde yayındadır.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Status Indicator */}
            <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-center">
                <button className="w-full max-w-[400px] bg-[#3BB2B8] hover:bg-[#329ba1] text-white font-black py-3 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 active:scale-95 uppercase tracking-widest text-xs">
                    DETAYLI ANALİZ RAPORU OLUŞTUR
                </button>
            </div>
        </div>
    );
};

const Eye = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const AdminPropertyMap = ({ property }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
    });

    const center = {
        lat: parseFloat(property.latitude) || 35.3382,
        lng: parseFloat(property.longitude) || 33.3199
    };

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={12}
            options={{
                styles: mapStyles,
                disableDefaultUI: true,
            }}
        >
            <Marker position={center} />
        </GoogleMap>
    ) : null;
};

export default PropertyPreview;
