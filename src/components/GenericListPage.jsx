import React, { useEffect, useState } from 'react';

const GenericListPage = ({
  title,
  fetchData,
  renderItem,
  emptyMessage = 'Aucune donnée à afficher',
  loadingMessage = 'Chargement en cours...',
  className = '',
  dependencies = [],
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Erreur lors du chargement des données');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return (
    <div className={`generic-list-page ${className}`.trim()}>
      <div className="generic-list-header">
        <h1>{title}</h1>
      </div>

      {loading ? (
        <div className="loading-message">{loadingMessage}</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : items.length === 0 ? (
        <div className="empty-message">{emptyMessage}</div>
      ) : (
        <div className="generic-list-body">{items.map(renderItem)}</div>
      )}
    </div>
  );
};

export default GenericListPage;
