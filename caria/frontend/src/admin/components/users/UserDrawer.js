import React, { useState, useEffect } from 'react';
import { X, Shield, Mail, MapPin, ToggleLeft, ToggleRight, CheckCircle, Smartphone, Globe, Link } from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';

const UserDrawer = ({ user, isOpen, onClose }) => {
    const { updateUser, linkGoogle, unlinkGoogle, session } = useAdminStore();
    const [editRole, setEditRole] = useState('');
    const [editRegions, setEditRegions] = useState('');
    const [editStatus, setEditStatus] = useState(true);

    const isManager = session?.role === 'manager';

    useEffect(() => {
        if (user) {
            setEditRole(user.role);
            setEditRegions(user.regions.join(', '));
            setEditStatus(user.isActive);
        }
    }, [user]);

    if (!user) return null;

    const handleSave = () => {
        if (isManager) return;
        updateUser(user.id, {
            role: editRole,
            regions: editRegions.split(',').map(r => r.trim()).filter(r => r),
            isActive: editStatus
        });
        onClose();
    };

    const handleGoogleToggle = () => {
        if (user.googleLinked) unlinkGoogle(user.id);
        else linkGoogle(user.id);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1500] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className={`fixed top-0 right-0 w-full max-w-[440px] h-screen bg-white dark:bg-slate-900 z-[1600] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#3BB2B8] shadow-lg">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Kullanıcı Düzenle</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hidden p-8 space-y-10">

                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Profil Bilgileri</h4>
                        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail size={16} className="text-slate-400" />
                                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{user.email}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Smartphone size={16} className="text-slate-400" />
                                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">+90 (555) 000 0000</div>
                            </div>
                        </div>
                    </section>

                    {/* Permissions & Roles */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Yetki & Erişim</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">SİSTEM ROLÜ</label>
                                <select
                                    disabled={isManager}
                                    value={editRole}
                                    onChange={e => setEditRole(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#3BB2B8] appearance-none disabled:opacity-50"
                                >
                                    <option value="admin">Administrator</option>
                                    <option value="manager">Manager (Sınırlı)</option>
                                    <option value="advisor">Advisor (Danışman)</option>
                                    <option value="investor">Investor</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">SORUMLU BÖLGELER</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-4 text-slate-400"><MapPin size={16} /></div>
                                    <input
                                        disabled={isManager}
                                        type="text"
                                        value={editRegions}
                                        onChange={e => setEditRegions(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 pl-12 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#3BB2B8] disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Google Mail Sync */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Entegrasyonlar</h4>
                        <div className={`p-6 rounded-[2rem] border transition-all ${user.googleLinked ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center">
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Google Mail</div>
                                        <div className={`text-[9px] font-bold uppercase tracking-widest ${user.googleLinked ? 'text-green-500' : 'text-slate-400'}`}>
                                            {user.googleLinked ? 'BAĞLI' : 'BAĞLI DEĞİL'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGoogleToggle}
                                    className={`p-2 rounded-xl transition-all ${user.googleLinked ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-[#3BB2B8] text-white hover:bg-[#329ba1]'}`}
                                >
                                    {user.googleLinked ? <X size={16} strokeWidth={3} /> : <Link size={16} strokeWidth={3} />}
                                </button>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                                Gmail entegrasyonu için backend OAuth akışı gerekir. Şimdilik simülasyon olarak bağlanmaktadır.
                            </p>
                        </div>
                    </section>

                    {/* Account Status */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hesap Durumu</h4>
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Hesap Erişimi</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Kullanıcı girişi yapabilir mi?</div>
                            </div>
                            <button
                                disabled={isManager}
                                onClick={() => setEditStatus(!editStatus)}
                                className={`text-3xl transition-colors ${editStatus ? 'text-green-500' : 'text-slate-300'} disabled:opacity-50`}
                            >
                                {editStatus ? <ToggleRight size={40} strokeWidth={1} /> : <ToggleLeft size={40} strokeWidth={1} />}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <button
                        disabled={isManager}
                        onClick={handleSave}
                        className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${isManager
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-[#3BB2B8] hover:bg-[#329ba1] text-white shadow-cyan-500/20 px-8'
                            }`}
                    >
                        DEĞİŞİKLİKLERİ KAYDET
                    </button>
                    {isManager && (
                        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest text-center mt-3">
                            <Info size={10} className="inline mr-1" /> Yönetici rolü kısıtlıdır
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserDrawer;
