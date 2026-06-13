// resources/js/store/useDashboardStore.js

import { create } from 'zustand';
import axios from 'axios';

// Configuration axios avec l'URL de base
const api = axios.create({
    baseURL: '/api', // Utilise le proxy Vite en développement pour éviter les erreurs CORS
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

const useDashboardStore = create((set, get) => ({
    dashboardData: null,
    stats: [],
    recentProjects: [],
    recentTasks: [],
    upcomingMeetings: [],
    taskDistribution: {},
    loading: false,
    error: null,

    fetchDashboard: async () => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching dashboard...');
            const response = await api.get('/dashboard');
            
            console.log('Dashboard response:', response.data);
            
            // Vérifier la structure de la réponse
            const data = response.data;
            
            if (!data || !data.data) {
                throw new Error('Structure de réponse invalide');
            }
            
            const dashboardData = data.data;
            
            // Transformer les stats pour le format attendu
            const formattedStats = [
                {
                    label: 'Projets en cours',
                    value: dashboardData.stats?.total_projects || 0,
                    icon: 'FolderIcon',
                    color: 'bg-blue-600',
                    trend: '+0%',
                    trendUp: true
                },
                {
                    label: 'Tâches totales',
                    value: dashboardData.stats?.total_tasks || 0,
                    icon: 'CheckCircleIcon',
                    color: 'bg-green-600',
                    trend: '+0%',
                    trendUp: true
                },
                {
                    label: 'Tâches terminées',
                    value: dashboardData.stats?.completed_tasks || 0,
                    icon: 'ClipboardCheckIcon',
                    color: 'bg-purple-600',
                    trend: '+0%',
                    trendUp: true
                },
                {
                    label: 'Messages',
                    value: dashboardData.stats?.total_messages || 0,
                    icon: 'ChatBubbleLeftRightIcon',
                    color: 'bg-orange-600',
                    trend: '+0%',
                    trendUp: true
                }
            ];
            
            set({
                dashboardData: dashboardData,
                stats: formattedStats,
                recentProjects: dashboardData.recent_projects || [],
                recentTasks: dashboardData.recent_tasks || [],
                upcomingMeetings: dashboardData.upcoming_meetings || [],
                taskDistribution: dashboardData.task_distribution || { en_cours: 0, terminee: 0, en_attente: 0, prevu: 0 },
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
            console.error('Détails:', error.response?.data);
            
            let errorMessage = 'Impossible de charger le tableau de bord';
            if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 404) {
                errorMessage = 'API non trouvée. Vérifiez que le serveur Laravel est démarré.';
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Impossible de contacter le serveur. Vérifiez que php artisan serve est en cours d\'exécution.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({ 
                dashboardData: null,
                stats: [],
                recentProjects: [],
                recentTasks: [],
                upcomingMeetings: [],
                taskDistribution: {},
                loading: false, 
                error: errorMessage
            });
        }
    },

    actualiseDashboard: async () => {
        await get().fetchDashboard();
    }
}));

export default useDashboardStore;