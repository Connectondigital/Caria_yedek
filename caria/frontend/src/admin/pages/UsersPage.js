import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../state/adminStore';
import { Users, UserPlus, Shield, MapPin, Search, Edit2, UserMinus, UserCheck, Mail, ExternalLink, Star } from 'lucide-react';
import UserFormModal from '../components/users/UserFormModal';
import UserDrawer from '../components/users/UserDrawer';

const UsersPage = () => {
    const { users, session, deactivateUser, updateUser } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isManager = session?.role === 'manager';

    const kpis = useMemo(() => {
        return {
            total: users.length,
            advisors: users.filter(u => u.role === 'advisor' && u.isActive).length,
            inactive: users.filter(u => !u.isActive).length,
            google: users.filter(u => u.googleLinked).length
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    const handleToggleStatus = (user) => {
        if (isManager) return;
        updateUser(user.id, { isActive: !user.isActive });
    };

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50/50 dark:bg-slate-950 font-sans">
            <div className="px-8 pt-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-[#3BB2B8]/10 rounded-xl flex items-center justify-center text-[#3BB2B8]">
                                <Shield size={18} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                                Kullanıcılar & Roller
                            </h1>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1">
                            Sistem Erişim ve Personel Yönetimi
                        </p>
                    </div>
                    <button
                        onClick={() => !isManager && setIsModalOpen(true)}
                        disabled={isManager}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-xl uppercase tracking-widest ${isManager
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-[#3BB2B8] hover:bg-[#329ba1] text-white shadow-cyan-500/20 active:scale-95'
                            }`}
                    >
                        <UserPlus size={18} strokeWidth={3} />
                        YENİ KULLANICI
                    </button>
                </div>

                {/* KPI Strip */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'TOPLAM KULLANICI', value: kpis.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'AKTİF DANIŞMAN', value: kpis.advisors, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                        { label: 'PASİF / AYRIlMIŞ', value: kpis.inactive, icon: UserMinus, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                        { label: 'GOOGLE BAĞLI', value: kpis.google, icon: Mail, color: 'text-[#3BB2B8]', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
                    ].map((card, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center shrink-0`}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</div>
                                <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-2.5">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="İsim, e-posta veya rol ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 px-8 pb-8 overflow-hidden">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full overflow-auto scrollbar-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kullanıcı</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol & E-posta</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sorumlu Bölgeler</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Durum</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Google</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 font-black text-xs">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-1 ${user.role === 'admin' ? 'bg-red-50 text-red-500' :
                                            user.role === 'manager' ? 'bg-blue-50 text-blue-500' :
                                                'bg-cyan-50 text-[#3BB2B8]'
                                            }`}>
                                            {user.role}
                                        </div>
                                        <div className="text-xs font-medium text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-wrap gap-1">
                                            {user.regions.map(r => (
                                                <span key={r} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-400 rounded-lg border border-slate-100 dark:border-slate-700 uppercase">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`w-8 h-4 rounded-full relative transition-all ${user.isActive ? 'bg-green-500' : 'bg-slate-300'} ${isManager ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${user.isActive ? 'translate-x-4' : ''}`}></div>
                                        </button>
                                    </td>
                                    <td className="p-5 text-center">
                                        {user.googleLinked ? (
                                            <div className="flex items-center justify-center text-green-500" title="Bağlı">
                                                <UserCheck size={18} />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center text-slate-300" title="Bağlı Değil">
                                                <Mail size={18} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 hover:bg-[#3BB2B8]/10 text-slate-400 hover:text-[#3BB2B8] rounded-xl transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals & Drawers */}
            <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <UserDrawer user={selectedUser} isOpen={isDrawerOpen} onClose={() => { setIsDrawerOpen(false); setSelectedUser(null); }} />
        </div>
    );
};

export default UsersPage;
