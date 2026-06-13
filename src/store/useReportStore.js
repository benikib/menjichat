// resources/js/store/useReportStore.js

import { create } from 'zustand';
import axios from 'axios';

// Configuration d'axios avec l'URL de base
const api = axios.create({
    baseURL: 'http://menjichatback.menjidrc.com/', // Utilise le proxy Vite en développement pour éviter les erreurs CORS
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const useReportStore = create((set, get) => ({
    reportData: null,
    loading: false,
    error: null,
    currentPeriod: 'monthly',
    periodParams: {},

    fetchReport: async (period, params = {}) => {
        set({ loading: true, error: null, currentPeriod: period, periodParams: params });
        
        try {
            let url = '';
            let config = { params: {} };
            
            // Construire l'URL et les paramètres selon la période
            switch(period) {
                case 'daily':
                    url = '/reports/daily';
                    if (params.date) config.params.date = params.date;
                    break;
                case 'weekly':
                    url = '/reports/weekly';
                    if (params.week) config.params.week = params.week;
                    if (params.year) config.params.year = params.year;
                    break;
                case 'monthly':
                    url = '/reports/monthly';
                    if (params.month) config.params.month = params.month;
                    if (params.year) config.params.year = params.year;
                    break;
                case 'quarterly':
                    url = '/reports/quarterly';
                    if (params.quarter) config.params.quarter = params.quarter;
                    if (params.year) config.params.year = params.year;
                    break;
                case 'semester':
                    url = '/reports/semester';
                    if (params.semester) config.params.semester = params.semester;
                    if (params.year) config.params.year = params.year;
                    break;
                case 'annual':
                    url = '/reports/annual';
                    if (params.year) config.params.year = params.year;
                    break;
                default:
                    url = '/reports/monthly';
            }
            
            console.log('Appel API:', url, config.params);
            
            const response = await api.get(url, config);
            
            set({ 
                reportData: response.data.data, 
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Erreur fetchReport:', error);
            
            let errorMessage = 'Impossible de charger le rapport';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 404) {
                errorMessage = 'API non trouvée. Vérifiez que le serveur Laravel est démarré.';
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Impossible de contacter le serveur. Vérifiez que php artisan serve est en cours d\'exécution.';
            }
            
            set({ 
                reportData: null,
                loading: false, 
                error: errorMessage
            });
        }
    },

    fetchCustomReport: async (startDate, endDate) => {
        set({ loading: true, error: null });
        
        try {
            const response = await api.post('/reports/custom', {
                start_date: startDate,
                end_date: endDate
            });
            
            set({ 
                reportData: response.data.data, 
                loading: false, 
                currentPeriod: 'custom',
                error: null
            });
        } catch (error) {
            console.error('Erreur fetchCustomReport:', error);
            
            let errorMessage = 'Impossible de charger le rapport personnalisé';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({ 
                reportData: null,
                loading: false, 
                currentPeriod: 'custom',
                error: errorMessage
            });
        }
    },

    exportReport: async (period, params = {}) => {
        try {
            let url = `/reports/export/${period}`;
            const queryParams = new URLSearchParams();
            
            if (params.year) queryParams.append('year', params.year);
            if (params.month) queryParams.append('month', params.month);
            if (params.week) queryParams.append('week', params.week);
            if (params.quarter) queryParams.append('quarter', params.quarter);
            if (params.semester) queryParams.append('semester', params.semester);
            if (params.date) queryParams.append('date', params.date);
            
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            
            const response = await api.get(url, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'text/csv' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `rapport_${period}_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Erreur export:', error);
            alert('Erreur lors de l\'export du rapport');
        }
    },
    
    resetReport: () => {
        set({ reportData: null, error: null });
    }
}));

export default useReportStore;