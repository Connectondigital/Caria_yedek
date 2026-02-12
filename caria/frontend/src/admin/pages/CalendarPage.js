import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { clientService } from '../services/clientService';
import { useAdminStore } from '../state/adminStore';

const CalendarPage = () => {
    const { addNotification } = useAdminStore();
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [newAppt, setNewAppt] = useState({
        client_id: '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        location: 'Ofis',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [apptData, clientData] = await Promise.all([
                clientService.getAppointments(),
                clientService.getClients()
            ]);
            setAppointments(apptData);
            setClients(clientData);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!newAppt.client_id || !newAppt.title) {
            addNotification({ title: 'Hata', message: 'Müşteri ve Başlık zorunludur.', type: 'error' });
            return;
        }

        try {
            await clientService.addAppointment({
                ...newAppt,
                client_id: parseInt(newAppt.client_id)
            });
            setShowModal(false);
            loadData();
            addNotification({ title: 'Başarılı', message: 'Randevu oluşturuldu.', type: 'success' });
        } catch (e) {
            console.error(e);
            addNotification({ title: 'Hata', message: 'Randevu oluşturulamadı.', type: 'error' });
        }
    };

    // Group appointments by date
    const grouped = appointments.reduce((acc, curr) => {
        const d = curr.date;
        if (!acc[d]) acc[d] = [];
        acc[d].push(curr);
        return acc;
    }, {});

    // Generate next 7 days for view
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().split('T')[0]);
    }

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950 font-sans p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">AJANDA</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Randevu ve Toplantı Yönetimi</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#3BB2B8] hover:bg-[#2fa0a6] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                    <Plus size={16} /> Yeni Randevu
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {days.map(dayStr => {
                    const dateObj = new Date(dayStr);
                    const dayName = dateObj.toLocaleDateString('tr-TR', { weekday: 'long' });
                    const dayNum = dateObj.getDate();
                    const isToday = dayStr === new Date().toISOString().split('T')[0];
                    const daysAppts = grouped[dayStr] || [];

                    return (
                        <div key={dayStr} className={`min-h-[300px] rounded-2xl border ${isToday ? 'bg-white dark:bg-slate-900 border-[#3BB2B8]' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'} p-4 flex flex-col`}>
                            <div className="mb-4 text-center">
                                <div className={`text-[10px] uppercase tracking-widest font-black ${isToday ? 'text-[#3BB2B8]' : 'text-slate-400'}`}>{dayName}</div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">{dayNum}</div>
                            </div>

                            <div className="flex-1 space-y-2">
                                {daysAppts.map(appt => (
                                    <div key={appt.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-[#3BB2B8] transition-all cursor-pointer group">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            {appt.time}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase truncate group-hover:text-[#3BB2B8] transition-colors">
                                            {appt.title}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-[9px] font-bold text-slate-400">
                                            <User size={10} /> {appt.client_name}
                                        </div>
                                    </div>
                                ))}
                                {daysAppts.length === 0 && (
                                    <div className="h-full flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest rotate-[-90deg]">Boş</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Yeni Randevu</h2>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</label>
                                <select
                                    value={newAppt.client_id}
                                    onChange={e => setNewAppt({ ...newAppt, client_id: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]"
                                >
                                    <option value="">Seçiniz...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Başlık</label>
                                <input
                                    value={newAppt.title}
                                    onChange={e => setNewAppt({ ...newAppt, title: e.target.value })}
                                    placeholder="Örn: Villa Sunumu"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarih</label>
                                    <input
                                        type="date"
                                        value={newAppt.date}
                                        onChange={e => setNewAppt({ ...newAppt, date: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saat</label>
                                    <input
                                        type="time"
                                        value={newAppt.time}
                                        onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3BB2B8]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">İptal</button>
                            <button onClick={handleSave} className="flex-1 py-4 bg-[#3BB2B8] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
