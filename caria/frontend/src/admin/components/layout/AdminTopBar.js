import React, { useState } from 'react';
import { Bell, Search, User, Menu, LogOut } from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';
import NotificationPanel from '../notifications/NotificationPanel';
import GlobalSearchPanel from '../search/GlobalSearchPanel';
import { getBranding } from '../../../lib/branding';

const AdminTopBar = ({ clientConfig }) => {
    const { notifications, session, logout } = useAdminStore();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const unreadCount = notifications.filter(n => !n.read).length;
    const brand = getBranding(clientConfig);

    const handleLogout = () => {
        logout();
        window.location.pathname = '/login';
    };

    const getPageTitle = () => {
        const hash = window.location.hash;
        if (hash.includes('#sales')) return 'Satış Hunisi';
        if (hash.includes('#property')) return 'Portföy Yönetimi';
        if (hash.includes('#client')) return 'Müşteri Yönetimi';
        if (hash.includes('#executive')) return 'Genel Bakış';
        if (hash.includes('#cms')) return 'İçerik Yönetimi (CMS)';
        if (hash.includes('#activity')) return 'Aktivite Merkezi';
        if (hash.includes('#users')) return 'Kullanıcı & Rol Yönetimi';
        return 'Admin Panel';
    };

    return (
        <div className="h-20 w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 gap-12 sticky top-0 z-[50] transition-all duration-300">
            {/* Title & Logo Mark */}
            <div className="flex items-center gap-4">
                {brand.logoMark && (
                    <img
                        src={`${brand.logoMark}?v=4`}
                        alt="Mark"
                        className="max-h-[28px] w-auto object-contain p-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                )}
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest italic border-l-4 border-[#3BB2B8] pl-4">
                    {getPageTitle()}
                </h2>
            </div>

            {/* Global Search */}
            <div className="relative flex-1 min-w-0 group">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 transition-all focus-within:border-[#3BB2B8] focus-within:ring-4 focus-within:ring-[#3BB2B8]/10">
                    <Search size={18} className="text-slate-400 group-focus-within:text-[#3BB2B8] transition-colors" />
                    <input
                        type="text"
                        placeholder="Tüm sistemde ara... (Müşteri, ilan, lead)"
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                    />
                </div>

                {isSearchOpen && searchQuery && (
                    <GlobalSearchPanel
                        query={searchQuery}
                        onClose={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                        }}
                    />
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all relative group"
                    >
                        <Bell size={20} className="text-slate-500 group-hover:text-[#3BB2B8] transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <NotificationPanel onClose={() => setIsNotifOpen(false)} />
                    )}
                </div>

                {/* User Chip */}
                <div className="flex items-center gap-3 bg-slate-900 dark:bg-slate-800 p-1.5 pr-4 rounded-2xl border border-slate-800 shadow-xl shadow-slate-900/10 hidden md:flex min-w-[160px]">
                    <div className="w-9 h-9 bg-[#3BB2B8] rounded-xl flex items-center justify-center text-white font-black text-xs uppercase">
                        {session?.userName?.substring(0, 2) || 'AD'}
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">
                            {session?.userName || 'Admin'}
                        </div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            {session?.role || 'Manager'}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg transition-all ml-2"
                        title="Güvenli Çıkış"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminTopBar;
