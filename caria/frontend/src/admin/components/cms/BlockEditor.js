import React from 'react';
import {
    Zap, Video, Box, History, Copy, Trash2, Plus,
    ChevronUp, ChevronDown, ShieldCheck, RefreshCw
} from 'lucide-react';

const BlockEditor = ({ block, onUpdateBlock, onDuplicate, onDelete, isLocked }) => {
    if (!block) return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 border-r border-slate-100 dark:border-slate-800">
            <div className="flex-1 flex items-center justify-center p-12 text-center">
                <div className="space-y-6">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto shadow-sm opacity-60">
                        <Zap size={28} className="text-[#3BB2B8] animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-[#3BB2B8] uppercase tracking-[0.3em]">Hızlı Düzenleme</div>
                        <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">DÜZENLEMEK VE AYARLARI GÖRMEK İÇİN SOLDAKİ LİSTEDEN BİR BLOK SEÇİN</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleFieldChange = (key, value) => {
        onUpdateBlock({ ...block, fields: { ...block.fields, [key]: value } });
    };

    const renderField = (key, value) => {
        if (Array.isArray(value)) return null;

        const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
        const isMultiline = key.toLowerCase().includes('text') || key === 'content' || key === 'description';
        const isMedia = key.toLowerCase().includes('url') || key.toLowerCase().includes('poster') || key.toLowerCase().includes('bg');

        return (
            <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
                    {isMedia && value && <span className="text-[8px] font-black text-[#3BB2B8] bg-cyan-50 dark:bg-cyan-900/20 px-1.5 py-0.5 rounded">GÖRSEL ALGILANDI</span>}
                </div>

                <div className="relative group">
                    {isMultiline ? (
                        <textarea
                            value={value}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4 text-[11px] font-bold outline-none focus:border-[#3BB2B8] focus:ring-4 focus:ring-[#3BB2B8]/5 min-h-[100px] leading-relaxed transition-all resize-none shadow-sm"
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-[11px] font-bold outline-none focus:border-[#3BB2B8] focus:ring-4 focus:ring-[#3BB2B8]/5 transition-all shadow-sm"
                        />
                    )}
                </div>

                {isMedia && value && (
                    <div className="mt-2 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 h-24 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative group/media">
                        {value.includes('mp4') ? (
                            <div className="flex items-center gap-2 text-slate-400"><Video size={20} /> <span className="text-[9px] font-black uppercase">Video URL Aktif</span></div>
                        ) : (
                            <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform group-hover/media:scale-110" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                        )}
                        <div className="hidden absolute inset-0 items-center justify-center bg-red-50 dark:bg-red-900/10 text-red-300 text-[8px] font-black uppercase tracking-widest">Hatalı URL veya Yüklenemedi</div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950/80">
            {/* Inspector Header */}
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#3BB2B8] text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Box size={20} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{block.type.replace('_', ' ')}</h2>
                        <div className="text-[9px] font-bold text-[#3BB2B8] uppercase mt-0.5 tracking-widest">INSPECTOR V2</div>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <button className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 rounded-xl transition-all group">
                        <History size={16} className="text-slate-400 group-hover:text-[#3BB2B8]" />
                    </button>
                    {!isLocked && (
                        <>
                            <button
                                onClick={() => onDuplicate(block)}
                                className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 rounded-xl transition-all group"
                                title="Kopyala"
                            >
                                <Copy size={16} className="text-slate-400 group-hover:text-[#3BB2B8]" />
                            </button>
                            <button
                                onClick={() => onDelete(block.id)}
                                className="p-2.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 hover:bg-red-100 rounded-xl transition-all group"
                                title="Sil"
                            >
                                <Trash2 size={16} className="text-red-400" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 scrollbar-hidden">
                {/* Standard Fields */}
                <div className="space-y-8">
                    {Object.entries(block.fields).map(([key, value]) => renderField(key, value))}
                </div>

                {/* Nested Items Editors */}
                {['value_proposition', 'regions_showcase', 'partners_strip'].includes(block.type) && (
                    <div className="space-y-6 pt-10 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">LİSTE ÖĞELERİ</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ELEMANLARI DÜZENLE VEYA EKLE</p>
                            </div>
                            <button
                                onClick={() => {
                                    const itemsKey = block.type === 'value_proposition' ? 'items' : block.type === 'regions_showcase' ? 'regions' : 'logos';
                                    const currentItems = block.fields[itemsKey] || [];
                                    handleFieldChange(itemsKey, [...currentItems, { title: 'Yeni Öğe', text: '', name: 'Bölge', imageUrl: '' }]);
                                }}
                                className="px-3 py-1.5 bg-[#3BB2B8] text-white rounded-lg shadow-lg shadow-cyan-500/10 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest active:scale-95"
                            >
                                <Plus size={12} strokeWidth={3} /> EKLE
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(block.fields.items || block.fields.regions || block.fields.logos || []).map((item, idx) => {
                                const itemsKey = block.type === 'value_proposition' ? 'items' : block.type === 'regions_showcase' ? 'regions' : 'logos';
                                return (
                                    <div key={idx} className="p-5 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 group/item transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-[#3BB2B8]/20 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black text-[#3BB2B8] uppercase">#{idx + 1} ÖĞE</span>
                                                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronUp size={12} /></button>
                                                    <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronDown size={12} /></button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newItems = block.fields[itemsKey].filter((_, i) => i !== idx);
                                                    handleFieldChange(itemsKey, newItems);
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {item.title !== undefined && (
                                                <input
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-[#3BB2B8]"
                                                    value={item.title}
                                                    onChange={e => {
                                                        const newItems = [...block.fields[itemsKey]]; newItems[idx].title = e.target.value; handleFieldChange(itemsKey, newItems);
                                                    }}
                                                    placeholder="Başlık..."
                                                />
                                            )}
                                            {item.name !== undefined && (
                                                <input
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-[#3BB2B8]"
                                                    value={item.name}
                                                    onChange={e => {
                                                        const newItems = [...block.fields[itemsKey]]; newItems[idx].name = e.target.value; handleFieldChange(itemsKey, newItems);
                                                    }}
                                                    placeholder="İsim/Bölge..."
                                                />
                                            )}
                                            {item.text !== undefined && (
                                                <textarea
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-medium outline-none focus:border-[#3BB2B8] resize-none h-20"
                                                    value={item.text}
                                                    onChange={e => {
                                                        const newItems = [...block.fields[itemsKey]]; newItems[idx].text = e.target.value; handleFieldChange(itemsKey, newItems);
                                                    }}
                                                    placeholder="Açıklama metni..."
                                                />
                                            )}
                                            {item.imageUrl !== undefined && (
                                                <div className="space-y-2">
                                                    <input
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[9px] font-mono outline-none focus:border-[#3BB2B8]"
                                                        value={item.imageUrl}
                                                        onChange={e => {
                                                            const newItems = [...block.fields[itemsKey]]; newItems[idx].imageUrl = e.target.value; handleFieldChange(itemsKey, newItems);
                                                        }}
                                                        placeholder="Görsel URL..."
                                                    />
                                                    {item.imageUrl && (
                                                        <div className="h-20 rounded-xl overflow-hidden border border-slate-50 dark:border-slate-800">
                                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="pt-20 text-center space-y-2 opacity-30">
                    <ShieldCheck size={24} className="mx-auto text-slate-300" />
                    <div className="text-[8px] font-black uppercase tracking-[0.3em]">Caria Security Verified Block</div>
                </div>
            </div>

            <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
                <button
                    onClick={() => alert('Manuel kayıt başarılı!')}
                    className="w-full bg-[#3BB2B8] hover:bg-[#329ba1] text-white font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px]"
                >
                    <RefreshCw size={14} strokeWidth={3} /> SİSTEME SENKRONİZE ET
                </button>
            </div>
        </div>
    );
};

export default BlockEditor;
