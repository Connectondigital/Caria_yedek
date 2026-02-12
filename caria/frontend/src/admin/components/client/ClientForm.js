import React, { useState } from 'react';
import {
    User, Phone, Mail, Globe, MapPin, Home,
    Calendar, Tag, MessageCircle, Info, ShieldCheck,
    Save, ArrowLeft, Layers, Target, Clock, Hash
} from 'lucide-react';

const ClientForm = ({ initialData, mode = 'create', onSave }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        phone: '',
        email: '',
        whatsapp: '',
        preferredLanguage: 'TR',
        consultant: '',
        region: '',
        propertyType: '',
        dealType: 'Purchase', // Purchase, Rent
        budget: '',
        currency: 'GBP',
        timeframe: 'Immediate', // Immediate, 3-6 months, Long term
        tag: 'New', // New, HOT, VIP, DELAYED
        leadSource: 'Web Site',
        campaignName: '',
        adSetName: '',
        adId: '',
        formId: '',
        externalLeadId: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        notes: '',
        consentKvkk: false,
        status: 'active'
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            alert('Lütfen Ad Soyad ve Telefon alanlarını doldurun.');
            return;
        }
        onSave(formData);
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
            <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-10">

                {/* 1. Temel Bilgiler */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm transition-all duration-300">
                    <SectionHeader icon={User} title="Temel Bilgiler" desc="Kişisel iletişim ve danışman ataması" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Ad Soyad</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8] transition-all" placeholder="Örn: Ahmet Yılmaz" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefon</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="+90 ..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">E-Posta</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="ahmet@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp</label>
                            <div className="relative text-green-500">
                                <MessageCircle size={14} className="absolute left-5 top-1/2 -translate-y-1/2" />
                                <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-xs font-black outline-none focus:border-[#3BB2B8]" placeholder="Aynı numara" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tercih Edilen Dil</label>
                            <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none cursor-pointer">
                                <option value="TR">Türkçe (TR)</option>
                                <option value="EN">English (EN)</option>
                                <option value="RU">Russian (RU)</option>
                                <option value="DE">German (DE)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-[#3BB2B8]">Atanan Danışman</label>
                            <input name="consultant" value={formData.consultant} onChange={handleInputChange} className="w-full bg-[#3BB2B8]/5 dark:bg-[#3BB2B8]/10 border border-[#3BB2B8]/20 rounded-2xl px-5 py-4 text-xs font-black text-[#3BB2B8] outline-none" placeholder="Danışman Seçimi..." />
                        </div>
                    </div>
                </div>

                {/* 2. İlgi & İhtiyaç */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm transition-all duration-300">
                    <SectionHeader icon={Target} title="İlgi & İhtiyaç" desc="Talep edilen mülk nitelikleri ve bütçe" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Aranan Bölge</label>
                            <input name="region" value={formData.region} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#3BB2B8]" placeholder="Örn: Girne" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Emlak Tipi</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                <option value="">Seçiniz</option>
                                <option value="Villa">Villa</option>
                                <option value="Apartment">Apartman / Daire</option>
                                <option value="Land">Arsa</option>
                                <option value="Commercial">Ticari</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">İşlem Tipi</label>
                            <div className="flex gap-2">
                                {['Purchase', 'Rent'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, dealType: type }))}
                                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.dealType === type ? 'bg-[#3BB2B8] text-white border-[#3BB2B8]' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'}`}
                                    >
                                        {type === 'Purchase' ? 'Satın Alma' : 'Kiralama'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Bütçe</label>
                                <input name="budget" type="number" value={formData.budget} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-black outline-none focus:border-[#3BB2B8]" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Birim</label>
                                <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                    <option value="GBP">£</option>
                                    <option value="EUR">€</option>
                                    <option value="USD">$</option>
                                    <option value="TL">₺</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Zamanlama</label>
                            <select name="timeframe" value={formData.timeframe} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                <option value="Immediate">Hemen</option>
                                <option value="3-6 months">3-6 Ay</option>
                                <option value="Long term">Uzun Dönem</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Müşteri Etiketi</label>
                            <select name="tag" value={formData.tag} onChange={handleInputChange} className={`w-full border rounded-2xl px-5 py-4 text-xs font-black outline-none ${formData.tag === 'HOT' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                    formData.tag === 'VIP' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                                        formData.tag === 'DELAYED' ? 'bg-red-50 border-red-200 text-red-600' :
                                            'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'
                                }`}>
                                <option value="New">NEW</option>
                                <option value="HOT">HOT / SICAK</option>
                                <option value="VIP">VIP / ÖZEL</option>
                                <option value="DELAYED">GECİKMİŞ</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Kaynak & Reklam Verileri */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BB2B8] opacity-[0.02] blur-[80px] pointer-events-none" />
                    <SectionHeader icon={Layers} title="Kaynak & Reklam Verileri" desc="Pazarlama kanalları ve kampanya detayları" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lead Kaynağı</label>
                            <select name="leadSource" value={formData.leadSource} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none">
                                <option value="Meta Ads">Meta Ads (FB/IG)</option>
                                <option value="Google Ads">Google Ads</option>
                                <option value="TikTok">TikTok Ads</option>
                                <option value="Web Site">Web Sitesi</option>
                                <option value="Phone">Telefon</option>
                                <option value="Reference">Referans</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kampanya Adı</label>
                            <input name="campaignName" value={formData.campaignName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none" placeholder="Örn: Bodrum Summer Sale" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Ad Set / Reklam Grubu</label>
                            <input name="adSetName" value={formData.adSetName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none" placeholder="Örn: UK Audience" />
                        </div>
                        <div className="space-y-6 col-span-full pt-6 border-t border-slate-50 dark:border-slate-900">
                            <h4 className="flex items-center gap-2 text-[10px] font-black text-[#3BB2B8] uppercase tracking-[0.2em] italic">
                                <Hash size={14} /> Teknik Tanımlayıcılar & UTM
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['adId', 'formId', 'externalLeadId', 'utm_source', 'utm_medium', 'utm_campaign'].map(field => (
                                    <div key={field} className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] px-1">{field.replace('_', ' ')}</label>
                                        <input
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 py-1 text-[10px] font-mono text-slate-600 dark:text-slate-400 focus:border-[#3BB2B8] outline-none"
                                            placeholder="-"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Notlar & KVKK */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                        <SectionHeader icon={Calendar} title="Notlar & Timeline" desc="Müşteri görüşme notları ve takip" />
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-xs font-medium outline-none focus:border-[#3BB2B8] min-h-[160px] resize-none leading-relaxed"
                            placeholder="Müşteri hakkındaki ilk notları buraya girebilirsiniz..."
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm flex flex-col justify-between">
                        <div>
                            <SectionHeader icon={ShieldCheck} title="Hukuki & KVKK" desc="Veri işleme ve iletişim onayı" />
                            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-start gap-4 cursor-pointer">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="consentKvkk"
                                            name="consentKvkk"
                                            type="checkbox"
                                            checked={formData.consentKvkk}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded border-slate-300 text-[#3BB2B8] focus:ring-[#3BB2B8]"
                                        />
                                    </div>
                                    <label htmlFor="consentKvkk" className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed select-none">
                                        Müşteri, verilerinin işlenmesi ve ticari ileti almayı <span className="text-[#3BB2B8]">KVKK</span> kapsamında onayladı.
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-[#3BB2B8]/5 rounded-xl border border-dashed border-[#3BB2B8]/20 text-center">
                            <p className="text-[9px] font-black text-[#3BB2B8] uppercase tracking-widest">SİSTEM MESAJI</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic leading-tight">Yayımlanan her müşteri, danışman panelinde otomatik olarak senkronize edilir.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-480px)] max-w-4xl z-50 transition-all duration-500">
                <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/20 dark:border-slate-200 shadow-2xl shadow-black/30 flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="w-12 h-12 rounded-2xl border border-white/20 dark:border-slate-200 flex items-center justify-center text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-slate-100 transition-all">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="hidden md:block">
                            <div className="text-[9px] font-black text-white/50 dark:text-slate-400 uppercase tracking-widest">CLIENT OS STATUS</div>
                            <div className="text-[11px] font-black text-white dark:text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {mode === 'create' ? 'Yeni Müşteri' : 'Düzenleme Modu'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handleSave} className="px-12 py-4 bg-[#3BB2B8] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-3">
                            <Save size={18} /> {mode === 'create' ? 'MÜŞTERİ OLUŞTUR' : 'GÜNCELLEMELERİ KAYDET'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientForm;
