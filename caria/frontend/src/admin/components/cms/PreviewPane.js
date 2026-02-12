import React, { useState } from 'react';
import { Eye, Smartphone, Monitor, Tablet, Award, Users, MapPin, ChevronRight, Play, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const PreviewPane = ({ blocks }) => {
    const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile
    const [zoom, setZoom] = useState(100); // 80, 100, 120

    const getDeviceWidth = () => {
        if (device === 'mobile') return '375px';
        if (device === 'tablet') return '768px';
        return '100%';
    };

    return (
        <div className="h-full bg-slate-100 dark:bg-slate-900/40 p-10 overflow-hidden flex flex-col items-center relative">
            {/* Preview Toolbar */}
            <div className="w-full flex items-center justify-between mb-8 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg">
                        <Eye size={18} className="text-[#3BB2B8]" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] italic">PREVIEW ENGINE</h3>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            LIVE RENDER V2.0 <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Zoom Control */}
                    <div className="flex p-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                        {[80, 100, 120].map(z => (
                            <button
                                key={z}
                                onClick={() => setZoom(z)}
                                className={`px-2 py-1.5 text-[9px] font-black rounded-xl transition-all ${zoom === z ? 'bg-[#3BB2B8] text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                %{z}
                            </button>
                        ))}
                    </div>

                    {/* Device Toggle */}
                    <div className="flex p-1.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                        <button
                            onClick={() => setDevice('desktop')}
                            className={`p-2.5 rounded-xl transition-all ${device === 'desktop' ? 'text-[#3BB2B8] bg-cyan-50 dark:bg-cyan-900/20 shadow-inner' : 'text-slate-400 hover:text-[#3BB2B8]'}`}
                        >
                            <Monitor size={18} />
                        </button>
                        <button
                            onClick={() => setDevice('tablet')}
                            className={`p-2.5 rounded-xl transition-all ${device === 'tablet' ? 'text-[#3BB2B8] bg-cyan-50 dark:bg-cyan-900/20 shadow-inner' : 'text-slate-400 hover:text-[#3BB2B8]'}`}
                        >
                            <Tablet size={18} />
                        </button>
                        <button
                            onClick={() => setDevice('mobile')}
                            className={`p-2.5 rounded-xl transition-all ${device === 'mobile' ? 'text-[#3BB2B8] bg-cyan-50 dark:bg-cyan-900/20 shadow-inner' : 'text-slate-400 hover:text-[#3BB2B8]'}`}
                        >
                            <Smartphone size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Frame Container */}
            <div className="w-full flex-1 flex justify-center overflow-hidden">
                <div
                    className="h-full bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-500 origin-top overflow-hidden"
                    style={{
                        width: getDeviceWidth(),
                        transform: `scale(${zoom / 100})`
                    }}
                >
                    {/* Browser Chrome */}
                    <div className="h-12 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md flex items-center px-6 shadow-sm z-[10] border-b border-slate-50 dark:border-slate-800 shrink-0">
                        <div className="flex gap-1.5 w-16">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="w-48 h-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center px-3">
                                <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest truncate">cariaestates.com/preview-v2</div>
                            </div>
                        </div>
                        <div className="w-16 flex justify-end">
                            <Maximize2 size={12} className="text-slate-300" />
                        </div>
                    </div>

                    {/* Actual Content Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-hidden scroll-smooth bg-white dark:bg-slate-950">
                        <div className="flex flex-col">
                            {blocks.map((block) => (
                                <div key={block.id} className="relative border-b border-slate-50 dark:border-slate-800 last:border-0 group/preview transition-all duration-300">
                                    <div className="absolute top-4 left-4 z-50 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                                        <span className="bg-[#3BB2B8] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-xl border border-white/20">
                                            {block.type.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* CARIA BLOCK RENDERERS */}
                                    {block.type === 'hero_video' && (
                                        <div className={`relative flex flex-col items-center justify-center text-center px-10 bg-slate-900 overflow-hidden ${device === 'mobile' ? 'h-[400px]' : 'h-[600px]'}`}>
                                            <img src={block.fields.posterUrl} className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 brightness-50" alt="" />
                                            <div className="relative z-20 space-y-6">
                                                <div className="text-[10px] font-black text-[#3BB2B8] tracking-[0.4em] uppercase mb-4">{block.fields.brand || 'CARIA CONNECT'}</div>
                                                <h1 className={`${device === 'mobile' ? 'text-2xl' : 'text-5xl'} font-black text-white tracking-tighter uppercase italic leading-none max-w-2xl drop-shadow-2xl`}>{block.fields.headline}</h1>
                                                <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">{block.fields.subheadline}</p>
                                                <div className="flex items-center justify-center gap-4 pt-4">
                                                    <button className="px-8 py-3.5 bg-[#3BB2B8] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/30 active:scale-95 transition-all">{block.fields.primaryCtaText || 'KEŞFET'}</button>
                                                    <button className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-all"><Play size={18} fill="white" stroke="0" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {block.type === 'featured_properties' && (
                                        <div className={`${device === 'mobile' ? 'p-8' : 'p-20'} bg-white dark:bg-slate-950 text-center space-y-10`}>
                                            <div className="space-y-3">
                                                <h2 className={`${device === 'mobile' ? 'text-xl' : 'text-3xl'} font-black text-slate-900 dark:text-white uppercase tracking-tighter italic`}>{block.fields.headline}</h2>
                                                <div className="w-12 h-1 bg-[#3BB2B8] mx-auto rounded-full" />
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">{block.fields.subtitle}</p>
                                            </div>
                                            <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} gap-8 text-left`}>
                                                {[1, 2].map(i => (
                                                    <div key={i} className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden group/card shadow-sm hover:shadow-xl transition-all duration-500">
                                                        <div className="h-56 bg-slate-100 dark:bg-slate-800 relative">
                                                            <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 text-[#3BB2B8] text-[9px] font-black px-3 py-1.5 rounded-full shadow-sm">PREMIUM VILLA</div>
                                                            <img src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&offset=${i * 100}`} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="p-8 space-y-3">
                                                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase">Caria Modern Legacy #{i}</div>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold tracking-widest uppercase"><MapPin size={10} /> GIRNE / KIBRIS</div>
                                                            <div className="text-lg font-black text-[#3BB2B8] pt-2">£550,000</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {block.type === 'value_proposition' && (
                                        <div className={`${device === 'mobile' ? 'p-8' : 'p-20'} bg-slate-50 dark:bg-slate-900/50 text-center space-y-16`}>
                                            <div className="space-y-3">
                                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic underline decoration-[#3BB2B8] decoration-4 underline-offset-8">{block.fields.headline}</h2>
                                            </div>
                                            <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-10`}>
                                                {(block.fields.items || []).map((item, i) => (
                                                    <div key={i} className="space-y-4 p-6 bg-white dark:bg-slate-950 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all hover:border-[#3BB2B8]/40">
                                                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-[#3BB2B8]">
                                                            <Award size={28} />
                                                        </div>
                                                        <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"{item.text || 'Açıklama girilmedi.'}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Default fallback for other types */}
                                    {!['hero_video', 'featured_properties', 'value_proposition'].includes(block.type) && (
                                        <div className="p-20 bg-white dark:bg-slate-950 text-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                                                <Maximize2 size={24} />
                                            </div>
                                            <div className="italic text-slate-300 text-[10px] uppercase font-black tracking-[0.3em] leading-loose">
                                                [{block.type.toUpperCase()}] <br /> HIGH-FIDELITY RENDER PENDING
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Status Info */}
            <div className="mt-6 flex items-center gap-6 text-[9px] font-black text-slate-300 uppercase tracking-widest z-20">
                <div className="flex items-center gap-2">DEVICE: <span className="text-slate-500">{device.toUpperCase()}</span></div>
                <div className="flex items-center gap-2">VIEWPORT: <span className="text-slate-500">{getDeviceWidth()}</span></div>
                <div className="flex items-center gap-2">STATUS: <span className="text-green-500">LIVE SYNC ACTIVE</span></div>
            </div>
        </div>
    );
};

export default PreviewPane;
