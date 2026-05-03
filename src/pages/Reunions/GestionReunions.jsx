import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const initialForm = {
  objetif: "",
  date: "",
  heure_debut: "",
  heure_fin: "",
  lieu_ou_lien: "",
  description: "",
  projet_id: "",
};

function GestionReunions() {
  const [reunions, setReunions] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);

  const [createForm, setCreateForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);

  const fetchReunions = async () => {
    try {
      const response = await api.get("/reunions");
      setReunions(Array.isArray(response.data) ? response.data : []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.error || "Impossible de charger les reunions.");
    }
  };

  const fetchProjets = async () => {
    try {
      const response = await api.get("/projets");
      const projetsData = response?.data?.projets;
      setProjets(Array.isArray(projetsData) ? projetsData : []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.error || "Impossible de charger les projets.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReunions(), fetchProjets()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const groupedReunions = useMemo(() => {
    const groupedMap = {};
    reunions.forEach((reunion) => {
      const projetId = reunion.projet_id;
      const projetName = reunion?.projet?.nom || `Projet #${projetId}`;

      if (!groupedMap[projetId]) {
        groupedMap[projetId] = {
          projetId,
          projetName,
          reunions: [],
        };
      }

      groupedMap[projetId].reunions.push(reunion);
    });

    return Object.values(groupedMap).sort((a, b) => a.projetName.localeCompare(b.projetName));
  }, [reunions]);

  const handleCreateInputChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeCreateModal = () => {
    setCreateForm(initialForm);
    setShowCreateModal(false);
  };

  const closeEditModal = () => {
    setSelectedReunion(null);
    setEditForm(initialForm);
    setShowEditModal(false);
  };

  const openEditModal = (reunion) => {
    setSelectedReunion(reunion);
    setEditForm({
      objetif: reunion.objetif || "",
      date: reunion.date ? reunion.date.slice(0, 10) : "",
      heure_debut: reunion.heure_debut || "",
      heure_fin: reunion.heure_fin || "",
      lieu_ou_lien: reunion.lieu_ou_lien || "",
      description: reunion.description || "",
      projet_id: reunion.projet_id ? String(reunion.projet_id) : "",
    });
    setShowEditModal(true);
  };

  const handleCreateReunion = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/reunions", createForm);
      await fetchReunions();
      closeCreateModal();
    } catch (createError) {
      setError(createError?.response?.data?.message || "Echec lors de la creation de la reunion.");
    }
  };

  const handleUpdateReunion = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedReunion?.id) return;

    try {
      await api.put(`/reunions/${selectedReunion.id}`, editForm);
      await fetchReunions();
      closeEditModal();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || "Echec lors de la mise a jour de la reunion.");
    }
  };

  const handleDeleteReunion = async (reunionId) => {
    const confirmed = window.confirm("Supprimer cette reunion ?");
    if (!confirmed) return;

    setError("");
    try {
      await api.delete(`/reunions/${reunionId}`);
      await fetchReunions();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Echec lors de la suppression.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("fr-FR");
  };

  const formatTime = (value) => {
    if (!value) return "-";
    if (value.includes("T")) {
      return new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    return value.slice(0, 5);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Reunions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Ajouter une reunion
        </button>
      </div>

      {error ? (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="bg-white rounded border border-gray-200 p-6 text-gray-600">Chargement...</div>
      ) : groupedReunions.length === 0 ? (
        <div className="bg-white rounded border border-gray-200 p-6 text-gray-600">Aucune reunion trouvee.</div>
      ) : (
        <div className="space-y-6">
          {groupedReunions.map((group) => (
            <div key={group.projetId} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">{group.projetName}</h2>
                <span className="text-sm text-gray-500">{group.reunions.length} reunion(s)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Objectif</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Debut</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Fin</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Lieu / Lien</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.reunions.map((reunion) => (
                      <tr key={reunion.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{reunion.objetif || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(reunion.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatTime(reunion.heure_debut)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatTime(reunion.heure_fin)}</td>
                        <td className="px-4 py-3 text-sm text-blue-600">
                          {reunion.lieu_ou_lien?.startsWith("http") ? (
                            <a href={reunion.lieu_ou_lien} target="_blank" rel="noreferrer" className="hover:underline">
                              Ouvrir le lien
                            </a>
                          ) : (
                            reunion.lieu_ou_lien || "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reunion.description || "-"}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(reunion)}
                              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteReunion(reunion.id)}
                              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateReunion} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Ajouter une reunion</h3>
            <input
              type="text"
              name="objetif"
              value={createForm.objetif}
              onChange={handleCreateInputChange}
              placeholder="Objectif"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="date"
                name="date"
                value={createForm.date}
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
              <input
                type="time"
                name="heure_debut"
                value={createForm.heure_debut}
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
              <input
                type="time"
                name="heure_fin"
                value={createForm.heure_fin}
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <input
              type="text"
              name="lieu_ou_lien"
              value={createForm.lieu_ou_lien}
              onChange={handleCreateInputChange}
              placeholder="Lieu physique ou lien visio"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            <textarea
              name="description"
              value={createForm.description}
              onChange={handleCreateInputChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded p-2"
            />
            <select
              name="projet_id"
              value={createForm.projet_id}
              onChange={handleCreateInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Selectionner un projet</option>
              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>
                  {projet.nom}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdateReunion} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Modifier la reunion</h3>
            <input
              type="text"
              name="objetif"
              value={editForm.objetif}
              onChange={handleEditInputChange}
              placeholder="Objectif"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
              <input
                type="time"
                name="heure_debut"
                value={editForm.heure_debut}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
              <input
                type="time"
                name="heure_fin"
                value={editForm.heure_fin}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <input
              type="text"
              name="lieu_ou_lien"
              value={editForm.lieu_ou_lien}
              onChange={handleEditInputChange}
              placeholder="Lieu physique ou lien visio"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditInputChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded p-2"
            />
            <select
              name="projet_id"
              value={editForm.projet_id}
              onChange={handleEditInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Selectionner un projet</option>
              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>
                  {projet.nom}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">
                Mettre a jour
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GestionReunions;
