import React, { useState, useMemo, useEffect } from 'react';
import PropertyKpis from './PropertyKpis';
import PropertyFilters from './PropertyFilters';
import PropertyTable from './PropertyTable';
import PropertyPreview from './PropertyPreview';
import PropertyMap from './PropertyMap';
import { propertyService } from '../../services/propertyService';
import { useAdminStore } from '../../state/adminStore';

const PropertyShell = () => {
    const { selectedPropertyId, setSelectedProperty, addActivity, addNotification } = useAdminStore();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedPropertyLocal] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        region: 'All',
        status: 'All',
        featuredOnly: false
    });

    // Fetch initial data
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                const data = await propertyService.getProperties();
                setProperties(data);
                if (data.length > 0) {
                    setSelectedPropertyLocal(data[0]);
                }
            } catch (error) {
                addNotification({
                    title: 'Hata',
                    message: 'Mülk verileri yüklenirken bir hata oluştu.',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };
        loadProperties();
    }, [addNotification]);

    // Sync Global Selection to Local State
    useEffect(() => {
        if (selectedPropertyId) {
            const prop = properties.find(p => p.id === selectedPropertyId);
            if (prop) {
                setSelectedPropertyLocal(prop);
            }
        }
    }, [selectedPropertyId, properties]);

    // Toggle featured status
    const toggleFeatured = async (id) => {
        const prop = properties.find(p => p.id === id);
        if (!prop) return;

        const newFeatured = !prop.featured;

        try {
            // Optimistic update
            setProperties(prev => prev.map(p =>
                p.id === id ? { ...p, featured: newFeatured } : p
            ));
            if (selectedProperty?.id === id) {
                setSelectedPropertyLocal(prev => ({ ...prev, featured: newFeatured }));
            }

            // API Call
            await propertyService.updateProperty(id, { is_featured: newFeatured });

            addActivity({
                type: 'property',
                title: newFeatured ? 'İlan Öne Çıkarıldı' : 'İlan Geri Çekildi',
                description: `${prop.title} isimli ilan vitrin durumuna alındı.`,
                entity: 'Portföy'
            });

            addNotification({
                title: newFeatured ? 'Vitrin Eklendi' : 'Vitrinden Kaldırıldı',
                message: `${prop.title} güncellendi.`,
                type: 'info'
            });

        } catch (error) {
            // Revert on error
            setProperties(prev => prev.map(p =>
                p.id === id ? { ...p, featured: !newFeatured } : p
            ));
            addNotification({
                title: 'Hata',
                message: 'Güncelleme yapılamadı.',
                type: 'error'
            });
        }
    };

    // Filter logic
    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const matchesSearch =
                p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.location.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.agentName.toLowerCase().includes(filters.search.toLowerCase());

            const matchesRegion = filters.region === 'All' || p.region === filters.region;
            const matchesStatus = filters.status === 'All' || p.status === filters.status;
            const matchesFeatured = !filters.featuredOnly || p.featured;

            return matchesSearch && matchesRegion && matchesStatus && matchesFeatured;
        });
    }, [properties, filters]);

    // Handle row selection
    const handleSelect = (property) => {
        setSelectedProperty(property.id);
        setSelectedPropertyLocal(property);

        addActivity({
            type: 'property',
            title: 'İlan İnceleme',
            description: `${property.title} detayları görüntülendi.`,
            entity: 'Portföy'
        });
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-caria-turquoise border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Property OS Yükleniyor...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* KPI Section */}
            <PropertyKpis properties={filteredProperties} />

            {/* Filter Bar */}
            <PropertyFilters
                filters={filters}
                setFilters={setFilters}
                onAddNew={() => window.location.hash = 'property-create'}
            />

            {/* Main Content: Hybrid Layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative">
                {/* Left: Table Area */}
                <div className={`${selectedProperty ? 'hidden lg:flex lg:flex-1' : 'flex-1'} flex flex-col min-w-0 overflow-hidden transition-all duration-300`}>
                    <PropertyTable
                        properties={filteredProperties}
                        selectedId={selectedProperty?.id}
                        onSelect={handleSelect}
                        onToggleFeatured={toggleFeatured}
                    />
                </div>

                {/* Right: Map Area */}
                <div className={`${selectedProperty ? 'hidden lg:flex lg:flex-1' : 'flex-1'} min-w-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 relative`}>
                    <PropertyMap
                        properties={filteredProperties}
                        selectedId={selectedProperty?.id}
                        onSelect={handleSelect}
                    />
                </div>

                {/* Preview Drawer (Overlay) */}
                {selectedProperty && (
                    <div className="absolute inset-y-0 right-0 w-full lg:w-[480px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 z-20">
                        <PropertyPreview
                            property={selectedProperty}
                            onClose={() => setSelectedProperty(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyShell;
