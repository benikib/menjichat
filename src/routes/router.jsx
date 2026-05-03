import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/auth/login.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import MainLayout from "../components/MainLayout.jsx";
import RoleProtectedRoute from "../components/RoleProtectedRoute.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

import ListUsersRoles from "../pages/users/ListusersRoles.jsx";
import GestionTachesProjets from "../pages/Projets/GestionTachesProjets.jsx";
import GestionProjets from "../pages/Projets/GestionProjets.jsx";
import ListeTachesandSoustaches from "../pages/myTachesandSoustaches/ListeTachesandSoustaches.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Rapport from "../pages/Rapport.jsx";
import GestionDocuments from "../pages/Documents/GestionDocuments.jsx";
import GestionReunions from "../pages/Reunions/GestionReunions.jsx";
import GestionChatsMessages from "../pages/Chats/GestionChatsMessages.jsx";




const router = createBrowserRouter([
    {
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
            { path: "/", element: <Dashboard /> },
            
            { path: "/dashboard", element: <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Bailleur',
                ]}><Dashboard /> </RoleProtectedRoute>},
            {
                path: "/projet",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><GestionProjets /></RoleProtectedRoute>
            }
            ,
            {
                path: "Rapport",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><Rapport /></RoleProtectedRoute>
            },
            {
                path: "projets/:projetId",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Utilisateur']}><GestionTachesProjets /></RoleProtectedRoute>
            },
            {
                path: "gestionUsers",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><ListUsersRoles /></RoleProtectedRoute>
            },
            {
                path: "listeMyTachesSoustaches",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Utilisateur']}><ListeTachesandSoustaches /></RoleProtectedRoute>
            },
            {
                path: "Documents",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><GestionDocuments /></RoleProtectedRoute>
            },
            {
                path: "reunions",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><GestionReunions /></RoleProtectedRoute>
            },
            {
                path: "reunion",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}><GestionReunions /></RoleProtectedRoute>
            },
            {
                path: "chats",
                element: <RoleProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Utilisateur']}><GestionChatsMessages /></RoleProtectedRoute>
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