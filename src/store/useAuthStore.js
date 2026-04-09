import { create } from "zustand";
import { persist } from "zustand/middleware";

// Création du store global avec persistance
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: [], // Changed from null to empty array
      token: null,
      loading: false,
      error: null,

      // login
      login: async (data) => {
        set({ loading: true, error: null });
        try {
          // Stocker dans le store
          set({ 
            user: data.user, 
            token: data.token, 
            role: Array.isArray(data.role) ? data.role : [data.role], // Handle both array and string
            loading: false 
          });
          
          // Optionnel : tu peux aussi stocker dans localStorage comme backup
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          if (data.role) {
            localStorage.setItem("role", JSON.stringify(Array.isArray(data.role) ? data.role : [data.role]));
          }
          
        } catch (err) {
          set({ 
            error: err.message, 
            user: null, 
            token: null,
            role: [], // Changed from null to empty array
            loading: false 
          });
        }
      },

      // logout
      logout: () => {
        // Nettoyer le localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        
        // Réinitialiser le store
        set({ 
          user: null, 
          token: null,
          role: [], // Changed from null to empty array
          error: null 
        });
      },

      // charger token et user depuis localStorage au démarrage
      loadUserFromStorage: () => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const roleStr = localStorage.getItem("role");
        
        if (token) {
          let user = null;
          let role = [];
          try {
            user = userStr ? JSON.parse(userStr) : null;
            role = roleStr ? JSON.parse(roleStr) : [];
          } catch (e) {
            console.error("Erreur de parsing user ou role:", e);
          }
          
          set({ 
            token, 
            user,
            role: Array.isArray(role) ? role : []
          });
        }
      },

      // Mettre à jour le user
      updateUser: (userData) => {
        set({ user: { ...userData } });
        localStorage.setItem("user", JSON.stringify(userData));
      },

      // Mettre à jour le token
      updateToken: (newToken) => {
        set({ token: newToken });
        localStorage.setItem("token", newToken);
      },
    }),
    {
      name: "auth-storage", // nom pour le localStorage
      getStorage: () => localStorage, // utiliser localStorage (par défaut)
      partialize: (state) => ({ 
        // Spécifier quelles parties du state persister
        user: state.user,
        token: state.token,
        role: state.role 
      }),
    }
  )
);

export default useAuthStore;