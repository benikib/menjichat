import { useState, useCallback } from "react";
import { postRequest } from "../services/apiService";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function useAuth() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { user, login: storeLogin, logout: storeLogout,token,role } = useAuthStore();

    let status;
    switch (user) {
        case undefined:
            status = 0;
            break;
        case null:
            status = 1;
            break;
        default:
            status = 2;
    }

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            // Appel API POST via ton service
            const data = await postRequest("login", { email, password });
            storeLogin(data); 
            
            if(data.role && (data.role.includes("Admin") || data.role.includes("SuperAdmin"))  ){
                 navigate("/dashboard");
            }else{
                navigate("/dashboard");
            }
           

        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    }, []);


    const logout = useCallback(async() => {
        try {
        await postRequest("logout", {},token);
        storeLogout();
        window.location.href = "/login";
            
        } catch (err) {
            setError(err.message); 
            storeLogout();
            window.location.href = "/login";
        }
        
        
    }, []);

    return {
        user,
        status,
        loading,
        error,
        login,
        logout,
    };
}

export default useAuth;