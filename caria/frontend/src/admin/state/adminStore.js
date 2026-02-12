import { useState, useEffect, useCallback } from 'react';
import { getMockAdsLeads } from '../services/adsMock';

// Simple Event Emitter for outside-of-react updates if needed
const listeners = new Set();
const broadcast = () => listeners.forEach(listener => listener());

// Persistent Session Helper (Simulated)
const getSavedSession = () => {
    const saved = localStorage.getItem('caria_admin_session');
    return saved ? JSON.parse(saved) : null;
};

const saveSession = (session) => {
    if (session) localStorage.setItem('caria_admin_session', JSON.stringify(session));
    else localStorage.removeItem('caria_admin_session');
};

let state = {
    session: getSavedSession(),
    users: [
        { id: 'u1', name: 'Baran Gökmen', email: 'baran@caria.com', role: 'admin', regions: ['Bodrum', 'Fethiye'], isActive: true, googleLinked: true },
        { id: 'u2', name: 'Ece Temel', email: 'ece@caria.com', role: 'manager', regions: ['Fethiye', 'Kaş'], isActive: true, googleLinked: false },
        { id: 'u3', name: 'Buse Aydın', email: 'buse@caria.com', role: 'advisor', regions: ['Bodrum'], isActive: true, googleLinked: true },
        { id: 'u4', name: 'Can Korkmaz', email: 'can@caria.com', role: 'advisor', regions: ['Marmaris'], isActive: true, googleLinked: false },
        { id: 'u5', name: 'Mehmet Demir', email: 'mehmet@caria.com', role: 'advisor', regions: ['Kaş'], isActive: true, googleLinked: false },
        { id: 'u6', name: 'Selin Yıldız', email: 'selin@caria.com', role: 'advisor', regions: ['Dalaman'], isActive: false, googleLinked: false },
        { id: 'u7', name: 'Oğuz Kağan', email: 'oguz@caria.com', role: 'advisor', regions: ['Girne'], isActive: true, googleLinked: false },
        { id: 'u8', name: 'Murat Arslan', email: 'murat@caria.com', role: 'investor', regions: ['All'], isActive: true, googleLinked: false }
    ],
    clients: [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@gmail.com', phone: '05321112233', budget: 4500000, currency: 'TL', region: 'Bodrum', stage: 'New', tag: 'VIP', consultant: 'Buse Aydın', lastActivity: '2 saat önce' },
        { id: 2, name: 'Mehmet Demir', email: 'mehmet.d@outlook.com', phone: '05334445566', budget: 250000, currency: 'GBP', region: 'Fethiye', stage: 'Interested', tag: 'SICAK', consultant: 'Can Korkmaz', lastActivity: '1 gün önce' },
    ],
    leadsInbox: [],
    salesLeads: [
        { id: 's1', name: 'Ahmet Yılmaz', budget: 4500000, currency: 'TL', location: 'Bodrum, Muğla', intent: 'SICAK', lastActivity: '2 gün önce', status: 'new', consultant: 'Buse Aydın' },
        { id: 's2', name: 'Mehmet Demir', budget: 250000, currency: 'GBP', location: 'Fethiye, Muğla', intent: 'VIP', lastActivity: '1 gün önce', status: 'interested', consultant: 'Can Korkmaz' },
        { id: 's3', name: 'Zeynep Kaya', budget: 12000000, currency: 'TL', location: 'Kaş, Antalya', intent: 'GECİKMİŞ', lastActivity: '5 gün önce', status: 'first_contact', consultant: 'Buse Aydın' },
        { id: 's4', name: 'Selin Yıldız', budget: 180000, currency: 'GBP', location: 'Bodrum, Muğla', intent: 'SICAK', lastActivity: 'Bugün', status: 'negotiation', consultant: 'Ece Temel' },
        { id: 's5', name: 'Murat Arslan', budget: 3200000, currency: 'TL', location: 'Marmaris, Muğla', intent: 'VIP', lastActivity: '3 gün önce', status: 'new', consultant: 'Can Korkmaz' }
    ],
    advisors: ['Buse Aydın', 'Can Korkmaz', 'Ece Temel'],
    autoDistributeLeads: false,
    lastAssignedAdvisorIndex: -1,
    selectedClientId: null,
    selectedLeadId: null,
    selectedPropertyId: null,
    notifications: [
        { id: 1, title: 'Sistem Hoşgeldiniz', message: 'Admin paneli başarıyla yüklendi.', time: '5 dk önce', type: 'info', read: false },
        { id: 2, title: 'İnternet Bağlantısı', message: 'Canlı veritabanına bağlandınız.', time: '10 dk önce', type: 'info', read: true }
    ],
    activities: [
        { id: 1, type: 'info', title: 'Sistem Girişi', description: 'Admin paneli oturumu açıldı.', time: '1 saat önce', entity: 'Sistem' }
    ]
};

// Mock SLA Monitoring (Automatic Trigger)
const slaInterval = setInterval(() => {
    const now = new Date();
    let updated = false;

    state.leadsInbox = state.leadsInbox.map(lead => {
        if (lead.status === 'new' && lead.createdAt && !lead.slaTriggered) {
            const created = new Date(lead.createdAt);
            const diffHours = (now - created) / (1000 * 60 * 60);

            if (diffHours >= 2) {
                updated = true;
                adminStore.addNotification({
                    id: `sla_${lead.id}`,
                    title: 'SLA GECİKMESİ',
                    message: `${lead.name} için ilk temas süresi (2s) aşıldı!`,
                    type: 'alert'
                });
                adminStore.addActivity({
                    type: 'alert',
                    title: 'SLA İhlali',
                    description: `${lead.name} lead'i gecikmiş statüsüne düştü.`,
                    entity: 'Lead OS'
                });
                return { ...lead, intent: 'GECİKMİŞ', slaTriggered: true };
            }
        }
        return lead;
    });

    // Check Reminders
    state.leadsInbox.forEach(lead => {
        if (lead.reminderAt && !lead.reminderTriggered) {
            const reminder = new Date(lead.reminderAt);
            if (now >= reminder) {
                updated = true;
                adminStore.addNotification({
                    id: `rem_${lead.id}`,
                    title: 'TAKİP HATIRLATICI',
                    message: `${lead.name} için bekleyen takip görevi zamanı geldi.`,
                    type: 'info'
                });
                lead.reminderTriggered = true;
            }
        }
    });

    if (updated) broadcast();
}, 10000); // Check every 10s for simulation

export const adminStore = {
    get: () => state,

    // Auth Actions
    loginAs: (userId) => {
        const user = state.users.find(u => u.id === userId);
        if (user) {
            state.session = {
                isAuthed: true,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                role: user.role,
                tenantKey: 'caria',
                googleLinked: user.googleLinked
            };
            saveSession(state.session);
            broadcast();
        }
    },

    logout: () => {
        state.session = null;
        saveSession(null);
        broadcast();
    },

    // User Management
    createUser: (payload) => {
        const newUser = {
            id: 'u' + (state.users.length + 1),
            isActive: true,
            googleLinked: false,
            regions: [],
            ...payload
        };
        state.users = [...state.users, newUser];
        broadcast();
    },

    updateUser: (userId, patch) => {
        state.users = state.users.map(u => u.id === userId ? { ...u, ...patch } : u);
        if (state.session?.userId === userId) {
            state.session = { ...state.session, ...patch };
            saveSession(state.session);
        }
        broadcast();
    },

    // Client Management
    createClient: (payload) => {
        const newClient = {
            id: Date.now(),
            stage: 'New',
            lastActivity: 'Yeni oluşturuldu',
            ...payload
        };
        state.clients = [newClient, ...state.clients];
        broadcast();
    },

    updateClient: (id, patch) => {
        state.clients = state.clients.map(c => c.id === parseInt(id) ? { ...c, ...patch } : c);
        broadcast();
    },

    // Leads & Automation logic
    setLeadsInbox: (leads) => {
        state.leadsInbox = leads;
        broadcast();
    },

    toggleAutoDistribution: () => {
        state.autoDistributeLeads = !state.autoDistributeLeads;
        broadcast();
    },

    assignLeadToAdvisor: (leadId, advisorName) => {
        state.leadsInbox = state.leadsInbox.map(l =>
            l.id === leadId ? { ...l, assignedTo: advisorName } : l
        );
        broadcast();
    },

    setLeadReminder: (leadId, reminderAt) => {
        state.leadsInbox = state.leadsInbox.map(l =>
            l.id === leadId ? { ...l, reminderAt: reminderAt, reminderTriggered: false } : l
        );
        broadcast();
    },

    loadMockLeads: () => {
        let leads = getMockAdsLeads();

        // Auto Distribution logic (Round-Robin)
        if (state.autoDistributeLeads) {
            leads = leads.map(l => {
                state.lastAssignedAdvisorIndex = (state.lastAssignedAdvisorIndex + 1) % state.advisors.length;
                return { ...l, assignedTo: state.advisors[state.lastAssignedAdvisorIndex] };
            });
        }

        state.leadsInbox = leads;
        adminStore.addActivity({
            type: 'info',
            title: 'MOCK LEADS LOADED',
            description: `${leads.length} adet reklam lead'i yüklendi.${state.autoDistributeLeads ? ' Otomatik dağıtıldı.' : ''}`,
            entity: 'Sistem'
        });
        broadcast();
    },

    convertLeadToClient: (leadId) => {
        const lead = state.leadsInbox.find(l => l.id === leadId);
        if (!lead) return;

        // Deduplication Logic
        const existing = state.clients.find(c =>
            c.phone === lead.phone ||
            c.email === lead.email ||
            c.externalLeadId === lead.externalLeadId
        );

        if (existing) {
            adminStore.addActivity({
                type: 'client',
                title: 'TEKRAR LEAD (Ads)',
                description: `${lead.name} tekrar lead bıraktı. Mevcut kayıt güncellendi.`,
                entity: 'Lead Inbox'
            });

            adminStore.addNotification({
                title: 'Tekrar Kayıt Engellendi',
                message: `${lead.name} zaten sistemde kayıtlı.`,
                type: 'info'
            });

            state.leadsInbox = state.leadsInbox.map(l => l.id === leadId ? { ...l, status: 'processed', result: 'duplicate' } : l);
        } else {
            const newClient = {
                id: Date.now(),
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                region: lead.region || '',
                propertyType: lead.propertyType || '',
                budget: lead.budget || 0,
                currency: lead.currency || 'GBP',
                tag: lead.intent || 'SICAK',
                stage: 'New',
                consultant: lead.assignedTo || 'Atanmamış',
                leadSource: lead.leadSource,
                lastActivity: 'Ads üzerinden geldi'
            };

            state.clients = [newClient, ...state.clients];

            // SALES SYNC: Add to Sales Kanban
            const salesLead = {
                ...newClient,
                location: lead.region,
                intent: lead.intent || 'SICAK',
                status: 'new', // Kanban column: 'new'
                consultant: lead.assignedTo || 'Atanmamış'
            };
            state.salesLeads = [salesLead, ...state.salesLeads];

            state.leadsInbox = state.leadsInbox.map(l => l.id === leadId ? { ...l, status: 'converted' } : l);

            adminStore.addActivity({
                type: 'lead',
                title: 'Sales Sync: Yeni Aday',
                description: `${lead.name} kanalize edildi ve Sales Kanban/Yeni Müşteriler'e eklendi.`,
                entity: 'Lead Inbox'
            });

            adminStore.addNotification({
                title: 'Satış Hunisine Eklendi',
                message: `${lead.name} artık Sales Pipeline içinde takipte.`,
                type: 'success'
            });
        }
        broadcast();
    },

    updateSalesLeadStatus: (leadId, newStatus) => {
        state.salesLeads = state.salesLeads.map(l =>
            l.id.toString() === leadId.toString() ? { ...l, status: newStatus } : l
        );
        broadcast();
    },

    deactivateUser: (userId) => {
        state.users = state.users.map(u => u.id === userId ? { ...u, isActive: false } : u);
        broadcast();
    },

    linkGoogle: (userId) => {
        state.users = state.users.map(u => u.id === userId ? { ...u, googleLinked: true } : u);
        if (state.session?.userId === userId) {
            state.session = { ...state.session, googleLinked: true };
            saveSession(state.session);
        }
        adminStore.addActivity({
            type: 'integration',
            title: 'Google Bağlantısı',
            description: 'Google hesabı başarıyla bağlandı (Simülasyon).',
            entity: 'Sistem'
        });
        broadcast();
    },

    unlinkGoogle: (userId) => {
        state.users = state.users.map(u => u.id === userId ? { ...u, googleLinked: false } : u);
        if (state.session?.userId === userId) {
            state.session = { ...state.session, googleLinked: false };
            saveSession(state.session);
        }
        broadcast();
    },

    setSelectedClient: (id) => {
        state.selectedClientId = id;
        broadcast();
    },

    setSelectedLead: (id) => {
        state.selectedLeadId = id;
        broadcast();
    },

    setSelectedProperty: (id) => {
        state.selectedPropertyId = id;
        broadcast();
    },

    addNotification: (notif) => {
        const newNotif = { id: Date.now(), read: false, time: 'Az önce', ...notif };
        state.notifications = [newNotif, ...state.notifications];
        broadcast();
    },

    markAllRead: () => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        broadcast();
    },

    addActivity: (act) => {
        const newAct = { id: Date.now(), time: 'Az önce', ...act };
        state.activities = [newAct, ...state.activities];
        broadcast();
    },

    subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
};

// Hook for React components
export const useAdminStore = () => {
    const [storeState, setStoreState] = useState(state);

    useEffect(() => {
        const updateState = () => setStoreState({ ...state });
        return adminStore.subscribe(updateState);
    }, []);

    return {
        ...storeState,
        loginAs: adminStore.loginAs,
        logout: adminStore.logout,
        createUser: adminStore.createUser,
        updateUser: adminStore.updateUser,
        deactivateUser: adminStore.deactivateUser,
        linkGoogle: adminStore.linkGoogle,
        unlinkGoogle: adminStore.unlinkGoogle,
        setSelectedClient: adminStore.setSelectedClient,
        setSelectedLead: adminStore.setSelectedLead,
        setSelectedProperty: adminStore.setSelectedProperty,
        createClient: adminStore.createClient,
        updateClient: adminStore.updateClient,
        setLeadsInbox: adminStore.setLeadsInbox,
        loadMockLeads: adminStore.loadMockLeads,
        convertLeadToClient: adminStore.convertLeadToClient,
        toggleAutoDistribution: adminStore.toggleAutoDistribution,
        assignLeadToAdvisor: adminStore.assignLeadToAdvisor,
        setLeadReminder: adminStore.setLeadReminder,
        updateSalesLeadStatus: adminStore.updateSalesLeadStatus,
        addNotification: adminStore.addNotification,
        markAllRead: adminStore.markAllRead,
        addActivity: adminStore.addActivity
    };
};
