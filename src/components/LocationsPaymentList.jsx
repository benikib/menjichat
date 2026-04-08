import React from 'react';

const LocationsPaymentList = ({ locations, onPay, immobilier }) => {
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  const getStatutBadge = (statut) => {
    const baseClasses = 'px-3 py-1.5 rounded-full text-sm font-medium';
    switch(statut) {
      case 'Disponible':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Disponible</span>;
      case 'Occupee':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Occupée</span>;
      case 'Maintenance':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Maintenance</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{statut}</span>;
    }
  };

  if (!locations || locations.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="border-b border-stroke pb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">Locations de {immobilier?.nom}</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Aucune location trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="border-b border-stroke pb-4 mb-6">
        <h2 className="text-lg font-semibold text-black dark:text-white">Locations de {immobilier?.nom}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{locations.length} location{locations.length > 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {locations.map((location) => (
          <div key={location.id} className="rounded-lg border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">Location #{location.numero}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Type: {location.type}</p>
              </div>
              {getStatutBadge(location.statut)}
            </div>

            <div className="space-y-2 mb-5">
              <p className="text-sm text-black dark:text-white"><span className="font-medium">Surface:</span> {location.surface} m²</p>
              <p className="text-sm text-black dark:text-white"><span className="font-medium">Prix base:</span> {formatMontant(location.prix_base)}</p>
              {location.contrat_actif ? (
                <>
                  <p className="text-sm text-green-600 font-medium">✓ Contrat actif #{location.contrat_actif.id}</p>
                  <p className="text-sm text-black dark:text-white"><span className="font-medium">Loyer:</span> {formatMontant(location.contrat_actif.montant_loyer)}</p>
                  <p className="text-sm text-black dark:text-white"><span className="font-medium">Locataire:</span> {location.contrat_actif.locataire?.prenom} {location.contrat_actif.locataire?.nom}</p>
                </>
              ) : (
                <p className="text-sm text-red-600 font-medium">⚠ Aucun contrat actif</p>
              )}
            </div>

            <button
              onClick={() => onPay(location)}
              disabled={!location.contrat_actif}
              className={`w-full px-5 py-2.5 rounded-lg font-medium transition focus:outline-none ${
                location.contrat_actif
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-black opacity-50 cursor-not-allowed'
              }`}
            >
              {location.contrat_actif ? 'Payer' : 'Non disponible'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsPaymentList;