import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Building2, Layers, DollarSign, Bed, Bath, Square, Info } from 'lucide-react';
import LocationPicker from './LocationPicker';
import axios from 'axios';

const PropertyDrawer = ({ property, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        region: '',
        location: '',
        type: 'Villa',
        price: '',
        currency: 'GBP',
        beds: 0,
        baths: 0,
        area: '',
        status: 'Aktif',
        latitude: 35.3382,
        longitude: 33.3199
    });

    useEffect(() => {
        if (property) {
            setFormData({
                ...property,
                latitude: property.latitude || 35.3382,
                longitude: property.longitude || 33.3199
            });
        } else {
            setFormData({
                title: '',
                code: '',
                region: '',
                location: '',
                type: 'Villa',
                price: '',
                currency: 'GBP',
                beds: 0,
                baths: 0,
                area: '',
                status: 'Aktif',
                latitude: 35.3382,
                longitude: 33.3199
            });
        }
    }, [property, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (coords) => {
        setFormData(prev => ({ ...prev, ...coords }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/properties', formData);
            if (res.data.status === 'success') {
                onSave({ ...formData, id: res.data.id });
                onClose();
            }
        } catch (err) {
            console.error("Error saving property:", err);
            alert("İlan kaydedilemedi!");
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-screen w-full max-w-[600px] bg-white dark:bg-slate-950 shadow-2xl z-[1001] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#3BB2B8]/10 rounded-2xl flex items-center justify-center text-[#3BB2B8]">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {property ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
                                </h2>
                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Portföy Yönetimi</div>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} className="text-[#3BB2B8]" /> Temel Bilgiler
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">İlan Başlığı</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#3BB2B8] outline-none"
                                        placeholder="Modern Villa..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">İlan Kodu</label>
                                    <input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#3BB2B8] outline-none"
                                        placeholder="CE-1025"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={14} className="text-orange-500" /> Konum Bilgileri
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Bölge</label>
                                    <input
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#3BB2B8] outline-none"
                                        placeholder="Girne"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Tam Konum</label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#3BB2B8] outline-none"
                                        placeholder="Bellapais"
                                    />
                                </div>
                            </div>

                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                                    Haritada Konum Seç (Location Picker)
                                </label>
                                <LocationPicker
                                    lat={formData.latitude}
                                    lng={formData.longitude}
                                    onChange={handleLocationChange}
                                />
                            </div>
                        </div>

                        {/* Financials & Specs */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign size={14} className="text-green-500" /> Fiyat & Özellikler
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1 col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Fiyat</label>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#3BB2B8] outline-none"
                                        placeholder="450000"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Para Birimi</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#3BB2B8] outline-none"
                                    >
                                        <option value="GBP">GBP (£)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="TL">TRY (₺)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <Bed size={16} className="mx-auto mb-1 text-slate-400" />
                                    <input name="beds" type="number" value={formData.beds} onChange={handleChange} className="w-full bg-transparent text-center text-xs font-black outline-none" />
                                    <div className="text-[8px] font-black text-slate-400 uppercase">Yatak</div>
                                </div>
                                <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <Bath size={16} className="mx-auto mb-1 text-slate-400" />
                                    <input name="baths" type="number" value={formData.baths} onChange={handleChange} className="w-full bg-transparent text-center text-xs font-black outline-none" />
                                    <div className="text-[8px] font-black text-slate-400 uppercase">Banyo</div>
                                </div>
                                <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <Square size={16} className="mx-auto mb-1 text-slate-400" />
                                    <input name="area" value={formData.area} onChange={handleChange} className="w-full bg-transparent text-center text-xs font-black outline-none" placeholder="250" />
                                    <div className="text-[8px] font-black text-slate-400 uppercase">m²</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-slate-200 dark:border-slate-800"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-2 w-full bg-[#3BB2B8] hover:bg-[#329ba1] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            <Save size={20} /> İLANI KAYDET
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PropertyDrawer;
