import React, { useMemo } from 'react';
import ClientForm from '../components/client/ClientForm';
import { useAdminStore } from '../state/adminStore';

const ClientEditPage = ({ id }) => {
    const { clients, updateClient } = useAdminStore();

    const clientToEdit = useMemo(() => {
        return clients.find(c => c.id === parseInt(id));
    }, [id, clients]);

    const handleSave = (data) => {
        updateClient(id, data);
        window.location.hash = 'client';
    };

    if (!clientToEdit) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">MÜŞTERİ BULUNAMADI</h2>
                    <button onClick={() => window.location.hash = 'client'} className="text-[#3BB2B8] text-xs font-black uppercase tracking-widest underline underline-offset-4">Listeye Geri Dön</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950">
            {/* Header Area */}
            <div className="px-8 pt-8 mb-4">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BB2B8] opacity-[0.03] blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                MÜŞTERİ DÜZENLEME <span className="text-[#3BB2B8] opacity-50 underline decoration-2 underline-offset-8">#{id}</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                                {clientToEdit.name} • {clientToEdit.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DÜZENLEME AKTİF</span>
                        </div>
                    </div>
                </div>
            </div>

            <ClientForm initialData={clientToEdit} mode="edit" onSave={handleSave} />
        </div>
    );
};

export default ClientEditPage;
