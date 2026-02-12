import React, { useState, useEffect } from 'react';
import {
    X, User, Phone, Mail, MessageCircle,
    Clock, Plus, Trash2, FileText, Target,
    MapPin, DollarSign, Activity, History
} from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';
import { clientService } from '../../services/clientService';

const ClientDrawer = ({ client, isOpen, onClose }) => {
    const { addActivity } = useAdminStore();
    const [activeTab, setActiveTab] = useState('ÖZET');
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [matches, setMatches] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingMatches, setLoadingMatches] = useState(false);

    // Initial Load
    useEffect(() => {
        if (client) {
            const savedNotes = localStorage.getItem(`client_notes_${client.id}`);
            setNotes(savedNotes ? JSON.parse(savedNotes) : []);
            setActiveTab('ZAMAN TÜNELİ');
            setMatches([]);
            loadActivities();
        }
    }, [client]);

    const loadActivities = async () => {
        setLoadingActivities(true);
        try {
            const data = await clientService.getActivities(client.id);
            setActivities(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingActivities(false);
        }
    };

    const logAction = async (type, desc) => {
        try {
            await clientService.addActivity({
                client_id: client.id,
                type: type,
                title: type.toUpperCase(),
                description: desc,
                created_by: 'Admin'
            });
            loadActivities(); // Refresh
        } catch (e) {
            console.error(e);
        }
    };

    const handleWhatsAppShare = async (prop) => {
        // Open WhatsApp
        const text = `Merhaba ${client.name}, sizin için harika bir portföy buldum: ${prop.title} - ${prop.price}`;
        window.open(`https://wa.me/${client.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');

        // Auto Log
        await logAction('whatsapp', `Müşteriye "${prop.title}" ilanı gönderildi.`);
        addActivity({
            type: 'client',
            title: 'WhatsApp Paylaşımı',
            description: `${client.name} kişisine ilan gönderildi.`,
            entity: 'System'
        });
    };

    useEffect(() => {
        if (activeTab === 'EŞLEŞMELER' && client && matches.length === 0) {
            loadMatches();
        }
    }, [activeTab, client]);

    const loadMatches = async () => {
        setLoadingMatches(true);
        try {
            const data = await clientService.getClientMatches(client.id);
            setMatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMatches(false);
        }
    };

    const addNote = () => {
        if (!newNote.trim()) return;
        const note = { id: Date.now(), text: newNote, date: 'Şimdi' };
        const updatedNotes = [note, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem(`client_notes_${client.id}`, JSON.stringify(updatedNotes));
        setNewNote('');

        addActivity({
            type: 'note',
            title: 'Müşteri Notu Eklendi',
            description: `${client.name} için yeni bir not girildi: "${note.text.substring(0, 30)}..."`,
            entity: 'Client OS'
        });
    };

    const deleteNote = (id) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem(`client_notes_${client.id}`, JSON.stringify(updatedNotes));

        addActivity({
            type: 'note',
            title: 'Müşteri Notu Silindi',
            description: `${client.name} dosyasına ait bir not kaldırıldı.`,
            entity: 'Client OS'
        });
    };

    if (!client) return null;

    const tabs = ['ZAMAN TÜNELİ', 'ÖZET', 'EŞLEŞMELER', 'NOTLAR'];

    return (
        <>
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white dark:bg-slate-950 shadow-2xl z-[1001] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full bg-white dark:bg-slate-950">

                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#3BB2B8]/10 rounded-2xl flex items-center justify-center text-[#3BB2B8]">
                                <User size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{client.name}</h2>
                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{client.consultant} • DANIŞMAN</div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hidden">
                        {/* Quick Contact */}
                        <div className="grid grid-cols-3 gap-3 p-6 pb-0">
                            <button className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8] transition-all group">
                                <Phone size={18} className="text-blue-500 transition-transform group-hover:scale-110" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">ARA</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8] transition-all group">
                                <MessageCircle size={18} className="text-green-500 transition-transform group-hover:scale-110" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">WHATSAPP</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8] transition-all group">
                                <Mail size={18} className="text-orange-500 transition-transform group-hover:scale-110" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">E-POSTA</span>
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="px-6 mt-8 flex border-b border-slate-50 dark:border-slate-800">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab
                                        ? 'border-[#3BB2B8] text-[#3BB2B8]'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'ÖZET' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign size={14} className="text-green-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bütçe</span>
                                            </div>
                                            <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                                {client.currency === 'GBP' ? '£' : '₺'}{client.budget.toLocaleString('tr-TR')}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin size={14} className="text-orange-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hedef Bölge</span>
                                            </div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                                                {client.region}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Target size={16} className="text-[#3BB2B8]" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri Profili</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-widest">AŞAMA</span>
                                                <span className="font-black text-[#3BB2B8] uppercase">{client.stage}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-widest">ETİKET</span>
                                                <span className="font-black text-amber-500 uppercase">{client.tag}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-widest">CİNSİ</span>
                                                <span className="font-black text-slate-700 dark:text-slate-200 uppercase">Yatırımcı / Konut</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ZAMAN TÜNELİ' && (
                                <div className="space-y-6">
                                    {/* Quick Actions */}
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        <button onClick={() => logAction('call', 'Telefon Görüşmesi')} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all shrink-0">
                                            <Phone size={14} /> Arama Logla
                                        </button>
                                        <button onClick={() => logAction('whatsapp', 'WhatsApp Mesajı')} className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition-all shrink-0">
                                            <MessageCircle size={14} /> WP Mesajı
                                        </button>
                                        <button onClick={() => logAction('meeting', 'Ofis Toplantısı')} className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all shrink-0">
                                            <User size={14} /> Toplantı
                                        </button>
                                    </div>

                                    {loadingActivities ? (
                                        <div className="flex justify-center"><div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" /></div>
                                    ) : activities.length === 0 ? (
                                        <div className="text-center text-xs text-slate-400 italic">Henüz aktivite yok.</div>
                                    ) : (
                                        activities.map((act, idx) => (
                                            <div key={idx} className="flex gap-4 relative">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-slate-950 ${act.type === 'call' ? 'bg-blue-100 text-blue-500' :
                                                        act.type === 'whatsapp' ? 'bg-green-100 text-green-500' :
                                                            act.type === 'offer' ? 'bg-orange-100 text-orange-500' :
                                                                'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {act.type === 'call' ? <Phone size={12} /> :
                                                        act.type === 'whatsapp' ? <MessageCircle size={12} /> :
                                                            act.type === 'offer' ? <FileText size={12} /> :
                                                                <Activity size={12} />}
                                                </div>
                                                <div className="pb-6">
                                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{act.description || act.title}</div>
                                                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-medium">{new Date(act.created_at).toLocaleString('tr-TR')}</div>
                                                </div>
                                                {idx !== activities.length - 1 && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'EŞLEŞMELER' && (
                                <div className="space-y-3">
                                    {loadingMatches ? (
                                        <div className="flex justify-center py-10">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
                                        </div>
                                    ) : matches.length === 0 ? (
                                        <div className="py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                            Henüz eşleşme bulunamadı.
                                        </div>
                                    ) : (
                                        matches.map(prop => (
                                            <div key={prop.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 group hover:border-[#3BB2B8] transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center">
                                                            <FileText size={18} className="text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{prop.title}</div>
                                                            <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">{prop.id} • {prop.price}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${prop.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {prop.status === 'Approved' ? 'ONAYLI' : 'BEKLEMEDE'}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleWhatsAppShare(prop)}
                                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <MessageCircle size={12} /> WhatsApp
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'NOTLAR' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Yeni not ekleyin..."
                                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#3BB2B8]"
                                        />
                                        <button onClick={addNote} className="w-12 h-12 bg-[#3BB2B8] text-white rounded-xl flex items-center justify-center active:scale-95 transition-all">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {notes.map(note => (
                                            <div key={note.id} className="group p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-red-100 dark:hover:border-red-900/30 transition-all">
                                                <div className="flex justify-between items-start mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>{note.date}</span>
                                                    <button onClick={() => deleteNote(note.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{note.text}</p>
                                            </div>
                                        ))}
                                        {notes.length === 0 && <div className="py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Henüz not eklenmedi</div>}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'TEKLİFLER' && (
                                <div className="space-y-3">
                                    {[
                                        { id: 'OFF-1022', title: 'Pearl Vista Villa', price: '450.000 GBP', status: 'Approved' },
                                        { id: 'OFF-1018', title: 'Mountain Edge Loft', price: '320.000 GBP', status: 'Pending' }
                                    ].map(offer => (
                                        <div key={offer.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-[#3BB2B8] transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center">
                                                    <FileText size={18} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{offer.title}</div>
                                                    <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">{offer.id} • {offer.price}</div>
                                                </div>
                                            </div>
                                            <div className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${offer.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {offer.status === 'Approved' ? 'ONAYLI' : 'BEKLEMEDE'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <button
                            onClick={() => window.location.hash = `client-edit/${client.id}`}
                            className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
                        >
                            DÜZENLEME MODUNA GEÇ
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientDrawer;
