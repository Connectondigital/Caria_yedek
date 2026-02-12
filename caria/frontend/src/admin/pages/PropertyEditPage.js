import React, { useMemo } from 'react';
import PropertyForm from '../components/property/PropertyForm';
import { mockProperties } from '../components/property/mockProperties';

const PropertyEditPage = ({ id }) => {
    // Find property from mock data
    const propertyToEdit = useMemo(() => {
        return mockProperties.find(p => p.id === parseInt(id));
    }, [id]);

    const handleSave = (data) => {
        console.log('Updating Property:', data);
        // Persist logic would go here
        window.location.hash = 'property';
    };

    if (!propertyToEdit) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">İLAN BULUNAMADI</h2>
                    <button onClick={() => window.location.hash = 'property'} className="text-[#3BB2B8] text-xs font-black uppercase tracking-widest underline underline-offset-4">Listeye Geri Dön</button>
                </div>
            </div>
        );
    }

    // Adapt mock data to form structure (in a real app, the structures would match)
    const adaptedData = {
        ...propertyToEdit,
        titleTr: propertyToEdit.title,
        titleEn: propertyToEdit.title, // Mocking EN same as TR
        price: propertyToEdit.price,
        currency: propertyToEdit.currency || 'GBP',
        sqm: propertyToEdit.sqm,
        beds: propertyToEdit.beds,
        baths: propertyToEdit.baths,
        internalProjectCode: propertyToEdit.internalProjectCode || `PROJ-${propertyToEdit.id}`,
        gallery: propertyToEdit.galleryImages || []
    };

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950">
            {/* Header Area */}
            <div className="px-8 pt-8 mb-8">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BB2B8] opacity-[0.03] blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                İLAN DÜZENLEME <span className="text-[#3BB2B8] opacity-50 underline decoration-2 underline-offset-8">#{id}</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                                {propertyToEdit.title} • Mevcut Veriler Yüklendi
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DÜZENLEME AKTİF</span>
                        </div>
                    </div>
                </div>
            </div>

            <PropertyForm initialData={adaptedData} mode="edit" onSave={handleSave} />
        </div>
    );
};

export default PropertyEditPage;
