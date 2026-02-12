import React from 'react';
import { Layout, Type, Grid, MousePointer2, Box, Image, MessageSquare, HelpCircle, X } from 'lucide-react';

const BLOCK_CATEGORIES = [
    {
        id: 'hero',
        label: 'HERO & BAŞLIK',
        icon: Layout,
        types: [
            { id: 'hero_video', label: 'Video Hero', description: 'Arkaplan videolu ana karşılama' },
            { id: 'page_header', label: 'Sayfa Başlığı', description: 'İç sayfalar için standart header' }
        ]
    },
    {
        id: 'content',
        label: 'İÇERİK & LİSTE',
        icon: Grid,
        types: [
            { id: 'featured_properties', label: 'Öne Çıkanlar', description: 'Seçili ilanların listesi' },
            { id: 'value_proposition', label: 'Değer Önerileri', description: 'Neden biz? ikonlu liste' },
            { id: 'regions_showcase', label: 'Bölgeler', description: 'Görsel bölge kartları' }
        ]
    },
    {
        id: 'conversion',
        label: 'DÖNÜŞÜM',
        icon: MousePointer2,
        types: [
            { id: 'cta_banner', label: 'CTA Banner', description: 'Görsel arkaplanlı buton alanı' },
            { id: 'partners_strip', label: 'Partner Logoları', description: 'Scrolling logo şeridi' }
        ]
    },
    {
        id: 'other',
        label: 'DİĞER',
        icon: Box,
        types: [
            { id: 'faq_section', label: 'S.S.S.', description: 'Soru ve cevap akordeon' },
            { id: 'contact_form', label: 'İletişim Formu', description: 'Lead toplama alanı' }
        ]
    }
];

const BlockAddMenu = ({ onSelect, onClose }) => {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Box size={18} className="text-[#3BB2B8]" />
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">BLOK EKLE</h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hidden">
                {BLOCK_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <cat.icon size={12} className="text-[#3BB2B8] opacity-50" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat.label}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {cat.types.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => onSelect(type.id)}
                                    className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-[#3BB2B8]/20 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#3BB2B8] group-hover:text-white transition-all shadow-inner">
                                        <Box size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{type.label}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-70 truncate">{type.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockAddMenu;
