export const CARIA_BLOCK_TYPES = {
    hero_video: {
        type: 'hero_video',
        title: 'Giriş Videosu (Full Screen)',
        fields: {
            brand: 'CARIA ESTATES',
            headline: 'HAYALİNİZDEKİ EVE HOŞ GELDİNİZ',
            subheadline: 'Kuzey Kıbrıs\'ın en prestijli gayrimenkul portföyü ile tanışın.',
            videoUrl: 'https://cdn.example.com/caria-bg.mp4',
            posterUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
            primaryCtaText: 'İLANLARI KEŞFET',
            primaryCtaUrl: '/properties'
        }
    },
    featured_properties: {
        type: 'featured_properties',
        title: 'Öne Çıkan İlanlar',
        fields: {
            headline: 'ÖNE ÇIKAN PORTFÖY',
            subtitle: 'Sizin için seçtiğimiz özel yatırım fırsatları.',
            source: 'manual',
            maxItems: 6
        }
    },
    value_proposition: {
        type: 'value_proposition',
        title: 'Değer Önerileri (USP)',
        fields: {
            headline: 'NEDEN CARIA ESTATES?',
            subtitle: '20 yılı aşkın tecrübemizle yanınızdayız.',
            items: [
                { icon: 'Award', title: 'Uzman Kadro', text: 'Alanında uzman danışmanlar.' },
                { icon: 'Shield', title: 'Güvenilir Hizmet', text: 'Şeffaf ve yasal süreç yönetimi.' },
                { icon: 'Smile', title: 'Müşteri Memnuniyeti', text: 'Satış sonrası tam destek.' }
            ]
        }
    },
    regions_showcase: {
        type: 'regions_showcase',
        title: 'Bölgeler Vitrini',
        fields: {
            headline: 'KIBRIS\'I KEŞFEDİN',
            regions: [
                { name: 'Girne', imageUrl: 'https://images.unsplash.com/photo-1623161041926-696770a83350?w=800', url: '/regions/kyrenia' },
                { name: 'İskele', imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800', url: '/regions/iskele' },
                { name: 'Gazimağusa', imageUrl: 'https://images.unsplash.com/photo-1544436429-c72834f2406c?w=800', url: '/regions/famagusta' }
            ]
        }
    },
    advisors_highlight: {
        type: 'advisors_highlight',
        title: 'Danışmanlarımız',
        fields: {
            headline: 'UZMAN EKİBİMİZ',
            subtitle: 'Size yardımcı olmaya hazırız.',
            maxItems: 4
        }
    },
    blog_teasers: {
        type: 'blog_teasers',
        title: 'Blog Yazıları',
        fields: {
            headline: 'YAŞAM VE YATIRIM REHBERİ',
            subtitle: 'Kıbrıs hakkında güncel haberler.',
            maxItems: 3
        }
    },
    partners_strip: {
        type: 'partners_strip',
        title: 'Partner Logoları',
        fields: {
            headline: 'GÜÇLÜ PARTNERLİKLERİMİZ',
            logos: [
                { name: 'Forbes', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Forbes_logo.svg' },
                { name: 'Properstar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Properstar_Logo.png' }
            ]
        }
    },
    cta_banner: {
        type: 'cta_banner',
        title: 'Eylem Çağrısı (Banner)',
        fields: {
            headline: 'Hemen Başlayın',
            text: 'Size en uygun gayrimenkulü bulmak için bir tık uzağınızdayız.',
            ctaText: 'DANIŞMANA BAĞLAN',
            ctaUrl: '/contact',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920'
        }
    }
};

export const INITIAL_PAGES = [
    {
        id: 'p1',
        title: 'Ana Sayfa',
        slug: 'home',
        status: 'published',
        isLockedTemplate: true,
        seo: { title: 'Caria Estates | Kuzey Kıbrıs Gayrimenkul', description: 'Kuzey Kıbrıs\'ta satılık villa ve daireler.' },
        blocks: [
            { id: 'h1', type: 'hero_video', fields: CARIA_BLOCK_TYPES.hero_video.fields },
            { id: 'h2', type: 'featured_properties', fields: CARIA_BLOCK_TYPES.featured_properties.fields },
            { id: 'h3', type: 'value_proposition', fields: CARIA_BLOCK_TYPES.value_proposition.fields },
            { id: 'h4', type: 'regions_showcase', fields: CARIA_BLOCK_TYPES.regions_showcase.fields },
            { id: 'h5', type: 'advisors_highlight', fields: CARIA_BLOCK_TYPES.advisors_highlight.fields },
            { id: 'h6', type: 'cta_banner', fields: CARIA_BLOCK_TYPES.cta_banner.fields }
        ]
    },
    {
        id: 'p2',
        title: 'Blog Sayfası',
        slug: 'blog',
        status: 'draft',
        isLockedTemplate: false,
        seo: { title: 'Blog | Caria Estates', description: 'Kıbrıs rehberi.' },
        blocks: [
            { id: 'b1', type: 'blog_teasers', fields: CARIA_BLOCK_TYPES.blog_teasers.fields }
        ]
    }
];

export const DEFAULT_BLOCKS = CARIA_BLOCK_TYPES;
