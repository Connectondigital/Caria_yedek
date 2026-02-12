export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getBlockIcon = (type) => {
    switch (type) {
        case 'hero_video': return 'Video';
        case 'featured_properties': return 'Home';
        case 'value_proposition': return 'Award';
        case 'regions_showcase': return 'Map';
        case 'advisors_highlight': return 'Users';
        case 'blog_teasers': return 'Newspaper';
        case 'partners_strip': return 'Briefcase';
        case 'cta_banner': return 'Zap';
        default: return 'Box';
    }
};

export const getStatusColor = (status) => {
    return status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500';
};
