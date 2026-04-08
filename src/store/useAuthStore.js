import { create } from "zustand";
import { persist } from "zustand/middleware";

// Création du store global avec persistance
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
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
            role: data.role,
            loading: false 
          });
          
          // Optionnel : tu peux aussi stocker dans localStorage comme backup
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          if (data.role) {
            localStorage.setItem("role", data.role);
          }
          
        } catch (err) {
          set({ 
            error: err.message, 
            user: null, 
            token: null,
            role: null,
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
          role: null,
          error: null 
        });
      },

      // charger token et user depuis localStorage au démarrage
      loadUserFromStorage: () => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const role = localStorage.getItem("role");
        
        if (token) {
          let user = null;
          try {
            user = userStr ? JSON.parse(userStr) : null;
          } catch (e) {
            console.error("Erreur de parsing user:", e);
          }
          
          set({ 
            token, 
            user,
            role: role || null
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