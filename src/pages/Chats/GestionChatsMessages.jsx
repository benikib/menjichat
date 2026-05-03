import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";

const initialChatForm = {
  nom: "",
  categorie_chat_id: "",
  projet_id: "",
};

const initialMessageForm = {
  contenu: "",
  type: "text",
  statut: "envoye",
};

function GestionChatsMessages() {
  const user = useAuthStore((state) => state.user);

  const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedChat, setSelectedChat] = useState(null);

  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [showEditChatModal, setShowEditChatModal] = useState(false);
  const [editingChat, setEditingChat] = useState(null);
  const [chatCreateForm, setChatCreateForm] = useState(initialChatForm);
  const [chatEditForm, setChatEditForm] = useState(initialChatForm);

  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false);
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageCreateForm, setMessageCreateForm] = useState(initialMessageForm);
  const [messageEditForm, setMessageEditForm] = useState(initialMessageForm);

  const fetchChats = async () => {
    const response = await api.get("/chats");
    setChats(Array.isArray(response.data) ? response.data : []);
  };

  const fetchMessages = async () => {
    const response = await api.get("/messages");
    setMessages(Array.isArray(response.data) ? response.data : []);
  };

  const fetchProjets = async () => {
    const response = await api.get("/projets");
    setProjets(Array.isArray(response?.data?.projets) ? response.data.projets : []);
  };

  const fetchCategories = async () => {
    const candidates = ["/categorie-chats", "/categorie_chats", "/categories-chats"];
    for (const endpoint of candidates) {
      try {
        const response = await api.get(endpoint);
        const payload = response?.data;
        if (Array.isArray(payload)) {
          setCategories(payload);
          return;
        }
        if (Array.isArray(payload?.categorie_chats)) {
          setCategories(payload.categorie_chats);
          return;
        }
      } catch (_) {
        // Essaie endpoint suivant
      }
    }
    setCategories([]);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([fetchProjets(), fetchChats(), fetchMessages(), fetchCategories()]);
      } catch (loadError) {
        setError(loadError?.response?.data?.message || "Impossible de charger les chats/messages.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const chatsByProject = useMemo(() => {
    const grouped = {};
    chats.forEach((chat) => {
      const projetId = chat.projet_id;
      const projetNom = chat?.projet?.nom || `Projet #${projetId}`;
      if (!grouped[projetId]) {
        grouped[projetId] = { projetId, projetNom, chats: [] };
      }
      grouped[projetId].chats.push(chat);
    });
    return Object.values(grouped).sort((a, b) => a.projetNom.localeCompare(b.projetNom));
  }, [chats]);

  const messagesOfSelectedChat = useMemo(() => {
    if (!selectedChat?.id) return [];
    return messages
      .filter((msg) => Number(msg.chat_id) === Number(selectedChat.id))
      .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  }, [messages, selectedChat]);

  const handleChatFormChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleMessageFormChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const closeChatCreate = () => {
    setShowCreateChatModal(false);
    setChatCreateForm(initialChatForm);
  };

  const closeChatEdit = () => {
    setShowEditChatModal(false);
    setEditingChat(null);
    setChatEditForm(initialChatForm);
  };

  const closeMessageCreate = () => {
    setShowCreateMessageModal(false);
    setMessageCreateForm(initialMessageForm);
  };

  const closeMessageEdit = () => {
    setShowEditMessageModal(false);
    setEditingMessage(null);
    setMessageEditForm(initialMessageForm);
  };

  const openChatEdit = (chat) => {
    setEditingChat(chat);
    setChatEditForm({
      nom: chat.nom || "",
      categorie_chat_id: chat.categorie_chat_id ? String(chat.categorie_chat_id) : "",
      projet_id: chat.projet_id ? String(chat.projet_id) : "",
    });
    setShowEditChatModal(true);
  };

  const openMessageEdit = (message) => {
    setEditingMessage(message);
    setMessageEditForm({
      contenu: message.contenu || "",
      type: message.type || "text",
      statut: message.statut || "envoye",
    });
    setShowEditMessageModal(true);
  };

  const createChat = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/chats", chatCreateForm);
      await fetchChats();
      closeChatCreate();
    } catch (createError) {
      setError(createError?.response?.data?.message || "Echec de creation du chat.");
    }
  };

  const updateChat = async (event) => {
    event.preventDefault();
    if (!editingChat?.id) return;
    setError("");
    try {
      await api.put(`/chats/${editingChat.id}`, chatEditForm);
      await fetchChats();
      closeChatEdit();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || "Echec de mise a jour du chat.");
    }
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm("Supprimer ce chat ?")) return;
    setError("");
    try {
      await api.delete(`/chats/${chatId}`);
      await Promise.all([fetchChats(), fetchMessages()]);
      if (selectedChat?.id === chatId) setSelectedChat(null);
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Echec de suppression du chat.");
    }
  };

  const createMessage = async (event) => {
    event.preventDefault();
    if (!selectedChat?.id) return;
    if (!user?.id) {
      setError("Utilisateur non charge. Reconnecte-toi puis reessaie.");
      return;
    }
    setError("");
    try {
      await api.post("/messages", {
        ...messageCreateForm,
        chat_id: selectedChat.id,
        user_id: user.id,
      });
      await fetchMessages();
      closeMessageCreate();
    } catch (createError) {
      setError(createError?.response?.data?.message || "Echec de creation du message.");
    }
  };

  const updateMessage = async (event) => {
    event.preventDefault();
    if (!editingMessage?.id) return;
    setError("");
    try {
      await api.put(`/messages/${editingMessage.id}`, messageEditForm);
      await fetchMessages();
      closeMessageEdit();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || "Echec de mise a jour du message.");
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    setError("");
    try {
      await api.delete(`/messages/${messageId}`);
      await fetchMessages();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Echec de suppression du message.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion Chats & Messages</h1>
        <button onClick={() => setShowCreateChatModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Ajouter un chat
        </button>
      </div>

      {error ? <div className="p-3 rounded bg-red-100 text-red-700 border border-red-200">{error}</div> : null}

      {loading ? (
        <div className="bg-white rounded border border-gray-200 p-6 text-gray-600">Chargement...</div>
      ) : (
        <div className="space-y-6">
          {chatsByProject.length === 0 ? (
            <div className="bg-white rounded border border-gray-200 p-6 text-gray-600">Aucun chat trouve.</div>
          ) : (
            chatsByProject.map((group) => (
              <div key={group.projetId} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">{group.projetNom}</h2>
                  <span className="text-sm text-gray-500">{group.chats.length} chat(s)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Nom</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Categorie</th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.chats.map((chat) => (
                        <tr key={chat.id} className={`border-t border-gray-100 ${selectedChat?.id === chat.id ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                          <td className="px-4 py-3 text-sm text-gray-700">{chat.nom}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{chat?.categorie_chat?.nom || chat?.categorieChat?.nom || chat.categorie_chat_id || "-"}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedChat(chat)} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
                                Ouvrir
                              </button>
                              <button onClick={() => openChatEdit(chat)} className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600">
                                Modifier
                              </button>
                              <button onClick={() => deleteChat(chat.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">
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
            ))
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Messages {selectedChat ? `- ${selectedChat.nom}` : ""}
              </h2>
              <button
                onClick={() => setShowCreateMessageModal(true)}
                disabled={!selectedChat}
                className="bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Ajouter un message
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Contenu</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Utilisateur</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedChat ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-sm text-gray-500 text-center">
                        Selectionne un chat pour voir ses messages.
                      </td>
                    </tr>
                  ) : messagesOfSelectedChat.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-sm text-gray-500 text-center">
                        Aucun message dans ce chat.
                      </td>
                    </tr>
                  ) : (
                    messagesOfSelectedChat.map((message) => (
                      <tr key={message.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{message.contenu}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{message.type || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{message.statut || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{message?.user?.name || message.user_id || "-"}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button onClick={() => openMessageEdit(message)} className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600">
                              Modifier
                            </button>
                            <button onClick={() => deleteMessage(message.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showCreateChatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={createChat} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Ajouter un chat</h3>
            <input type="text" name="nom" value={chatCreateForm.nom} onChange={handleChatFormChange(setChatCreateForm)} placeholder="Nom du chat" className="w-full border border-gray-300 rounded p-2" required />
            <select name="projet_id" value={chatCreateForm.projet_id} onChange={handleChatFormChange(setChatCreateForm)} className="w-full border border-gray-300 rounded p-2" required>
              <option value="">Selectionner un projet</option>
              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>{projet.nom}</option>
              ))}
            </select>
            <select name="categorie_chat_id" value={chatCreateForm.categorie_chat_id} onChange={handleChatFormChange(setChatCreateForm)} className="w-full border border-gray-300 rounded p-2" required>
              <option value="">Selectionner une categorie</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>{categorie.nom || `Categorie #${categorie.id}`}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeChatCreate} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {showEditChatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={updateChat} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Modifier le chat</h3>
            <input type="text" name="nom" value={chatEditForm.nom} onChange={handleChatFormChange(setChatEditForm)} placeholder="Nom du chat" className="w-full border border-gray-300 rounded p-2" required />
            <select name="projet_id" value={chatEditForm.projet_id} onChange={handleChatFormChange(setChatEditForm)} className="w-full border border-gray-300 rounded p-2" required>
              <option value="">Selectionner un projet</option>
              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>{projet.nom}</option>
              ))}
            </select>
            <select name="categorie_chat_id" value={chatEditForm.categorie_chat_id} onChange={handleChatFormChange(setChatEditForm)} className="w-full border border-gray-300 rounded p-2" required>
              <option value="">Selectionner une categorie</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>{categorie.nom || `Categorie #${categorie.id}`}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeChatEdit} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">Mettre a jour</button>
            </div>
          </form>
        </div>
      )}

      {showCreateMessageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={createMessage} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Ajouter un message</h3>
            <textarea name="contenu" value={messageCreateForm.contenu} onChange={handleMessageFormChange(setMessageCreateForm)} placeholder="Contenu du message" className="w-full border border-gray-300 rounded p-2" required />
            <select name="type" value={messageCreateForm.type} onChange={handleMessageFormChange(setMessageCreateForm)} className="w-full border border-gray-300 rounded p-2" required>
              <option value="text">text</option>
              <option value="image">image</option>
              <option value="file">file</option>
            </select>
            <input type="text" name="statut" value={messageCreateForm.statut} onChange={handleMessageFormChange(setMessageCreateForm)} placeholder="Statut (ex: envoye, lu)" className="w-full border border-gray-300 rounded p-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeMessageCreate} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {showEditMessageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={updateMessage} className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Modifier le message</h3>
            <textarea name="contenu" value={messageEditForm.contenu} onChange={handleMessageFormChange(setMessageEditForm)} placeholder="Contenu du message" className="w-full border border-gray-300 rounded p-2" required />
            <select name="type" value={messageEditForm.type} onChange={handleMessageFormChange(setMessageEditForm)} className="w-full border border-gray-300 rounded p-2" required>
              <option value="text">text</option>
              <option value="image">image</option>
              <option value="file">file</option>
            </select>
            <input type="text" name="statut" value={messageEditForm.statut} onChange={handleMessageFormChange(setMessageEditForm)} placeholder="Statut (ex: envoye, lu)" className="w-full border border-gray-300 rounded p-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeMessageEdit} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">Mettre a jour</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GestionChatsMessages;
