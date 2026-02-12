import React from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const SlaBadge = ({ createdAt, status, intent }) => {
    if (status !== 'new') return null;

    const isDelayed = intent === 'GECİKMİŞ';

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${isDelayed
                ? 'bg-red-50 border-red-100 text-red-600 animate-pulse'
                : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
            {isDelayed ? <AlertCircle size={12} /> : <Clock size={12} />}
            <span>{isDelayed ? 'SLA AŞILDI' : 'SLA AKTİF'}</span>
        </div>
    );
};

export default SlaBadge;
