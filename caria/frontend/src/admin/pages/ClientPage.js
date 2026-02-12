import React, { useState, useMemo, useEffect } from 'react';
import ClientKPIStrip from '../components/client/ClientKPIStrip';
import ClientActionsBar from '../components/client/ClientActionsBar';
import ClientTable from '../components/client/ClientTable';
import ClientDrawer from '../components/client/ClientDrawer';
import { Users, Activity } from 'lucide-react';
import { useAdminStore } from '../state/adminStore';

const MOCK_CLIENTS = [
  { id: 1, name: 'Ahmet Yılmaz', budget: 4500000, currency: 'TL', region: 'Bodrum', stage: 'New', tag: 'VIP', consultant: 'Buse A.', lastActivity: '2 saat önce' },
  { id: 2, name: 'Mehmet Demir', budget: 250000, currency: 'GBP', region: 'Fethiye', stage: 'Interested', tag: 'SICAK', consultant: 'Can K.', lastActivity: '1 gün önce' },
  { id: 3, name: 'Zeynep Kaya', budget: 12000000, currency: 'TL', region: 'Kaş', stage: 'First Contact', tag: 'GECİKMİŞ', consultant: 'Buse A.', lastActivity: '5 gün önce' },
  { id: 4, name: 'Selin Yıldız', budget: 180000, currency: 'GBP', region: 'Bodrum', stage: 'Negotiation', tag: 'SICAK', consultant: 'Ece T.', lastActivity: 'Bugün' },
  { id: 5, name: 'Murat Arslan', budget: 3200000, currency: 'TL', region: 'Marmaris', stage: 'New', tag: 'VIP', consultant: 'Can K.', lastActivity: '3 gün önce' },
  { id: 6, name: 'Elif Şahin', budget: 5500000, currency: 'TL', region: 'Dalaman', stage: 'Interested', tag: 'SICAK', consultant: 'Buse A.', lastActivity: '4 saat önce' },
  { id: 7, name: 'Oğuz Kağan', budget: 400000, currency: 'GBP', region: 'Kaş', stage: 'Closed', tag: 'VIP', consultant: 'Ece T.', lastActivity: '12 saat önce' },
  { id: 8, name: 'Ayşe Gül', budget: 2100000, currency: 'TL', region: 'Fethiye', stage: 'Lost', tag: 'SICAK', consultant: 'Can K.', lastActivity: '1 hafta önce' },
  { id: 9, name: 'Burak Deniz', budget: 6700000, currency: 'TL', region: 'Bodrum', stage: 'First Contact', tag: 'GECİKMİŞ', consultant: 'Buse A.', lastActivity: '3 gün önce' },
  { id: 10, name: 'Fatma Nur', budget: 150000, currency: 'GBP', region: 'Marmaris', stage: 'Negotiation', tag: 'SICAK', consultant: 'Ece T.', lastActivity: '2 saat önce' },
  { id: 11, name: 'Ali Kurt', budget: 8500000, currency: 'TL', region: 'Girne', stage: 'New', tag: 'VIP', consultant: 'Can K.', lastActivity: '5 saat önce' },
  { id: 12, name: 'Merve Can', budget: 220000, currency: 'GBP', region: 'Lefkoşa', stage: 'Interested', tag: 'SICAK', consultant: 'Ece T.', lastActivity: 'Dün' }
];

const ClientPage = () => {
  const { selectedClientId, setSelectedClient, addActivity } = useAdminStore();
  const [clients] = useState(MOCK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [selectedClient, setSelectedClientLocal] = useState(null);

  // Sync Global Selection to Local State
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        setSelectedClientLocal(client);
      }
    }
  }, [selectedClientId, clients]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.consultant.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = activeTag === 'All' || client.tag === activeTag;

      return matchesSearch && matchesTag;
    });
  }, [clients, searchTerm, activeTag]);

  const handleSelectClient = (client) => {
    setSelectedClient(client.id);
    setSelectedClientLocal(client);

    addActivity({
      type: 'client',
      title: 'Müşteri İnceleme',
      description: `${client.name} dosyası açıldı.`,
      entity: 'Client OS'
    });
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-slate-50/50 dark:bg-slate-950 font-sans transition-all duration-300">
      {/* Header Area */}
      <div className="px-8 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-[#3BB2B8]/10 rounded-xl flex items-center justify-center text-[#3BB2B8]">
                <Activity size={18} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Client OS
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1">
              Connect CRM • Müşteri Yönetimi ve Takibi
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            Agent Sync: Active
          </div>
        </div>

        {/* KPI Strip */}
        <ClientKPIStrip clients={filteredClients} />

        {/* Actions Bar */}
        <ClientActionsBar
          onSearch={setSearchTerm}
          onFilterTag={setActiveTag}
          activeTag={activeTag}
          onNewClient={() => alert('Yeni Müşteri Ekranı Yakında!')}
        />
      </div>

      {/* Main Table Content */}
      <div className="flex-1 px-8 pb-8 overflow-hidden">
        <ClientTable
          clients={filteredClients}
          selectedId={selectedClient?.id}
          onSelect={handleSelectClient}
        />
      </div>

      {/* Side Drawer */}
      <ClientDrawer
        client={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => {
          setSelectedClientLocal(null);
          setSelectedClient(null);
        }}
      />
    </div>
  );
};

export default ClientPage;
