import React from 'react';
import { X, Layout, Type, Grid, MousePointer2, Image as ImageIcon, MessageSquare, HelpCircle } from 'lucide-react';
import { DEFAULT_BLOCKS } from './mockCmsData';

const BlockLibraryModal = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;

    const types = [
        { id: 'hero', label: 'HERO', desc: 'Giriş bölümü, video veya görsel.', Icon: Layout },
        { id: 'section', label: 'BÖLÜM', desc: 'Zengin metin ve başlık.', Icon: Type },
        { id: 'features', label: 'ÖZELLİKLER', desc: 'İkonlu özellik listeleri.', Icon: Grid },
        { id: 'cta', label: 'EYLEM', desc: 'Büyük buton ve mesaj.', Icon: MousePointer2 },
        { id: 'gallery', label: 'GALERİ', desc: 'Görsel ızgarası.', Icon: ImageIcon },
        { id: 'testimonials', label: 'YORUMLAR', desc: 'Müşteri geri bildirimleri.', Icon: MessageSquare },
        { id: 'faq', label: 'SSS', desc: 'Sıkça sorulan sorular.', Icon: HelpCircle }
    ];

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/40">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">BLOK KÜTÜPHANESİ</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SAYFAYA YENİ BİR BÖLÜM EKLEYİN</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-2 gap-4 flex-1 overflow-y-auto max-h-[60vh] scrollbar-hidden">
                    {types.map(type => (
                        <button
                            key={type.id}
                            onClick={() => { onSelectType(type.id); onClose(); }}
                            className="group text-left p-6 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-[#3BB2B8] hover:bg-white dark:hover:bg-slate-900 transition-all flex items-start gap-4 active:scale-[0.98]"
                        >
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 group-hover:text-[#3BB2B8] group-hover:bg-[#3BB2B8]/10 transition-colors shadow-sm">
                                <type.Icon size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{type.label}</div>
                                <div className="text-[10px] text-slate-500 font-medium leading-relaxed">{type.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ÖZEL BLOK GELİŞTİRME TALEBİ İÇİN SİSTEM YÖNETİCİSİ İLE İLETİŞİME GEÇİN</p>
                </div>
            </div>
        </div>
    );
};

export default BlockLibraryModal;
