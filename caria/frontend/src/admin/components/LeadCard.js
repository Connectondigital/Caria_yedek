import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Mail, Phone, MapPin, Clock, MoreVertical, Send, MessageCircle, FileText } from 'lucide-react';

const LeadCard = ({ lead, index, onClick }) => {
  const { id, name, budget, currency, location, intent, lastActivity } = lead;

  const getBadgeStyles = (intent) => {
    switch (intent) {
      case 'SICAK': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
      case 'GECİKMİŞ': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(lead)}
          className={`
            bg-white dark:bg-slate-900 rounded-2xl border p-4 mb-3 transition-all cursor-pointer group select-none
            ${snapshot.isDragging
              ? 'shadow-2xl border-[#3BB2B8] scale-[1.02] z-50 ring-4 ring-cyan-500/10'
              : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md'}
          `}
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${getBadgeStyles(intent)}`}>
              {intent}
            </span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={14} />
            </button>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 group-hover:text-[#3BB2B8] transition-colors">{name}</h4>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{location}</span>
          </div>

          <div className="text-[15px] font-black text-[#3BB2B8] mb-3">
            {currency === 'TL' ? '₺' : '£'}{budget.toLocaleString('tr-TR')}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-4 font-medium">
            <Clock size={12} className="shrink-0" />
            <span>{lastActivity}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center gap-0.5">
              <div className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
                <Phone size={14} />
              </div>
              <div className="p-1.5 rounded-lg text-green-500/70 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                <MessageCircle size={14} />
              </div>
              <div className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
                <FileText size={14} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#3BB2B8] font-black text-[10px] uppercase tracking-wider">
              <Send size={12} />
              <span>TEKLİF</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default LeadCard;
