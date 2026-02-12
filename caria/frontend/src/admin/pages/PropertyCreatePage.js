import React from 'react';
import PropertyForm from '../components/property/PropertyForm';

import { propertyService } from '../services/propertyService';
import { useAdminStore } from '../state/adminStore';

const PropertyCreatePage = () => {
    const { addNotification } = useAdminStore();

    const handleSave = async (data) => {
        try {
            // Transform form data to API format if needed (adapter logic handled in service or here)
            // For now, assume direct mapping or simple cleanup
            const payload = {
                ...data,
                // Ensure numeric types
                price: parseFloat(data.price) || 0,
                beds: parseInt(data.beds) || 0,
                baths: parseInt(data.baths) || 0,
                area: parseInt(data.sqm) || 0,
                // Map fields to backend expectations
                title: data.titleTr,
                title_en: data.titleEn,
                description: data.descriptionTr,
                description_en: data.descriptionEn,
                advisor_id: 1, // Default to first advisor for now or from session
                location: `${data.city}, ${data.region}`,
                // JSON fields
                ozellikler_ic: JSON.stringify(data.featuresInternal),
                ozellikler_dis: JSON.stringify(data.featuresExternal),
                ozellikler_konum: JSON.stringify(data.featuresView),
                internal_code: data.internalProjectCode, // Map internal code
                completion_date: data.completionDate,
                distance_center: data.distanceToCityCenterKm,
                distance_airport: data.distanceToAirportKm
            };

            await propertyService.updateProperty(null, payload); // null id for create

            addNotification({
                title: 'Başarılı',
                message: 'Yeni ilan başarıyla oluşturuldu.',
                type: 'success'
            });

            // Redirect back to list
            window.location.hash = 'property';
        } catch (error) {
            console.error(error);
            addNotification({
                title: 'Hata',
                message: 'İlan oluşturulurken bir sorun oluştu.',
                type: 'error'
            });
        }
    };

    return (
        <div className="flex flex-col w-full min-h-full bg-slate-50 dark:bg-slate-950">
            {/* Header Area */}
            <div className="px-8 pt-8 mb-8">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3BB2B8] opacity-[0.03] blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                            YENİ İLAN OLUŞTUR <span className="text-[#3BB2B8] opacity-50 underline decoration-2 underline-offset-8">V3</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                            Mülk Portföyüne Üst Segment Yeni İlan Girişi
                        </p>
                    </div>
                </div>
            </div>

            <PropertyForm mode="create" onSave={handleSave} />
        </div>
    );
};

export default PropertyCreatePage;
