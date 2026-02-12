import axios from 'axios';

const API_BASE = '/api';

export const clientService = {
    /**
     * Fetches all clients
     */
    async getClients() {
        const response = await axios.get(`${API_BASE}/clients`);
        return response.data;
    },

    /**
     * Adds or updates a client
     */
    async saveClient(data) {
        const response = await axios.post(`${API_BASE}/clients`, data);
        return response.data;
    },

    /**
     * Deletes a client
     */
    async deleteClient(id) {
        const response = await axios.delete(`${API_BASE}/clients/${id}`);
        return response.data;
    },

    /**
     * Get matching properties for a client
     */
    async getClientMatches(id) {
        const response = await axios.get(`${API_BASE}/clients/${id}/matches`);
        return response.data;
    },

    async getActivities(clientId) {
        const response = await axios.get(`${API_BASE}/activities?client_id=${clientId}`);
        return response.data;
    },

    async addActivity(data) {
        const response = await axios.post(`${API_BASE}/activities`, data);
        return response.data;
    },

    async getAppointments() {
        const response = await axios.get(`${API_BASE}/appointments`);
        return response.data;
    },

    async addAppointment(data) {
        const response = await axios.post(`${API_BASE}/appointments`, data);
        return response.data;
    }
};
