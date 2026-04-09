import { useEffect, useState } from "react";
import api from "../../services/api";
 import DataTable from "../../components/table/dataTable";
 import Input from "../../components/form/Input";
 import { NavLink, useNavigate } from "react-router-dom";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function GestionProjets() {

  const [projets, setProjets] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    date_debut: "",
    date_fin: "",
    type: "",
    statut: "En cours",
    chef_projet_id: ""
  });

  // 🔍 debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // 🔄 FETCH
  const fetchProjets = () => {
    api.get("/projets")
      .then(res => setProjets(res.data.projets))
      .catch(console.log);
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  // ✏️ CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ➕ ADD
  const addProjet = (e) => {
    e.preventDefault();

    api.post("/projets", formData)
      .then(() => {
        fetchProjets();
        setShowForm(false);
      });
  };

  // ✏️ EDIT
  const editProjet = (p) => {
    setEditId(p.id);
    setFormData(p);
    setShowForm(true);
  };
  
  const columns = [
    { key: "id", label: "ID", selector: row => row.id, sortable: true },
    { key: "nom", label: "Nom", selector: row => row.nom, sortable: true },
   // { key: "description", label: "Description", selector: row => row.description },
    { key: "date_debut", label: "Date début", selector: row => row.date_debut },
    { key: "date_fin", label: "Date fin", selector: row => row.date_fin },
    { key: "type", label: "Type", selector: row => row.type },
    { key: "statut", label: "Statut", selector: row => row.statut },
    { key: "chef_projet", label: "Chef du projet", selector: row => row.chef_projet ? row.chef_projet.name : "Non assigné" },
  ];

  const actions = [
    { label: "Voir", callback: (p) => navigate(`/taches/${p.id}`) },
    { label: "Modifier", callback: editProjet },
    { label: "Supprimer", callback: (p) => deleteProjet(p.id) },
    // { label: "Taches", callback: (p) => alert(`Taches du projet: ${p.id}`)   },
    // { label: "Conttributeur", callback: (p) => alert(`Conttributeurs du projet: ${p.id}`)   },
  ];


  // 🔄 UPDATE
  const updateProjet = (e) => {
    e.preventDefault();

    api.put(`/projets/${editId}`, formData)
      .then(() => {
        fetchProjets();
        setShowForm(false);
        setEditId(null);
      });
  };

  // 🗑 DELETE
  const deleteProjet = (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;

    api.delete(`/projets/${id}`)
      .then(fetchProjets);
  };

  // 🔍 FILTER
  const filteredProjets = projets.filter(p =>
    `${p.nom} ${p.type} ${p.statut}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Projets</h1>

        <button
          onClick={() => {
            setEditId(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded flex gap-2 items-center"
        >
          <FaPlus /> Ajouter
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Rechercher un projet..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      {/* TABLE */}
      <div className="overflow-x-auto">

          <DataTable
          columns={columns}
          data={projets}
          actions={actions}
        />

      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <form
            onSubmit={editId ? updateProjet : addProjet}
            className="bg-white p-6 rounded w-96 max-h-96 overflow-y-auto"
          >

            <h2 className="text-xl font-bold mb-4">
              {editId ? "Modifier" : "Ajouter"} Projet
            </h2>

            <Input 
              name="nom" 
              placeholder="Nom" 
              value={formData.nom}
              onChange={handleChange} 
              className="border p-2 w-full mb-2" 
            />
            <textarea 
              name="description" 
              placeholder="Description" 
              value={formData.description}
              onChange={handleChange} 
              className="border p-2 w-full m-2" 
            />
            <Input 
              type="date" 
              name="date_debut" 
              value={formData.date_debut}
              onChange={handleChange} 
              className="border p-2 w-full mb-2" 
            />
            <Input 
              type="date" 
              name="date_fin" 
              value={formData.date_fin}
              onChange={handleChange} 
              className="border p-2 w-full mb-2" 
            />

            <Input 
              name="type" 
              placeholder="Type" 
              value={formData.type}
              onChange={handleChange} 
              className="border p-2 w-full mb-2" 
            />

            <select 
              name="statut" 
              value={formData.statut}
              onChange={handleChange} 
              className="border p-2 w-full mb-2"
            >
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>

            <Input 
              name="chef_projet_id" 
              type="number"
              placeholder="ID Chef projet" 
              value={formData.chef_projet_id}
              onChange={handleChange} 
              className="border p-2 w-full mb-4" 
            />

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setFormData({
                    nom: "",
                    description: "",
                    date_debut: "",
                    date_fin: "",
                    type: "",
                    statut: "En cours",
                    chef_projet_id: ""
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>

              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Enregistrer
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default GestionProjets;