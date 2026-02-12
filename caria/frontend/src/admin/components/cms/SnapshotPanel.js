import React from 'react';
import { History, RotateCcw, Plus, Trash2, Clock } from 'lucide-react';

const SnapshotPanel = ({ snapshots, onCreate, onRestore, onDelete }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-[#3BB2B8]" />
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">VERSİYONLAR</h3>
                </div>
                <button
                    onClick={onCreate}
                    className="p-1.5 bg-[#3BB2B8]/10 text-[#3BB2B8] rounded-lg hover:bg-[#3BB2B8] hover:text-white transition-all shadow-sm"
                    title="Snapshot Oluştur"
                >
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {snapshots.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
                        <Clock size={32} className="text-slate-300 mb-4" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">HİÇ VERSİYON YOK</p>
                    </div>
                ) : (
                    snapshots.map((snap) => (
                        <div
                            key={snap.id}
                            className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-[#3BB2B8]/40 transition-all shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-black text-[#3BB2B8] uppercase tracking-widest bg-cyan-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded">
                                    V{snap.version || 1}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onRestore(snap)}
                                        className="p-1 text-slate-400 hover:text-[#3BB2B8] transition-colors"
                                        title="Geri Yükle"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(snap.id)}
                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight truncate">
                                {snap.note || 'Otomatik Snapshot'}
                            </div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(snap.timestamp).toLocaleString('tr-TR')}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SnapshotPanel;
