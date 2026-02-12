import React, { useState } from 'react';
import { useAdminStore } from '../state/adminStore';
import ReminderPicker from './lead/ReminderPicker';
import { X, User, Phone, MessageCircle, Mail, Clock, MapPin, CheckCircle2, Plus, Trash2 } from 'lucide-react';

const LeadDrawer = ({ lead, isOpen, onClose }) => {
    const { setLeadReminder } = useAdminStore();
    const [activeTab, setActiveTab] = useState('aktiviteler');
    const [notes, setNotes] = useState([
        { id: 1, text: 'Müşteri Bodrum bölgesindeki lüks villalarla ilgileniyor.', date: '2 saat önce' },
        { id: 2, text: 'Bütçe artırımı için görüşüldü, portföy sunuldu.', date: 'Dün' }
    ]);
    const [newNote, setNewNote] = useState('');

    if (!lead) return null;

    const addNote = () => {
        if (!newNote.trim()) return;
        setNotes([{ id: Date.now(), text: newNote, date: 'Az önce' }, ...notes]);
        setNewNote('');
    };

    const removeNote = (id) => {
        setNotes(notes.filter(n => n.id !== id));
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
                className={`fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white dark:bg-slate-950 shadow-2xl z-[1001] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#3BB2B8]">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{lead.name}</h2>
                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{lead.consultant} • DANIŞMAN</div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* Action Bar */}
                        <div className="grid grid-cols-3 gap-2 p-6 pb-0">
                            <button className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8] transition-colors">
                                <Phone size={18} className="text-blue-500" />
                                <span className="text-[10px] font-bold uppercase">ARA</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8] transition-colors">
                                <MessageCircle size={18} className="text-green-500" />
                                <span className="text-[10px] font-bold uppercase">WHATSAPP</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8] transition-colors">
                                <Mail size={18} className="text-orange-500" />
                                <span className="text-[10px] font-bold uppercase">E-POSTA</span>
                            </button>
                        </div>

                        {/* Reminder & SLA Section */}
                        <div className="px-6 mt-6">
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">TAKİP HATIRLATICI</span>
                                    <span className="text-[10px] font-bold text-slate-500">Gelecek adım için zaman belirleyin</span>
                                </div>
                                <ReminderPicker
                                    currentReminder={lead.reminderAt}
                                    onSet={(date) => setLeadReminder(lead.id, date)}
                                />
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bütçe</div>
                                    <div className="text-lg font-black text-[#3BB2B8] tracking-tight">
                                        {lead.currency === 'TL' ? '₺' : '£'}{lead.budget.toLocaleString('tr-TR')}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lokasyon</div>
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{lead.location}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fırsat Türü</div>
                                    <div className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase">{lead.intent}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Durum</div>
                                    <div className="text-sm font-black text-[#3BB2B8] uppercase">{lead.status.replace('_', ' ')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6">
                            <div className="flex border-b border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setActiveTab('aktiviteler')}
                                    className={`px-4 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'aktiviteler' ? 'border-[#3BB2B8] text-[#3BB2B8]' : 'border-transparent text-slate-400'}`}
                                >
                                    AKTİVİTELER
                                </button>
                                <button
                                    onClick={() => setActiveTab('notlar')}
                                    className={`px-4 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'notlar' ? 'border-[#3BB2B8] text-[#3BB2B8]' : 'border-transparent text-slate-400'}`}
                                >
                                    NOTLAR ({notes.length})
                                </button>
                            </div>

                            <div className="py-6">
                                {activeTab === 'aktiviteler' ? (
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                <Phone size={14} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Telefon Görüşmesi Yapıldı</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">Bugün, 09:45 • Can K.</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                                <MessageCircle size={14} className="text-green-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">WhatsApp Üzerinden Katalog Gönderildi</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">Dün, 14:20 • Can K.</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={14} className="text-cyan-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Fırsat Oluşturuldu</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">2 gün önce • Sistem</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                placeholder="Yeni not ekleyin..."
                                                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3BB2B8]"
                                            />
                                            <button onClick={addNote} className="p-2.5 bg-[#3BB2B8] text-white rounded-xl active:scale-95 transition-transform">
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        {notes.map(note => (
                                            <div key={note.id} className="group p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{note.date}</span>
                                                    <button onClick={() => removeNote(note.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{note.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <button className="w-full bg-[#3BB2B8] hover:bg-[#329ba1] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 active:scale-95 uppercase tracking-widest">
                            TEKLİF OLUŞTUR
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeadDrawer;
