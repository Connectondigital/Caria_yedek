import React, { useState, useMemo, useCallback, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import LeadDrawer from '../components/LeadDrawer';
import { Plus, Search, ChevronDown, Filter, Users, TrendingUp, Handshake, Wallet, Activity } from 'lucide-react';
import { useAdminStore } from '../state/adminStore';

const SalesPage = () => {
  const {
    selectedLeadId, setSelectedLead, addActivity, addNotification,
    salesLeads, updateSalesLeadStatus
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedLead, setSelectedLeadLocal] = useState(null);

  // Use salesLeads as the source of truth
  const leads = salesLeads;

  // Sync Global Selection to Local State
  useEffect(() => {
    if (selectedLeadId && leads) {
      const lead = leads.find(l => l.id?.toString() === selectedLeadId.toString());
      if (lead) {
        setSelectedLeadLocal(lead);
      }
    }
  }, [selectedLeadId, leads]);

  // Initial Check for Delayed Leads
  useEffect(() => {
    leads.forEach(l => {
      if (l.intent === 'GECİKMİŞ') {
        addNotification({
          title: 'Gecikmiş Lead Uyarısı',
          message: `${l.name} ile temas kurulalı çok oldu. Aksiyon bekliyor.`,
          type: 'alert'
        });
      }
    });
  }, []); // Run once on mount

  // Stats calculation
  const stats = useMemo(() => {
    const active = leads.filter(l => l.status !== 'closed' && l.status !== 'lost');
    const closed = leads.filter(l => l.status === 'closed');
    const totalPotential = active.reduce((sum, l) => sum + (l.currency === 'GBP' ? l.budget * 40 : l.budget), 0);

    return {
      total: leads.length,
      active: active.length,
      closed: closed.length,
      potential: totalPotential
    };
  }, [leads]);

  // Filtering logic
  const filteredLeads = useMemo(() => {
    let result = leads;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(lower) ||
        l.location.toLowerCase().includes(lower) ||
        l.consultant.toLowerCase().includes(lower)
      );
    }

    if (activeFilters.length > 0) {
      result = result.filter(l => activeFilters.includes(l.intent));
    }

    return result;
  }, [leads, searchTerm, activeFilters]);

  const toggleFilter = (tag) => {
    setActiveFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const leadToMove = leads.find(l => l.id.toString() === draggableId);
    if (!leadToMove) return;

    updateSalesLeadStatus(draggableId, destination.droppableId);

    // Activity Log
    addActivity({
      type: 'lead',
      title: 'Lead Aşaması Değişti',
      description: `${leadToMove.name} isimli lead '${destination.droppableId}' aşamasına taşındı.`,
      entity: 'Sales CRM'
    });

    // Notify if moved to negotiation
    if (destination.droppableId === 'negotiation') {
      addNotification({
        title: 'Pazarlık Başladı',
        message: `${movedLead.name} için pazarlık süreci aktif edildi.`,
        type: 'info'
      });
    }
  }, [leads, addActivity, addNotification]);

  const handleLeadClick = (lead) => {
    setSelectedLead(lead.id); // Global Store
    setSelectedLeadLocal(lead); // Local State for Drawer

    addActivity({
      type: 'lead',
      title: 'Lead İnceleme',
      description: `${lead.name} profili görüntülendi.`,
      entity: 'Sales CRM'
    });
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-slate-50/50 dark:bg-slate-950 font-sans">
      <div className="px-8 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-[#3BB2B8]/10 rounded-xl flex items-center justify-center text-[#3BB2B8]">
                <Activity size={18} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Sales Pipeline
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">
              Connect CRM • Satış hunisi ve fırsat yönetimi
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#3BB2B8] hover:bg-[#329ba1] text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-xl shadow-cyan-500/20 active:scale-95 uppercase tracking-widest">
            <Plus size={18} strokeWidth={3} />
            Yeni Fırsat
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam Lead</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={16} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktif Fırsat</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.active}</div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Handshake size={16} className="text-[#3BB2B8]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapanan</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.closed}</div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Wallet size={16} className="text-green-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potansiyel (TL)</span>
            </div>
            <div className="text-2xl font-black text-[#3BB2B8] tracking-tight">₺{stats.potential.toLocaleString('tr-TR')}</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 min-w-[360px] shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="İsim, bölge veya danışman ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              {['SICAK', 'VIP', 'GECİKMİŞ'].map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`
                    px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border
                    ${activeFilters.includes(tag)
                      ? 'bg-[#3BB2B8] text-white border-[#3BB2B8] shadow-lg shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#3BB2B8]'}
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-8">
        <KanbanBoard
          leads={filteredLeads}
          onDragEnd={handleDragEnd}
          onLeadClick={handleLeadClick}
        />
      </div>

      <LeadDrawer
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
};

export default SalesPage;
