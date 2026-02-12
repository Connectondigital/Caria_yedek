import React from 'react';
import { Cloud, CloudOff, Loader2, CheckCircle } from 'lucide-react';

const SaveStatusIndicator = ({ status, lastSaved }) => {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 transition-all">
            {status === 'saving' ? (
                <>
                    <Loader2 size={12} className="text-[#3BB2B8] animate-spin" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KAYDEDİLİYOR...</span>
                </>
            ) : status === 'dirty' ? (
                <>
                    <CloudOff size={12} className="text-orange-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EDİTLENİYOR</span>
                </>
            ) : (
                <>
                    <CheckCircle size={12} className="text-green-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        KAYDEDİLDİ • {lastSaved || 'ŞİMDİ'}
                    </span>
                </>
            )}
        </div>
    );
};

export default SaveStatusIndicator;
