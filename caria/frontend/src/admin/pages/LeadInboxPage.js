import React, { useEffect, useState, useMemo } from 'react';
import {
    Inbox, RefreshCw, UserPlus, Filter, Search,
    Facebook, Globe, Music, Target, AlertCircle,
    CheckCircle2, Share2, MoreHorizontal, Settings2, Sparkles
} from 'lucide-react';
import { useAdminStore } from '../state/adminStore';
import LeadAssignDropdown from '../components/lead/LeadAssignDropdown';
import SlaBadge from '../components/lead/SlaBadge';
import ReminderPicker from '../components/lead/ReminderPicker';

const LeadInboxPage = () => {
    const {
        leadsInbox, loadMockLeads, convertLeadToClient, addActivity,
        autoDistributeLeads, toggleAutoDistribution, advisors,
        assignLeadToAdvisor, setLeadReminder
    } = useAdminStore();

    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Initial Load
    useEffect(() => {
        if (leadsInbox.length === 0) {
            loadMockLeads();
        }
    }, [leadsInbox.length, loadMockLeads]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            loadMockLeads();
            setIsRefreshing(false);
        }, 800);
    };

    const filteredLeads = useMemo(() => {
        return leadsInbox.filter(l => {
            const matchesSearch =
                l.name.toLowerCase().includes(search.toLowerCase()) ||
                l.phone.includes(search) ||
                l.campaignName.toLowerCase().includes(search.toLowerCase());

            const matchesSource = sourceFilter === 'All' || l.leadSource === sourceFilter;

            return matchesSearch && matchesSource;
        });
    }, [leadsInbox, search, sourceFilter]);

    const stats = useMemo(() => {
        return {
            total: leadsInbox.length,
            new: leadsInbox.filter(l => l.status === 'new').length,
            converted: leadsInbox.filter(l => l.status === 'converted').length,
            duplicates: leadsInbox.filter(l => l.status === 'processed').length
        };
    }, [leadsInbox]);

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Page Header */}
            <div className="px-8 pt-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 bg-[#3BB2B8]/10 rounded-2xl flex items-center justify-center text-[#3BB2B8]">
                                <Inbox size={22} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                                ADS LEAD INBOX
                            </h1>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1">
                            Otomatik Sosyal Medya Lead Entegrasyonu
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Auto-assignment Toggle */}
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OTOMATİK DAĞITIM</span>
                                <span className={`text-[10px] font-black uppercase ${autoDistributeLeads ? 'text-green-500' : 'text-slate-400'}`}>
                                    {autoDistributeLeads ? 'AKTİF (ROUND-ROBIN)' : 'DEVRE DIŞI'}
                                </span>
                            </div>
                            <button
                                onClick={toggleAutoDistribution}
                                className={`w-12 h-6 rounded-full transition-all relative ${autoDistributeLeads ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoDistributeLeads ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <button
                            onClick={handleRefresh}
                            className={`flex items-center gap-2 bg-[#3BB2B8] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#329ba1] transition-all shadow-lg shadow-cyan-500/20 active:scale-95 ${isRefreshing ? 'animate-pulse' : ''}`}
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            Veriyi Tazele
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'TOPLAM LEAD', value: stats.total, color: 'text-slate-900' },
                        { label: 'İŞLENMEYEN', value: stats.new, color: 'text-[#3BB2B8]' },
                        { label: 'DÖNÜŞTÜRÜLEN', value: stats.converted, color: 'text-blue-500' },
                        { label: 'TEKRAR KAYIT', value: stats.duplicates, color: 'text-orange-500' },
                    ].map((s, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
                            <div className={`text-3xl font-black tracking-tighter ${s.color}`}>{s.value}</div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#3BB2B8]/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 min-w-[300px] focus-within:border-[#3BB2B8] transition-all">
                            <Search size={16} className="text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Lead ara (İsim, telefon, kampanya)..."
                                className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {['All', 'Meta Ads', 'Google Ads', 'TikTok'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSourceFilter(s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sourceFilter === s ? 'bg-[#3BB2B8] text-white border-[#3BB2B8]' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 text-slate-400'}`}
                                >
                                    {s === 'All' ? 'TÜMÜ' : s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="px-8 pb-8 flex-1 overflow-hidden">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead / Kişi</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kaynak / Kampanya</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Otomasyon & SLA</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                        <td className="p-6 min-w-[240px]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#3BB2B8]/10 group-hover:text-[#3BB2B8] transition-all">
                                                    {lead.leadSource === 'Meta Ads' ? <Facebook size={20} /> : lead.leadSource === 'Google Ads' ? <Globe size={20} /> : <Music size={20} />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{lead.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{lead.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 max-w-[280px]">
                                            <div className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase truncate mb-1">{lead.campaignName}</div>
                                            <div className="flex items-center gap-2">
                                                <Target size={12} className="text-[#3BB2B8]" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">{lead.region}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <LeadAssignDropdown
                                                        currentAssignee={lead.assignedTo}
                                                        advisors={advisors}
                                                        onAssign={(name) => assignLeadToAdvisor(lead.id, name)}
                                                    />
                                                    <SlaBadge createdAt={lead.createdAt} status={lead.status} intent={lead.intent} />
                                                </div>
                                                {lead.status === 'new' && (
                                                    <ReminderPicker
                                                        currentReminder={lead.reminderAt}
                                                        onSet={(date) => setLeadReminder(lead.id, date)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            {lead.status === 'new' ? (
                                                <button
                                                    onClick={() => convertLeadToClient(lead.id)}
                                                    className="inline-flex items-center gap-3 bg-slate-900 dark:bg-[#3BB2B8] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:scale-95"
                                                >
                                                    <Sparkles size={16} /> Aktar & Dönüştür
                                                </button>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    {lead.status === 'converted' ? (
                                                        <>
                                                            <CheckCircle2 size={14} className="text-green-500" />
                                                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">SATIŞA GEÇTİ</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle size={14} className="text-slate-400" />
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">İŞLENDİ</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLeads.length === 0 && (
                            <div className="py-24 text-center">
                                <Inbox size={48} className="mx-auto text-slate-200 mb-4" />
                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Henüz Eşleşen Lead Bulunmuyor</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadInboxPage;
