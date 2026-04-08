import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/auth/login.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import MainLayout from "../components/MainLayout.jsx";
import RoleProtectedRoute from "../components/RoleProtectedRoute.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";



const router = createBrowserRouter([
    {
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
            { path: "/", element: <Home /> },
            
            { path: "/dashboard", element: <RoleProtectedRoute allowedRoles={['Bailleur',
                    'Gestionnaire']}><Home /> </RoleProtectedRoute>},

          
        ],
    },
    {
        path: "/login",
        element: <Login></Login>
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />
    }

])
export default router;