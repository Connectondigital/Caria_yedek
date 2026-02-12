import React, { useMemo } from 'react';
import { User, Briefcase, Home, ExternalLink, Search } from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';

const GlobalSearchPanel = ({ query, onClose }) => {
    const { setSelectedClient, setSelectedLead, setSelectedProperty } = useAdminStore();

    // Mock Consolidated Data for Search
    const MOCK_DATA = useMemo(() => ({
        clients: [
            { id: 1, name: 'Ahmet Yılmaz', region: 'Bodrum', tag: 'VIP' },
            { id: 2, name: 'Mehmet Demir', region: 'Fethiye', tag: 'SICAK' },
            { id: 11, name: 'Ali Kurt', region: 'Girne', tag: 'VIP' }
        ],
        leads: [
            { id: 1, name: 'Ahmet Yılmaz', intent: 'SICAK', location: 'Bodrum' },
            { id: 4, name: 'Selin Yıldız', intent: 'SICAK', location: 'Bodrum' }
        ],
        properties: [
            { id: 1, title: 'Aqua Marine Luxury Villa', location: 'Bellapais', price: '450.000 GBP' },
            { id: 3, title: 'Elite Golf Side Penthouse', location: 'Esentepe', price: '275.000 GBP' }
        ]
    }), []);

    const results = useMemo(() => {
        if (!query) return null;
        const q = query.toLowerCase();

        return {
            clients: MOCK_DATA.clients.filter(c => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)),
            leads: MOCK_DATA.leads.filter(l => l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)),
            properties: MOCK_DATA.properties.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
        };
    }, [query, MOCK_DATA]);

    const handleNavigate = (type, id) => {
        onClose();
        if (type === 'client') {
            setSelectedClient(id);
            window.location.hash = '#client';
        } else if (type === 'lead') {
            setSelectedLead(id);
            window.location.hash = '#sales';
        } else if (type === 'property') {
            setSelectedProperty(id);
            window.location.hash = '#property';
        }
    };

    const hasResults = results && (results.clients.length > 0 || results.leads.length > 0 || results.properties.length > 0);

    return (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-none z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-6">
                {hasResults ? (
                    <>
                        {/* Clients Section */}
                        {results.clients.length > 0 && (
                            <div>
                                <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <User size={12} className="text-[#3BB2B8]" /> Müşteriler
                                </h4>
                                <div className="space-y-1">
                                    {results.clients.map(client => (
                                        <button
                                            key={client.id}
                                            onClick={() => handleNavigate('client', client.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                        >
                                            <div className="text-left">
                                                <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#3BB2B8] transition-colors">{client.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{client.region} • {client.tag}</div>
                                            </div>
                                            <ExternalLink size={14} className="text-slate-300 group-hover:text-[#3BB2B8] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Leads Section */}
                        {results.leads.length > 0 && (
                            <div>
                                <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Briefcase size={12} className="text-orange-500" /> Lead'ler (CRM)
                                </h4>
                                <div className="space-y-1">
                                    {results.leads.map(lead => (
                                        <button
                                            key={lead.id}
                                            onClick={() => handleNavigate('lead', lead.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                        >
                                            <div className="text-left">
                                                <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{lead.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{lead.location} • {lead.intent}</div>
                                            </div>
                                            <ExternalLink size={14} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Properties Section */}
                        {results.properties.length > 0 && (
                            <div>
                                <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Home size={12} className="text-blue-500" /> Portföy (İlanlar)
                                </h4>
                                <div className="space-y-1">
                                    {results.properties.map(prop => (
                                        <button
                                            key={prop.id}
                                            onClick={() => handleNavigate('property', prop.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                        >
                                            <div className="text-left">
                                                <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate max-w-[280px]">{prop.title}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{prop.location} • {prop.price}</div>
                                            </div>
                                            <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-slate-200 " />
                        </div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Eşleşen sonuç bulunamadı</div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Arama sonuçları dinamiktir</div>
                <button onClick={onClose} className="text-[9px] font-black text-[#3BB2B8] uppercase tracking-widest hover:underline">Zorla Kapat</button>
            </div>
        </div>
    );
};

export default GlobalSearchPanel;
