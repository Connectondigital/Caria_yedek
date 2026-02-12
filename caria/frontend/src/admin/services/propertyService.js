import axios from 'axios';

const API_BASE = '/api';

export const propertyService = {
    /**
     * Fetches all properties from the backend
     */
    async getProperties() {
        try {
            const response = await axios.get(`${API_BASE}/properties`);
            return response.data.map(this.adapter);
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    },

    /**
     * Updates a property status or featured flag
     */
    async updateProperty(id, data) {
        try {
            const response = await axios.post(`${API_BASE}/properties`, {
                id,
                ...data
            });
            return response.data;
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    },

    /**
     * Maps API fields to UI-expected fields
     */
    adapter(prop) {
        return {
            id: prop.id,
            title: prop.title || 'Untitled Property',
            region: prop.region || 'N/A',
            location: prop.location || 'N/A',
            price: prop.price,
            currency: 'GBP', // Default for now as per mock
            status: prop.status || 'published',
            featured: Boolean(prop.is_featured),
            sqm: parseInt(prop.area) || 0,
            beds: prop.beds || 0,
            baths: prop.baths || 0,
            agentName: prop.advisor_name || 'Unassigned',
            coverImage: prop.image || '/assets/images/placeholder-teal.png',
            galleryImages: Array.isArray(prop.gallery) ? prop.gallery : [],
            latitude: prop.latitude ? parseFloat(prop.latitude) : null,
            longitude: prop.longitude ? parseFloat(prop.longitude) : null,
            // These might not be in the basic API yet, but required by UI
            roiPct: 0,
            rentYield: 0
        };
    }
};
