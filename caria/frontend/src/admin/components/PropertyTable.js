import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, MoreVertical, Eye, Edit3, Trash2, ExternalLink } from 'lucide-react';

const PropertyTable = ({ properties, onSelect, selectedId, onEdit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
    const [filters, setFilters] = useState({ region: 'All', type: 'All', status: 'All' });

    // Extract unique filter options
    const regions = ['All', ...new Set(properties.map(p => p.region))];
    const types = ['All', ...new Set(properties.map(p => p.type))];
    const statuses = ['All', 'Aktif', 'Pasif'];

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedProperties = useMemo(() => {
        let result = properties.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRegion = filters.region === 'All' || p.region === filters.region;
            const matchesType = filters.type === 'All' || p.type === filters.type;
            const matchesStatus = filters.status === 'All' || p.status === filters.status;

            return matchesSearch && matchesRegion && matchesType && matchesStatus;
        });

        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [properties, searchTerm, sortConfig, filters]);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronDown size={14} className="opacity-20" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-[#3BB2B8]" /> : <ChevronDown size={14} className="text-[#3BB2B8]" />;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Table Header / Toolbar */}
            <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 min-w-[300px] focus-within:border-[#3BB2B8] transition-all">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="İlan ara (Kod, başlık, bölge)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={filters.region}
                        onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:border-[#3BB2B8]"
                    >
                        {regions.map(r => <option key={r} value={r}>{r === 'All' ? 'TÜM BÖLGELER' : r.toUpperCase()}</option>)}
                    </select>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:border-[#3BB2B8]"
                    >
                        {types.map(t => <option key={t} value={t}>{t === 'All' ? 'TÜM TİPLER' : t.toUpperCase()}</option>)}
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:border-[#3BB2B8]"
                    >
                        {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'TÜM DURUMLAR' : s.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            {/* Actual Table */}
            <div className="flex-1 overflow-auto scrollbar-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('code')}>
                                <div className="flex items-center gap-2">KOD <SortIcon column="code" /></div>
                            </th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('title')}>
                                <div className="flex items-center gap-2">BAŞLIK <SortIcon column="title" /></div>
                            </th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">BÖLGE</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">TİP</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('price')}>
                                <div className="flex items-center gap-2">FİYAT <SortIcon column="price" /></div>
                            </th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">DURUM</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('updatedAt')}>
                                <div className="flex items-center gap-2">GÜNCELLEME <SortIcon column="updatedAt" /></div>
                            </th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {filteredAndSortedProperties.map((property) => (
                            <tr
                                key={property.id}
                                onClick={() => onSelect(property)}
                                className={`group cursor-pointer transition-colors ${selectedId === property.id ? 'bg-cyan-50/50 dark:bg-cyan-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            >
                                <td className="p-4 text-xs font-black text-slate-400 font-mono tracking-tighter">{property.code}</td>
                                <td className="p-4">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{property.title}</div>
                                    <div className="text-[10px] text-slate-400 uppercase">{property.location}</div>
                                </td>
                                <td className="p-4 text-xs font-bold text-slate-600 dark:text-slate-300">{property.region}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase">
                                        {property.type}
                                    </span>
                                </td>
                                <td className="p-4 text-xs font-black text-[#3BB2B8]">
                                    {property.currency === 'GBP' ? '£' : '₺'}{property.price.toLocaleString('tr-TR')}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${property.status === 'Aktif' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                        <span className={`text-[10px] font-black uppercase ${property.status === 'Aktif' ? 'text-green-600' : 'text-slate-400'}`}>
                                            {property.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-[10px] text-slate-500 font-medium">{property.updatedAt}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSelect(property); }}
                                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-500 transition-colors shadow-sm"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(property); }}
                                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-green-500 transition-colors shadow-sm"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAndSortedProperties.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Eşleşen İlan Bulunamadı</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyTable;
