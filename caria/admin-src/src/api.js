import axios from "axios";

export const BACKEND_URL = "";
const API_BASE_URL = "/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return "https://via.placeholder.com/300";
    const cleanUrl = url.trim();
    if (!cleanUrl) return "https://via.placeholder.com/300";
    if (cleanUrl.startsWith('/assets/') || cleanUrl.startsWith('static/')) return cleanUrl;
    let filename = cleanUrl;
    if (cleanUrl.includes('/')) {
        filename = cleanUrl.split('/').pop();
    }
    if (cleanUrl.startsWith('http') &&
        !cleanUrl.includes('localhost') &&
        !cleanUrl.includes('127.0.0.1') &&
        !cleanUrl.includes('69.62.114.46') &&
        !cleanUrl.includes('cariaestates.com')) {
        return cleanUrl;
    }
    return `/static/uploads/${filename}`;
};

export const propertyService = {
    getProperties: () => api.get("/properties"),
    getProperty: (slug) => api.get(`/properties/${slug}`),
    addProperty: (data) => api.post("/properties", data),
    deleteProperty: (id) => api.delete(`/properties/${id}`),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export const inquiryService = {
    getInquiries: () => api.get("/inquiries"),
    addInquiry: (data) => api.post("/inquiries", data),
    deleteInquiry: (id) => api.delete(`/inquiries/${id}`),
};

export const cmsService = {
    getSliders: () => api.get("/cms/sliders"),
    addSlider: (data) => api.post("/cms/sliders", data),
    getContent: () => api.get("/cms/content"),
    updateContent: (data) => api.post("/cms/update", data),
};

export const pageService = {
    getPages: () => api.get("/cms/pages"),
    getPageBySlug: (slug) => api.get(`/cms/pages/${slug}`),
    savePage: (data) => api.post("/cms/pages", data),
    deletePage: (id) => api.delete(`/cms/pages/${id}`),
};

export const menuService = {
    getMenus: () => api.get("/cms/menus"),
    saveMenu: (data) => api.post("/cms/menus", data),
    deleteMenu: (id) => api.delete(`/cms/menus/${id}`),
};

export const advisorService = {
    getAdvisors: () => api.get("/advisors"),
    getAdvisor: (slug) => api.get(`/advisors/${slug}`),
    getAdvisorListings: (id) => api.get(`/advisors/${id}/listings`),
    saveAdvisor: (data) => api.post("/advisors", data),
    deleteAdvisor: (id) => api.delete(`/advisors/${id}`),
};

export const homepageService = {
    getBlocks: () => api.get("/cms/homepage"),
    saveBlock: (data) => api.post("/cms/homepage", data),
    deleteBlock: (id) => api.delete(`/cms/homepage/${id}`),
};

export const featureService = {
    getFeatures: () => api.get("/cms/features"),
    saveFeature: (data) => api.post("/cms/features", data),
    deleteFeature: (id) => api.delete(`/cms/features/${id}`),
};

export const cmsBlockService = {
    getPages: () => api.get("/cms-blocks/pages"),
    getPage: (slug) => api.get(`/cms-blocks/page/${slug}`),
    getPagesByCategory: (category) => api.get(`/cms-blocks/pages/category/${category}`),
    savePage: (data) => api.post("/cms-blocks/pages", data),
    deletePage: (id) => api.delete(`/cms-blocks/pages/${id}`),
    getBlocks: (pageId) => api.get(`/cms-blocks/pages/${pageId}/blocks`),
    saveBlock: (pageId, data) => api.post(`/cms-blocks/pages/${pageId}/blocks`, data),
    updateBlock: (blockId, data) => api.put(`/cms-blocks/blocks/${blockId}`, data),
    deleteBlock: (blockId) => api.delete(`/cms-blocks/blocks/${blockId}`),
    reorderBlocks: (pageId, blockIds) => api.put(`/cms-blocks/pages/${pageId}/blocks/reorder`, { block_ids: blockIds }),
};

export default api;
