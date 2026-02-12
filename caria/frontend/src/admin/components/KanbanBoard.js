import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';

const KanbanBoard = ({ leads, onDragEnd, onLeadClick }) => {
    const columns = [
        { id: 'new', title: 'Yeni Fırsatlar' },
        { id: 'first_contact', title: 'İlk Görüşme' },
        { id: 'interested', title: 'İlgilenenler' },
        { id: 'negotiation', title: 'Teklif' },
        { id: 'closed', title: 'Kapananlar' },
        { id: 'lost', title: 'Kaybedilenler' }
    ];

    const getLeadsByStatus = (status) => leads.filter(l => l.status === status);

    const calculateTotalBudget = (statusLeads) => {
        return statusLeads.reduce((sum, lead) => sum + lead.budget, 0);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-10 h-full scrollbar-hidden">
                {columns.map(column => {
                    const columnLeads = getLeadsByStatus(column.id);
                    const totalBudget = calculateTotalBudget(columnLeads);
                    const firstCurrency = columnLeads[0]?.currency || 'TL';

                    return (
                        <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col h-full">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-5 px-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">
                                            {column.title}
                                        </h3>
                                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black rounded-md">
                                            {columnLeads.length}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-[#3BB2B8] font-black tracking-widest uppercase">
                                        {firstCurrency === 'TL' ? '₺' : '£'}{totalBudget.toLocaleString('tr-TR')}
                                    </div>
                                </div>
                                <button className="w-7 h-7 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#3BB2B8] hover:border-[#3BB2B8] transition-all">
                                    <span className="text-xl font-light">+</span>
                                </button>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`
                      flex-1 rounded-3xl p-3 border-2 border-dashed transition-all
                      ${snapshot.isDraggingOver
                                                ? 'bg-cyan-50/50 dark:bg-cyan-900/10 border-[#3BB2B8] shadow-inner'
                                                : 'bg-slate-50/30 dark:bg-slate-900/10 border-transparent'}
                    `}
                                    >
                                        <div className="flex flex-col h-full overflow-y-auto scrollbar-hidden">
                                            {columnLeads.map((lead, index) => (
                                                <LeadCard
                                                    key={lead.id}
                                                    lead={lead}
                                                    index={index}
                                                    onClick={onLeadClick}
                                                />
                                            ))}
                                            {provided.placeholder}

                                            {columnLeads.length === 0 && !snapshot.isDraggingOver && (
                                                <div className="h-40 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border border-slate-100 dark:border-slate-800/10 rounded-2xl bg-white/50 dark:bg-slate-900/50 italic">
                                                    Fırsat Bulunmuyor
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
