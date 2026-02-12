import React, { useState, useCallback } from 'react';
import LocationPicker from './LocationPicker';
import {
    Save, Globe, MapPin, Home, Info, Image as ImageIcon,
    Trash2, Plus, GripVertical, CheckCircle2, AlertCircle,
    ArrowLeft, History, FileText, Camera, Construction, Plane, Map,
    ShieldCheck
} from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';

const PropertyForm = ({ initialData, mode = 'create', onSave }) => {
    const { addActivity, addNotification } = useAdminStore();
    const [formData, setFormData] = useState(initialData || {
        titleTr: '',
        titleEn: '',
        saleType: 'Sale', // Sale, Rent
        propertyType: 'Villa', // Villa, Apartment, Land, Commercial
        price: '',
        currency: 'GBP',
        sqm: '',
        beds: '',
        baths: '',
        floor: '',
        buildingAge: '',
        deedStatus: 'Turkish Title', // Turkish Title, Exchange, Leasehold
        country: 'North Cyprus',
        city: 'Girne',
        region: '',
        neighborhood: '',
        address: '',
        coordinates: '',
        completionStatus: 'Ready', // Ready, Under Construction, Project
        completionDate: '',
        distanceToCityCenterKm: '',
        distanceToAirportKm: '',
        internalProjectCode: '',
        featuresInternal: [],
        featuresExternal: [],
        featuresView: [],
        descriptionTr: '',
        descriptionEn: '',
        seoTitle: '',
        seoDesc: '',
        gallery: [],
        latitude: '',
        longitude: '',
        status: 'draft' // draft, published
    });

    const [activeTab, setActiveTab] = useState('general');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleFeature = (category, feature) => {
        setFormData(prev => {
            const list = [...prev[category]];
            if (list.includes(feature)) {
                return { ...prev, [category]: list.filter(f => f !== feature) };
            }
            return { ...prev, [category]: [...list, feature] };
        });
    };

    const handleSave = (status) => {
        const finalData = { ...formData, status };
        onSave(finalData);

        addActivity({
            type: 'property',
            title: mode === 'create' ? 'Yeni İlan Oluşturuldu' : 'İlan Güncellendi',
            description: `${formData.titleTr || 'İsimsiz İlan'} sistemi kaydedildi (${status}).`,
            entity: 'Portföy'
        });

        addNotification({
            title: status === 'published' ? 'İlan Yayına Alındı' : 'İlan Kaydedildi',
            message: `${formData.titleTr} başarıyla ${status === 'published' ? 'yayına alındı' : 'taslak olarak kaydedildi'}.`,
            type: 'success'
        });
    };

    const SectionHeader = ({ icon: Icon, title, desc }) => (
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[#3BB2B8] shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-full flex flex-col pb-32">
            {/* Form Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-10">

                {/* 1. Genel Bilgiler */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <SectionHeader icon={Info} title="Genel Bilgiler" desc="İlanın temel nitelikleri ve fiyatlandırması" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">İlan Başlığı (TR)</label>
                                <input name="titleTr" value={formData.titleTr} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8] focus:ring-4 focus:ring-[#3BB2B8]/5 transition-all" placeholder="Örn: Girne'de Modern Lüks Villa" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Title (EN)</label>
                                <input name="titleEn" value={formData.titleEn} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8] focus:ring-4 focus:ring-[#3BB2B8]/5 transition-all" placeholder="Ex: Modern Luxury Villa in Kyrenia" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Satış Tipi</label>
                                    <select name="saleType" value={formData.saleType} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none appearance-none cursor-pointer">
                                        <option value="Sale">Satılık (Sale)</option>
                                        <option value="Rent">Kiralık (Rent)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">İlan Tipi</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none appearance-none cursor-pointer">
                                        <option value="Villa">Villa</option>
                                        <option value="Apartment">Daire (Apartment)</option>
                                        <option value="Land">Arsa (Land)</option>
                                        <option value="Commercial">Ticari (Commercial)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fiyat</label>
                                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Birim</label>
                                    <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                        <option value="GBP">£ (GBP)</option>
                                        <option value="EUR">€ (EUR)</option>
                                        <option value="USD">$ (USD)</option>
                                        <option value="TL">₺ (TL)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Proje Kodu (İç Kullanım)</label>
                                    <div className="relative group">
                                        <input name="internalProjectCode" value={formData.internalProjectCode} onChange={handleInputChange} className="w-full bg-cyan-50/30 dark:bg-cyan-900/10 border border-[#3BB2B8]/20 rounded-2xl px-5 py-4 text-xs font-black text-[#3BB2B8] outline-none placeholder-[#3BB2B8]/40" placeholder="Örn: CARIA-V01" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <ShieldCheck size={14} className="text-[#3BB2B8] opacity-50" />
                                        </div>
                                    </div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1 mt-1">SADECE ADMİNDE GÖRÜNÜR</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tapu Durumu</label>
                                    <select name="deedStatus" value={formData.deedStatus} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                        <option value="Turkish Title">Türk Koçanı (Turkish)</option>
                                        <option value="Exchange">Eşdeğer (Exchange)</option>
                                        <option value="Leasehold">Tahsis (Leasehold)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
                        {['sqm', 'beds', 'baths', 'floor', 'buildingAge'].map((field) => (
                            <div key={field} className="space-y-2 text-center">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{field === 'sqm' ? 'm²' : field === 'buildingAge' ? 'Yaş' : field.replace('s', '')}</label>
                                <input name={field} type="number" value={formData[field]} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl py-3 text-center text-xs font-black outline-none focus:border-[#3BB2B8]" placeholder="-" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Lokasyon & Uzaklıklar */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <SectionHeader icon={MapPin} title="Lokasyon & Uzaklıklar" desc="Harita bilgileri ve stratejik mesafeler" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Şehir</label>
                                <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                    <option value="Girne">Girne / Kyrenia</option>
                                    <option value="İskele">İskele / Iskele</option>
                                    <option value="Gazimağusa">Mağusa / Famagusta</option>
                                    <option value="Lefkoşa">Lefkoşa / Nicosia</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bölge</label>
                                <input name="region" value={formData.region} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="Örn: Bellapais" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Açık Adres</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8] h-24 resize-none" placeholder="Cadde, sokak, no..." />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#3BB2B8] uppercase tracking-widest flex items-center gap-2 italic">
                                        <Map size={12} /> Şehir Merkezi (KM)
                                    </label>
                                    <input name="distanceToCityCenterKm" type="number" step="0.1" value={formData.distanceToCityCenterKm} onChange={handleInputChange} className="w-full bg-cyan-50/10 dark:bg-cyan-900/5 border border-cyan-100 dark:border-cyan-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="2.5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#3BB2B8] uppercase tracking-widest flex items-center gap-2 italic">
                                        <Plane size={12} /> Havalimanı (KM)
                                    </label>
                                    <input name="distanceToAirportKm" type="number" step="0.1" value={formData.distanceToAirportKm} onChange={handleInputChange} className="w-full bg-cyan-50/10 dark:bg-cyan-900/5 border border-cyan-100 dark:border-cyan-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="45.0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Koordinatlar (Haritadan Seç)</label>
                                <LocationPicker
                                    lat={formData.latitude}
                                    lng={formData.longitude}
                                    onChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                                />
                                <div className="flex gap-4 mt-2">
                                    <input readOnly value={formData.latitude || ''} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-500" placeholder="Lat" />
                                    <input readOnly value={formData.longitude || ''} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-500" placeholder="Lng" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Tamamlanma & Durum */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <SectionHeader icon={Construction} title="Tamamlanma & Durum" desc="İnşaat durumu ve teslim tarihleri" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Proje Durumu</label>
                            <div className="flex gap-3">
                                {['Ready', 'Under Construction', 'Project'].map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, completionStatus: status }))}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.completionStatus === status ? 'bg-[#3BB2B8] text-white border-[#3BB2B8] shadow-lg shadow-cyan-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}
                                    >
                                        {status === 'Ready' ? 'Hazır' : status === 'Under Construction' ? 'İnşaat' : 'Proje'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#3BB2B8] uppercase tracking-widest italic">Tamamlanma / Teslim Tarihi</label>
                            <input name="completionDate" type="date" value={formData.completionDate} onChange={handleInputChange} className="w-full bg-cyan-50/10 dark:bg-cyan-900/5 border border-cyan-100 dark:border-cyan-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" />
                        </div>
                    </div>
                </div>

                {/* 4. Özellikler (Multi-choice) */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <SectionHeader icon={CheckCircle2} title="Donanım & Özellikler" desc="İç ve dış mekandaki çarpıcı detaylar" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { key: 'featuresInternal', label: 'İç Özellikler', options: ['Klima', 'Beyaz Eşya', 'Mobilya', 'Akıllı Ev', 'Merkezi Isıtma', 'Ankastre'] },
                            { key: 'featuresExternal', label: 'Dış Özellikler', options: ['Havuz', 'Bahçe', 'Otopark', 'Güvenlik', 'Spor Alanı', 'Teras'] },
                            { key: 'featuresView', label: 'Konum & Manzara', options: ['Deniz Manzaralı', 'Dağ Manzaralı', 'Şehir Manzaralı', 'Doğa İçinde', 'Denize Sıfır'] }
                        ].map(cat => (
                            <div key={cat.key} className="space-y-4">
                                <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{cat.label}</h4>
                                <div className="space-y-2">
                                    {cat.options.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => toggleFeature(cat.key, opt)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${formData[cat.key].includes(opt) ? 'bg-[#3BB2B8]/10 text-[#3BB2B8] border-[#3BB2B8]/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-100'}`}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-wide">{opt}</span>
                                            {formData[cat.key].includes(opt) && <CheckCircle2 size={12} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Açıklama & SEO */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <SectionHeader icon={FileText} title="Açıklama & SEO" desc="Arama motorları ve müşteriler için içerik" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama (TR)</label>
                                <textarea name="descriptionTr" value={formData.descriptionTr} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl px-5 py-5 text-xs font-medium outline-none focus:border-[#3BB2B8] h-60 resize-none leading-relaxed" placeholder="İlan detaylarını buraya yazın..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description (EN)</label>
                                <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl px-5 py-5 text-xs font-medium outline-none focus:border-[#3BB2B8] h-60 resize-none leading-relaxed" placeholder="Describe the property details here..." />
                            </div>
                        </div>

                        <div className="space-y-8 p-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 text-[#3BB2B8] mb-4">
                                <Globe size={20} />
                                <span className="text-xs font-black uppercase tracking-widest italic">SEO Optimization Panel</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus SEO Title</label>
                                    <input name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="Google'da görünecek başlık..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Description</label>
                                    <textarea name="seoDesc" value={formData.seoDesc} onChange={handleInputChange} className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-medium outline-none focus:border-[#3BB2B8] h-32 resize-none" placeholder="Arama sonuçlarındaki kısa özet..." />
                                </div>
                                <div className="p-4 bg-white/50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[9px] font-black text-[#3BB2B8] uppercase tracking-widest mb-2">GOOGLE ÖNİZLEME</p>
                                    <h4 className="text-[12px] font-bold text-blue-500 truncate mb-1">{formData.seoTitle || formData.titleTr || 'İlan Başlığı'}</h4>
                                    <p className="text-[11px] text-green-700 truncate mb-1">www.cariaestates.com \u203A properties \u203A girne-villa</p>
                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{formData.seoDesc || 'Lütfen meta açıklama girerek arama sonuçlarındaki performansınızı artırın.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Galeri (Mocked functionality for now) */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <SectionHeader icon={Camera} title="Fotoğraf Galerisi" desc="Sürükle bırak ile görselleri yönetin" />

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {formData.gallery.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 group shadow-sm">
                                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                                    <button className="p-1.5 bg-white rounded-lg text-slate-900 shadow-xl" title="Kapak Yap"><CheckCircle2 size={12} /></button>
                                    <button className="p-1.5 bg-red-500 rounded-lg text-white shadow-xl" title="Sil"><Trash2 size={12} /></button>
                                </div>
                            </div>
                        ))}
                        <button className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-[#3BB2B8] hover:text-[#3BB2B8] hover:bg-cyan-50/10 transition-all group">
                            <Plus size={32} className="group-hover:rotate-90 transition-transform" />
                            <span className="text-[9px] font-black uppercase tracking-widest mt-4">Görsel Ekle</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-480px)] max-w-4xl z-50">
                <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/20 dark:border-slate-200/50 shadow-2xl shadow-black/20 flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="w-12 h-12 rounded-2xl border border-white/20 dark:border-slate-200 flex items-center justify-center text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-slate-100 transition-all">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="hidden md:block">
                            <div className="text-[10px] font-black text-white/50 dark:text-slate-400 uppercase tracking-widest">SİSTEM DURUMU</div>
                            <div className="text-[11px] font-black text-white dark:text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {mode === 'create' ? 'Yeni Kayıt' : 'Düzenleme Modu'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleSave('draft')}
                            className="px-8 py-4 bg-white/10 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/20 dark:hover:bg-slate-200 transition-all"
                        >
                            Pasif / Taslak
                        </button>
                        <button
                            onClick={() => handleSave('published')}
                            className="px-10 py-4 bg-[#3BB2B8] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <Save size={16} /> {mode === 'create' ? 'İLAN OLUŞTUR' : 'DEĞİŞİKLİKLERİ KAYDET'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyForm;
