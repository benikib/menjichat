import api from './api';

const paiementService = {
  // Récupérer les immobiliers de l'agence avec le nombre de locations
  getImmobiliersWithLocationsCount: async () => {
    try {
      const response = await api.get('/biens/with-locations-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les locations d'un immobilier avec leurs contrats actifs
  getLocationsByImmobilier: async (immobilierId) => {
    try {
      const response = await api.get(`/immobiliers/${immobilierId}/locations/with-contrats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer tous les paiements d'un immobilier
  getPaiementsByImmobilier: async (immobilierId) => {
    try {
      const response = await api.get(`/immobiliers/${immobilierId}/paiements`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les statistiques de paiement d'un immobilier
  getPaiementStats: async (immobilierId) => {
    try {
      const response = await api.get(`/immobiliers/${immobilierId}/paiements/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les mois disponibles pour un immobilier
  getMoisDisponibles: async (immobilierId) => {
    try {
      const response = await api.get(`/immobiliers/${immobilierId}/mois-disponibles`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les paiements filtrés
  getPaiementsFiltres: async (immobilierId, mois, annee) => {
    try {
      const response = await api.get(`/immobiliers/${immobilierId}/paiements/filtres`, {
        params: { mois, annee }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer tous les paiements d'un contrat
  getPaiementsByContrat: async (contratId) => {
    try {
      const response = await api.get(`/contrats/${contratId}/paiements`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un paiement spécifique
  getPaiement: async (id) => {
    try {
      const response = await api.get(`/paiements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer un nouveau paiement
  createPaiement: async (paiementData) => {
    try {
      const response = await api.post('/paiements', paiementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un paiement
updatePaiement: async (id, paiementData) => {
  try {
    console.log('Appel API update - ID:', id, 'Data:', paiementData);
    const response = await api.put(`/paiements/${id}`, paiementData);
    console.log('Réponse update:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur API updatePaiement:', error.response || error);
    throw error.response?.data || error.message;
  }
},

  // Supprimer un paiement
  deletePaiement: async (id) => {
    try {
      const response = await api.delete(`/paiements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer le contrat actif d'une location
  getContratActifByLocation: async (locationId) => {
    try {
      const response = await api.get(`/locations/${locationId}/contrat-actif`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paiementService;