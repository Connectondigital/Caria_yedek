import React from 'react';
import { X, CheckCheck, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';

const NotificationPanel = ({ onClose }) => {
    const { notifications, markAllRead } = useAdminStore();

    return (
        <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Bildirimler</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Sistem ve İşlem Uyarıları</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllRead}
                        className="p-2 hover:bg-[#3BB2B8]/10 text-slate-400 hover:text-[#3BB2B8] rounded-xl transition-all group"
                        title="Tümünü okundu yap"
                    >
                        <CheckCheck size={16} />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-hidden">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors relative group ${!notif.read ? 'bg-cyan-50/10' : ''}`}
                            >
                                {!notif.read && (
                                    <div className="absolute left-2 top-6 w-1.5 h-1.5 bg-[#3BB2B8] rounded-full"></div>
                                )}
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${notif.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-cyan-50 text-[#3BB2B8]'
                                        }`}>
                                        {notif.type === 'alert' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase leading-tight">{notif.title}</h4>
                                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase mt-2">{notif.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Bildirim Bulunmuyor</div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800 text-center">
                <button className="text-[10px] font-black text-[#3BB2B8] uppercase tracking-widest hover:underline">
                    Tüm Bildirimleri Gör
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
