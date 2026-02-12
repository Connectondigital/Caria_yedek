import React, { useState } from 'react';
import { useAdminStore } from '../state/adminStore';
import { clientService } from '../services/clientService';
import {
    User, Mail, Phone, MapPin, Briefcase,
    DollarSign, Home, Building2, Save, ArrowLeft,
    CheckCircle2, Target
} from 'lucide-react';

const InputGroup = ({ icon: Icon, label, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            {Icon && <Icon size={12} className="text-[#3BB2B8]" />} {label}
        </label>
        {children}
    </div>
);

const SelectButton = ({ selected, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${selected
            ? 'bg-[#3BB2B8] text-white border-[#3BB2B8] shadow-lg shadow-cyan-500/20'
            : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-[#3BB2B8]'
            }`}
    >
        {label}
    </button>
);

const ClientCreatePage = () => {
    const { addNotification } = useAdminStore();
    const [activeTab, setActiveTab] = useState('identity');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        source: 'Walk-in',
        stage: 'New',
        budget_min: '',
        budget_max: '',
        currency: 'GBP',
        location_interest: [],
        type_interest: [],
        bed_min: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleMultiSelect = (field, value) => {
        setFormData(prev => {
            const list = [...prev[field]];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            }
            return { ...prev, [field]: [...list, value] };
        });
    };

    const handleSave = async () => {
        if (!formData.full_name) {
            addNotification({
                title: 'Eksik Bilgi',
                message: 'Lütfen en azından İsim Soyisim giriniz.',
                type: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await clientService.saveClient({
                ...formData,
                budget_min: parseInt(formData.budget_min) || 0,
                budget_max: parseInt(formData.budget_max) || 0,
                bed_min: parseInt(formData.bed_min) || 0
            });

            addNotification({
                title: 'Başarılı',
                message: 'Yeni müşteri kaydı oluşturuldu.',
                type: 'success'
            });

            // Redirect back to list
            window.location.hash = 'client';
        } catch (error) {
            console.error(error);
            addNotification({
                title: 'Hata',
                message: 'Müşteri kaydedilirken bir sorun oluştu.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950 font-sans p-8 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                        YENİ MÜŞTERİ KAYDI
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                        CRM & Smart Matching Data Entry
                    </p>
                </div>
                <button onClick={() => window.history.back()} className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-all">
                    <ArrowLeft size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('identity')}
                    className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${activeTab === 'identity'
                        ? 'bg-white dark:bg-slate-900 shadow-xl border-b-4 border-[#3BB2B8]'
                        : 'bg-slate-100 dark:bg-slate-900/50 text-slate-400'
                        }`}
                >
                    <User size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">1. Kimlik & İletişim</span>
                </button>
                <button
                    onClick={() => setActiveTab('requirements')}
                    className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${activeTab === 'requirements'
                        ? 'bg-white dark:bg-slate-900 shadow-xl border-b-4 border-[#3BB2B8]'
                        : 'bg-slate-100 dark:bg-slate-900/50 text-slate-400'
                        }`}
                >
                    <Target size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">2. Tercihler & Kriterler</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="max-w-4xl mx-auto w-full">
                {activeTab === 'identity' ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputGroup icon={User} label="Tam İsim">
                                <input name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]" placeholder="Ad Soyad" autoFocus />
                            </InputGroup>
                            <InputGroup icon={Briefcase} label="Durum (Stage)">
                                <select name="stage" value={formData.stage} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                                    <option value="New">Yeni Lead</option>
                                    <option value="First Contact">İlk Temas</option>
                                    <option value="Interested">İlgileniyor</option>
                                    <option value="Viewing">Sunum Yapıldı</option>
                                    <option value="Offer">Teklif Aşamasında</option>
                                    <option value="Closed">Satış Kapandı</option>
                                    <option value="Lost">Kaybedildi</option>
                                </select>
                            </InputGroup>
                            <InputGroup icon={Phone} label="Telefon">
                                <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]" placeholder="+90 5XX XXX XX XX" />
                            </InputGroup>
                            <InputGroup icon={Mail} label="E-posta">
                                <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]" placeholder="email@example.com" />
                            </InputGroup>
                            <InputGroup icon={CheckCircle2} label="Kaynak (Source)">
                                <select name="source" value={formData.source} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                                    <option value="Walk-in">Ofise Geldi (Walk-in)</option>
                                    <option value="Website">Web Sitesi</option>
                                    <option value="Instagram">Instagram / Sosyal Medya</option>
                                    <option value="Referral">Referans</option>
                                    <option value="Sahibinden">Sahibinden.com</option>
                                    <option value="Other">Diğer</option>
                                </select>
                            </InputGroup>
                            <div className="col-span-2">
                                <InputGroup label="Notlar">
                                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8] h-32 resize-none" placeholder="Müşteri hakkında özel notlar..." />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setActiveTab('requirements')}
                                className="px-8 py-4 bg-[#3BB2B8]/10 text-[#3BB2B8] font-black rounded-xl hover:bg-[#3BB2B8] hover:text-white transition-all uppercase tracking-widest text-xs"
                            >
                                Devam Et: Kriterler &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800 mb-6">
                            <h3 className="text-orange-500 font-extrabold uppercase text-xs tracking-widest mb-1 flex items-center gap-2">
                                <Target size={14} /> Smart Matching Engine
                            </h3>
                            <p className="text-[10px] text-orange-400">Bu veriler, portföydeki uygun ilanları otomatik eşleştirmek için kullanılacaktır.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputGroup icon={DollarSign} label="Bütçe Aralığı">
                                <div className="flex gap-4 items-center">
                                    <input name="budget_min" type="number" value={formData.budget_min} onChange={handleInputChange} className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]" placeholder="Min" />
                                    <span className="text-slate-300">-</span>
                                    <input name="budget_max" type="number" value={formData.budget_max} onChange={handleInputChange} className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]" placeholder="Max" />
                                    <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-sm font-bold outline-none">
                                        <option value="GBP">£</option>
                                        <option value="EUR">€</option>
                                        <option value="USD">$</option>
                                        <option value="TL">₺</option>
                                    </select>
                                </div>
                            </InputGroup>

                            <InputGroup icon={Home} label="Min. Yatak Odası">
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4].map(num => (
                                        <SelectButton
                                            key={num}
                                            label={num === 0 ? 'Stüdyo' : `${num}+1`}
                                            selected={parseInt(formData.bed_min) === num}
                                            onClick={() => setFormData(p => ({ ...p, bed_min: num }))}
                                        />
                                    ))}
                                </div>
                            </InputGroup>

                            <div className="col-span-2 space-y-4">
                                <InputGroup icon={MapPin} label="İlgilendiği Bölgeler">
                                    <div className="flex flex-wrap gap-2">
                                        {['Girne', 'Lefkoşa', 'Gazimağusa', 'İskele', 'Güzelyurt', 'Lefke', 'Alsancak', 'Lapta', 'Esentepe', 'Çatalköy'].map(loc => (
                                            <SelectButton
                                                key={loc}
                                                label={loc}
                                                selected={formData.location_interest.includes(loc)}
                                                onClick={() => toggleMultiSelect('location_interest', loc)}
                                            />
                                        ))}
                                    </div>
                                </InputGroup>
                            </div>

                            <div className="col-span-2 space-y-4">
                                <InputGroup icon={Building2} label="Gayrimenkul Tipi">
                                    <div className="flex flex-wrap gap-2">
                                        {['Villa', 'Apartment', 'Penthouse', 'Land', 'Commercial', 'Bungalow'].map(type => (
                                            <SelectButton
                                                key={type}
                                                label={type}
                                                selected={formData.type_interest.includes(type)}
                                                onClick={() => toggleMultiSelect('type_interest', type)}
                                            />
                                        ))}
                                    </div>
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full p-4 z-50 pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-end pointer-events-auto">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-[#3BB2B8] text-white text-xs font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Müşteriyi Kaydet
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientCreatePage;
