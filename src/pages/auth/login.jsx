
import { useState ,useEffect} from "react";
import { Input } from "../../components/form/Input"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";


function Login() {
    const navigate = useNavigate();
    const { user} = useAuthStore();

    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, loading, error } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Connexion
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        name="email"
                        label="Adresse email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrer votre adresse mail"
                    />

                    <Input
                        name="password"
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrer votre mot de passe"
                    />

                    <button
                    style={{backgroundColor:"#0B3D91"}}
                        className="w-full text-white p-3 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>

                    {loading && (
                        <p className="text-center text-blue-500">Chargement...</p>
                    )}

                    {error && (
                        <p className="text-center text-red-500">{error}</p>
                    )}
                </form>
            </div>
        </div>
    );

}
export default Login;