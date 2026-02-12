export const formatPrice = (price, currency = 'GBP') => {
    const symbol = currency === 'GBP' ? '£' : '₺';
    return `${symbol}${price.toLocaleString('tr-TR')}`;
};

export const convertToTL = (price, currency) => {
    if (currency === 'TL') return price;
    const mockRate = 40; // 1 GBP = 40 TL
    return price * mockRate;
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'draft':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        case 'archived':
            return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

export const getStatusLabel = (status) => {
    switch (status) {
        case 'published': return 'Yayında';
        case 'draft': return 'Taslak';
        case 'archived': return 'Arşiv';
        default: return status;
    }
};
