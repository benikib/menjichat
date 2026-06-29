import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Réinitialisation du mot de passe</h2>

        {submitted ? (
          <div className="space-y-4">
            <p className="text-green-600">
              Si cette adresse email existe, un lien de réinitialisation a été envoyé.
            </p>
            <Link
              className="block text-center text-blue-600 hover:text-blue-800"
              to="/login"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              Envoyer le lien de réinitialisation
            </button>

            <div className="text-right">
              <Link className="text-sm text-blue-600 hover:text-blue-800" to="/login">
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
