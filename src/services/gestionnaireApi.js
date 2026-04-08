import api from "./api";
import useAuthStore from '../store/useAuthStore';

export const getGestionnaires = () => {
  const agence_id = useAuthStore.getState().user?.agence_id;

  return api.get(`/agences/${agence_id}/gestionnaires`);
};

export const createGestionnaire = (data) =>
  api.post("/users", data);

export const updateGestionnaire = (id, data) =>
  api.put(`/users/${id}`, data);

export const deleteGestionnaire = (id) =>
  api.delete(`/users/${id}`);