import React from 'react';
import {
    ShieldCheck, Lock, Globe, Settings, Plus, Layout, MoreVertical, Trash2
} from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const PageEditor = ({ page, onUpdatePage, onAddBlock, onSelectBlock, selectedBlockId, onDeleteBlock, isLocked }) => {
    if (!page) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800">
            {/* Page Meta Header */}
            <div className="p-8 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all">
                {isLocked && (
                    <div className="absolute top-0 right-0 p-2">
                        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-500 text-[8px] font-black px-3 py-1 rounded-bl-2xl flex items-center gap-2 uppercase tracking-widest border-l border-b border-orange-100 dark:border-orange-800 shadow-sm">
                            <ShieldCheck size={10} /> FLAGSHIP TEMPLATE (KİLİTLİ YAPI)
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                                {page.title}
                            </h1>
                            {isLocked && <Lock size={16} className="text-orange-400" />}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                            <span className="flex items-center gap-1.5"><Globe size={11} className="text-[#3BB2B8]" /> connecton.pro/{page.slug}</span>
                            <span className="mx-1 text-slate-200 opacity-30">|</span>
                            <div className="flex items-center gap-2">
                                <span className={page.status === 'published' ? 'text-green-500' : 'text-slate-400'}>{page.status.toUpperCase()}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${page.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={page.status}
                            onChange={(e) => onUpdatePage({ ...page, status: e.target.value })}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#3BB2B8] transition-all cursor-pointer"
                        >
                            <option value="draft">TASLAK (DRAFT)</option>
                            <option value="published">YAYINDA (PUBLISHED)</option>
                        </select>
                        <button className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg">
                            <Settings size={14} /> AYARLAR
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SEO TITLE OVERRIDE</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={page.seo.title}
                                onChange={(e) => onUpdatePage({ ...page, seo: { ...page.seo, title: e.target.value } })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#3BB2B8] focus:ring-4 focus:ring-[#3BB2B8]/5 transition-all"
                                placeholder="Arama motorlarında görünecek başlık..."
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <ShieldCheck size={14} className="text-[#3BB2B8]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blocks List */}
            <div className="flex-1 overflow-y-auto p-8 w-full scrollbar-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h3 className="text-xs font-black text-slate-500 opacity-80 uppercase tracking-[0.2em] flex items-center gap-2">
                            BLOK YÖNETİMİ <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{page.blocks.length}</span>
                        </h3>
                        {isLocked && <p className="text-[9px] text-orange-400 font-black uppercase italic tracking-tight">* BU SAYFA KİLİTLİDİR: BLOK EKLEME VE SIRALAMA YAPILAMAZ.</p>}
                    </div>

                    {!isLocked && (
                        <button
                            onClick={onAddBlock}
                            className="flex items-center gap-2 bg-[#3BB2B8] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-[1.5rem] shadow-xl shadow-cyan-500/20 hover:scale-105 hover:bg-[#329ba1] transition-all active:scale-95 group"
                        >
                            <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> YENİ BLOK EKLE
                        </button>
                    )}
                </div>

                <Droppable droppableId="blocks-list" isDropDisabled={isLocked}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-6"
                        >
                            {page.blocks.map((block, index) => {
                                const isSelected = selectedBlockId === block.id;

                                return (
                                    <Draggable
                                        key={block.id}
                                        draggableId={block.id}
                                        index={index}
                                        isDragDisabled={isLocked}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => onSelectBlock(block)}
                                                className={`group relative flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all cursor-pointer ${snapshot.isDragging ? 'z-50' : ''} ${isSelected
                                                    ? 'bg-white dark:bg-slate-950 border-[#3BB2B8] shadow-2xl ring-4 ring-[#3BB2B8]/5 translate-x-1'
                                                    : 'bg-white/90 dark:bg-slate-950/90 border-slate-100 dark:border-slate-800 hover:border-[#3BB2B8]/30 hover:shadow-xl dark:hover:shadow-none'}`}
                                            >
                                                <div className={`w-14 h-14 rounded-3xl shadow-inner flex items-center justify-center transition-all ${isSelected ? 'bg-[#3BB2B8] text-white rotate-6' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 group-hover:text-[#3BB2B8]'}`}>
                                                    <Layout size={24} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight italic underline decoration-[#3BB2B8]/40 decoration-2 underline-offset-4">{block.type.replace('_', ' ')}</div>
                                                        {isLocked && <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full"><Lock size={10} className="text-slate-400" /></div>}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-bold truncate pr-16 uppercase tracking-wide opacity-80">
                                                        {block.fields.headline || block.fields.title || 'Boş İçerik'}
                                                    </div>
                                                </div>

                                                {!isLocked && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                                        <div className="p-2 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                                            <MoreVertical size={16} />
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                                                            className="p-2.5 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}

                                                {isSelected && (
                                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#3BB2B8] rounded-full shadow-lg shadow-cyan-500/50" />
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};

export default PageEditor;
