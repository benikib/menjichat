import React from 'react';

const PaymentsTable = ({ paiements, onEdit, onDelete, onView }) => {
  const getStatutBadge = (statut) => {
    const baseClasses = 'px-3 py-1.5 rounded-full text-xs font-medium';
    if (statut === 'Valide') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Payé</span>;
    } else if (statut === 'Annule') {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Annulé</span>;
    }
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En attente</span>;
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!paiements || paiements.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="border-b border-stroke pb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">Historique des paiements</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Aucun paiement pour cette période</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="border-b border-stroke pb-4 mb-6">
        <h2 className="text-lg font-semibold text-black dark:text-white">Historique des paiements</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {paiements.length} paiement{paiements.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 dark:bg-meta-4">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Location</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Locataire</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Montant</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Mois</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Type de paiement</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Statut</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark">
            {paiements.map((paiement) => (
              <tr key={paiement.id} className="hover:bg-gray-50 dark:hover:bg-meta-4">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {paiement.contrat?.location?.type} - {paiement.contrat?.location?.numero || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {paiement.contrat?.locataire?.prenom} {paiement.contrat?.locataire?.nom || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {formatMontant(paiement.montant)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{paiement.mois_concerne || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{paiement.type_paiement}</td>
                <td className="px-6 py-4">{getStatutBadge(paiement.statut)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(paiement.created_at)}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-3">
                  <button onClick={() => onView(paiement)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400">Voir</button>
                  <button onClick={() => onEdit(paiement)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">Modifier</button>
                  <button onClick={() => onDelete(paiement.id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;