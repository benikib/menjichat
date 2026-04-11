import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/auth/login.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import MainLayout from "../components/MainLayout.jsx";
import RoleProtectedRoute from "../components/RoleProtectedRoute.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

import ListUsersRoles from "../pages/users/ListusersRoles.jsx";
import GestionTachesProjets from "../pages/Projets/GestionTachesProjets.jsx";
import GestionProjets from "../pages/Projets/GestionProjets.jsx";
import ListeTachesandSoustaches from "../pages/myTachesandSoustaches/ListeTachesandSoustaches.jsx";




const router = createBrowserRouter([
    {
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
            { path: "/", element: <Home /> },
            
            { path: "/dashboard", element: <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Bailleur',
                ]}><Home /> </RoleProtectedRoute>},
            {
                path: "/projet",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><GestionProjets /></RoleProtectedRoute>
            }
            ,
            {
                path: "taches/:projetId",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Utilisateur']}><GestionTachesProjets /></RoleProtectedRoute>
            },
            {
                path: "gestionUsers",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><ListUsersRoles /></RoleProtectedRoute>
            },
            {
                path: "listeMyTachesSoustaches",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Utilisateur']}><ListeTachesandSoustaches /></RoleProtectedRoute>
            }


          
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