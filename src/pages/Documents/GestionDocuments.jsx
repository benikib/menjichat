import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";

const initialForm = {
  nom: "",
  resume: "",
  projet_id: "",
  fichier: null,
};

function GestionDocuments() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [documents, setDocuments] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [createForm, setCreateForm] = useState(initialForm);
  const [editForm, setEditForm] = useState({
    nom: "",
    resume: "",
    projet_id: "",
  });

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.error || "Impossible de charger les documents.");
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
      await Promise.all([fetchDocuments(), fetchProjets()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const groupedDocuments = useMemo(() => {
    const groupedMap = {};

    documents.forEach((doc) => {
      const projetId = doc.projet_id;
      const projetName = doc?.projet?.nom || `Projet #${projetId}`;
      if (!groupedMap[projetId]) {
        groupedMap[projetId] = {
          projetId,
          projetName,
          documents: [],
        };
      }
      groupedMap[projetId].documents.push(doc);
    });

    return Object.values(groupedMap).sort((a, b) => a.projetName.localeCompare(b.projetName));
  }, [documents]);

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes === 0) return "0 o";
    const units = ["o", "Ko", "Mo", "Go"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** index;
    return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("fr-FR");
  };

  const handleCreateInputChange = (event) => {
    const { name, value, files } = event.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "fichier" ? files?.[0] || null : value,
    }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (document) => {
    setSelectedDocument(document);
    setEditForm({
      nom: document.nom || "",
      resume: document.resume || "",
      projet_id: String(document.projet_id || ""),
    });
    setShowEditModal(true);
  };

  const closeCreateModal = () => {
    setCreateForm(initialForm);
    setShowCreateModal(false);
  };

  const closeEditModal = () => {
    setSelectedDocument(null);
    setShowEditModal(false);
  };

  const handleCreateDocument = async (event) => {
    event.preventDefault();
    setError("");

    if (!user?.id) {
      setError("Utilisateur non charge. Reconnecte-toi puis reessaie.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", createForm.nom);
    formData.append("resume", createForm.resume);
    formData.append("projet_id", createForm.projet_id);
    formData.append("user_id", user.id);
    formData.append("fichier", createForm.fichier);

    try {
      await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchDocuments();
      closeCreateModal();
    } catch (createError) {
      setError(createError?.response?.data?.message || "Echec lors de la creation du document.");
    }
  };

  const handleUpdateDocument = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedDocument?.id) return;

    try {
      await api.put(`/documents/${selectedDocument.id}`, {
        nom: editForm.nom,
        resume: editForm.resume,
        projet_id: editForm.projet_id,
      });
      await fetchDocuments();
      closeEditModal();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || "Echec lors de la mise a jour.");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    const confirmed = window.confirm("Supprimer ce document ?");
    if (!confirmed) return;

    setError("");
    try {
      await api.delete(`/documents/${documentId}`);
      await fetchDocuments();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Echec lors de la suppression.");
    }
  };

  const handleDownloadDocument = async (documentId, documentName) => {
    setError("");
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement("a");
      link.href = url;
      link.setAttribute("download", documentName || "document");
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      if (!token) {
        setError("Session invalide. Reconnecte-toi puis reessaie.");
        return;
      }
      setError(downloadError?.response?.data?.message || "Echec du telechargement.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Documents</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Ajouter un document
        </button>
      </div>

      {error ? (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="bg-white rounded border border-gray-200 p-6 text-gray-600">Chargement...</div>
      ) : groupedDocuments.length === 0 ? (
        <div className="bg-white rounded border border-gray-200 p-6 text-gray-600">Aucun document trouve.</div>
      ) : (
        <div className="space-y-6">
          {groupedDocuments.map((group) => (
            <div key={group.projetId} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">{group.projetName}</h2>
                <span className="text-sm text-gray-500">{group.documents.length} document(s)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Nom</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Resume</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Taille</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Cree le</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.documents.map((doc) => (
                      <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.nom}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{doc.resume || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 uppercase">{doc.type_fichier || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatBytes(doc.taille)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.created_at)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownloadDocument(doc.id, doc.nom)}
                              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Telecharger
                            </button>
                            <button
                              onClick={() => openEditModal(doc)}
                              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
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
          <form onSubmit={handleCreateDocument} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Ajouter un document</h3>
            <input
              type="text"
              name="nom"
              value={createForm.nom}
              onChange={handleCreateInputChange}
              placeholder="Nom du document"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            <textarea
              name="resume"
              value={createForm.resume}
              onChange={handleCreateInputChange}
              placeholder="Resume"
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
            <input
              type="file"
              name="fichier"
              onChange={handleCreateInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
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
          <form onSubmit={handleUpdateDocument} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Modifier le document</h3>
            <input
              type="text"
              name="nom"
              value={editForm.nom}
              onChange={handleEditInputChange}
              placeholder="Nom du document"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            <textarea
              name="resume"
              value={editForm.resume}
              onChange={handleEditInputChange}
              placeholder="Resume"
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

export default GestionDocuments;
