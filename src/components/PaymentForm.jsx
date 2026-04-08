import React, { useState, useEffect } from 'react';

const PaymentForm = ({ 
  initialData = null, 
  locationData = null,
  contratData = null,
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    contrat_id: contratData?.id || initialData?.contrat_id || '',
    montant: contratData?.montant_loyer || initialData?.montant || '',
    type_paiement: initialData?.type_paiement || 'Loyer',
    mode_paiement: initialData?.mode_paiement || 'Espece',
    reference: initialData?.reference || '',
    mois_concerne: initialData?.mois_concerne || '',
    statut: initialData?.statut || 'Valide'
  });

  const [errors, setErrors] = useState({});

  const moisList = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        contrat_id: initialData.contrat_id || '',
        montant: initialData.montant || '',
        type_paiement: initialData.type_paiement || 'Loyer',
        mode_paiement: initialData.mode_paiement || 'Espece',
        reference: initialData.reference || '',
        mois_concerne: initialData.mois_concerne || '',
        statut: initialData.statut || 'Valide'
      });
    } else if (!initialData && !formData.mois_concerne && contratData) {
      setFormData(prev => ({
        ...prev,
        contrat_id: contratData.id,
        montant: contratData.montant_loyer || '',
        mois_concerne: moisList[new Date().getMonth()]
      }));
    } else if (!initialData && !formData.mois_concerne) {
      setFormData(prev => ({
        ...prev,
        mois_concerne: moisList[new Date().getMonth()]
      }));
    }
  }, [initialData, contratData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.contrat_id) newErrors.contrat_id = 'Le contrat est requis';
    if (!formData.montant || parseFloat(formData.montant) <= 0) newErrors.montant = 'Le montant doit être > 0';
    if (!formData.type_paiement) newErrors.type_paiement = 'Type requis';
    if (!formData.mode_paiement) newErrors.mode_paiement = 'Mode requis';
    if (!formData.mois_concerne) newErrors.mois_concerne = 'Mois requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const inputClasses = "w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary";
  const errorClasses = "w-full rounded-lg border-[1.5px] border-red-500 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-red-500 active:border-red-500";
  const labelClasses = "block mb-2 text-sm font-medium text-black dark:text-white";

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (validateForm()) onSubmit(formData); }} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-5 dark:border-strokedark">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {initialData ? 'Modifier' : 'Nouveau'} paiement
        </h2>
        {locationData && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Location #{locationData.numero} - {locationData.type} ({locationData.surface} m²)
          </p>
        )}
        {initialData && (
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            Modification du paiement #{initialData.id}
          </p>
        )}
      </div>

      <div className="p-7">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* Montant */}
          <div>
            <label className={labelClasses}>
              Montant (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              min="0"
              step="100"
              className={errors.montant ? errorClasses : inputClasses}
              placeholder="Ex: 150000"
            />
            {errors.montant && <p className="mt-1.5 text-sm text-red-500">{errors.montant}</p>}
          </div>

          {/* Type */}
          <div>
            <label className={labelClasses}>
              Type <span className="text-red-500">*</span>
            </label>
            <select 
              name="type_paiement" 
              value={formData.type_paiement} 
              onChange={handleChange} 
              className={errors.type_paiement ? errorClasses : inputClasses}
            >
              <option value="Loyer">Loyer</option>
              <option value="Garantie">Garantie</option>
              <option value="Charge">Charge</option>
              <option value="Penalite">Pénalité</option>
            </select>
            {errors.type_paiement && <p className="mt-1.5 text-sm text-red-500">{errors.type_paiement}</p>}
          </div>

          {/* Mode */}
          <div>
            <label className={labelClasses}>
              Mode <span className="text-red-500">*</span>
            </label>
            <select 
              name="mode_paiement" 
              value={formData.mode_paiement} 
              onChange={handleChange} 
              className={errors.mode_paiement ? errorClasses : inputClasses}
            >
              <option value="Espece">Espèces</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Banque">Banque</option>
            </select>
            {errors.mode_paiement && <p className="mt-1.5 text-sm text-red-500">{errors.mode_paiement}</p>}
          </div>

          {/* Référence */}
          <div>
            <label className={labelClasses}>Référence</label>
            <input 
              type="text" 
              name="reference" 
              value={formData.reference} 
              onChange={handleChange} 
              className={inputClasses} 
              placeholder="Numéro de transaction"
            />
          </div>

          {/* Mois concerné */}
          <div>
            <label className={labelClasses}>
              Mois concerné <span className="text-red-500">*</span>
            </label>
            <select 
              name="mois_concerne" 
              value={formData.mois_concerne} 
              onChange={handleChange} 
              className={errors.mois_concerne ? errorClasses : inputClasses}
            >
              <option value="">Sélectionner un mois</option>
              {moisList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.mois_concerne && <p className="mt-1.5 text-sm text-red-500">{errors.mois_concerne}</p>}
          </div>

          {/* Statut */}
          <div>
            <label className={labelClasses}>Statut</label>
            <select 
              name="statut" 
              value={formData.statut} 
              onChange={handleChange} 
              className={inputClasses}
            >
              <option value="Valide">Valide (Payé)</option>
              <option value="Annule">Annulé</option>
            </select>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-4 pt-8 border-t border-stroke mt-6">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-2.5 rounded-lg font-medium transition focus:outline-none bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 rounded-lg font-medium transition focus:outline-none bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier' : 'Enregistrer')}
          </button>
        </div>

        {/* Zone d'information */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950">
          <h3 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-3">Informations</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1.5">
            <li className="flex items-start"><span className="mr-2">•</span>Les champs marqués d'un astérisque (*) sont obligatoires</li>
            <li className="flex items-start"><span className="mr-2">•</span>Le montant doit être saisi en USD</li>
            <li className="flex items-start"><span className="mr-2">•</span>La référence peut être le numéro de transaction</li>
            <li className="flex items-start"><span className="mr-2">•</span>Le mois concerné est le mois du paiement</li>
          </ul>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;