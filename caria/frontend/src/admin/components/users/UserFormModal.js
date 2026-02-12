import React, { useState } from 'react';
import { X, UserPlus, Info } from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';

const UserFormModal = ({ isOpen, onClose }) => {
    const { createUser } = useAdminStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'advisor',
        regions: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            regions: formData.regions.split(',').map(r => r.trim()).filter(r => r)
        };
        createUser(payload);
        setFormData({ name: '', email: '', role: 'advisor', regions: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-[500px] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex items-center justify-center text-[#3BB2B8]">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Yeni Kullanıcı</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sisteme yeni personel ekleyin</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">AD SOYAD</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Örn: Ahmet Yılmaz"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#3BB2B8] transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">E-POSTA ADRESİ</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ahmet@caria.com"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#3BB2B8] transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">ROL</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#3BB2B8] appearance-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="advisor">Advisor</option>
                                    <option value="investor">Investor</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">BÖLGELER (Virgül ile)</label>
                                <input
                                    type="text"
                                    value={formData.regions}
                                    onChange={e => setFormData({ ...formData, regions: e.target.value })}
                                    placeholder="Bodrum, Kaş"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#3BB2B8] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-3">
                        <Info size={18} className="text-blue-500 shrink-0" />
                        <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 leading-relaxed">
                            Yeni kullanıcı eklendiğinde varsayılan parolası e-posta adresine gönderilecektir. (Şu an simülasyon aşamasındadır).
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 dark:bg-[#3BB2B8] text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                    >
                        KULLANICIYI OLUŞTUR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
