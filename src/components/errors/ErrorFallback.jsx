

 function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded">
      <h2 className="font-bold text-red-700">Une erreur est survenue</h2>

      <p className="text-sm text-red-600 mt-2">
        {error?.message || "Impossible de charger les données"}
      </p>

      <button
        onClick={resetErrorBoundary}
        className="mt-3 px-3 py-1 bg-red-600 text-white rounded"
      >
        Réessayer
      </button>
    </div>
  );
}
export default ErrorFallback;