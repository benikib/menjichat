import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useAuthStore from "../../store/useAuthStore";

function Aside() {
  const { role, loadUserFromStorage} = useAuthStore();
  const { logout, error } = useAuth();

  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const asideRef = useRef(null);

  useEffect(() => {
    loadUserFromStorage();

    const saved = localStorage.getItem("selected");
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selected", JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (asideRef.current && !asideRef.current.contains(event.target)) {
        setSidebarToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
  };

  const linkClass = (item) =>
    `block rounded py-2 px-4 ${
      selected === item
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <aside
      ref={asideRef}
      className={`absolute left-0 top-0 z-50 flex min-h-screen w-64 flex-col bg-black duration-300 lg:static lg:translate-x-0 ${
        sidebarToggle ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {error}

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
        <span className="text-white font-bold text-lg">LOGO</span>
        <button 
          onClick={() => setSidebarToggle(!sidebarToggle)}
          className="lg:hidden text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-5 px-4 flex flex-col flex-1">
        <ul className="flex flex-col gap-2">

          {/* Dashboard */}
          {(role.includes("admin") || role.includes("SuperAdmin")) && (
          
          <li>
              <NavLink
                to="/dashboard"
                onClick={() => handleSelect("Dashboard")}
                className={linkClass("Dashboard")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </div>
              </NavLink>
            </li>

            
          )}
       {(role.includes("Admin") || role.includes("SuperAdmin")) && (
            <li>
              <NavLink
                to="/Rapport"
                onClick={() => handleSelect("Rapport")}
                className={linkClass("Rapport")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Rapport
                </div>
              </NavLink>
            </li>
          )}
          {/* Agence */}
          {(role.includes("Admin") || role.includes("SuperAdmin")) && (
            <li>
              <NavLink
                to="/Projet"
                onClick={() => handleSelect("Projet")}
                className={linkClass("Projet")}
              >
                <div className="flex items-center"> 
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 012-2h6M9 19h6m-6 0l-3.5 3.5M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Projet
                </div>
              </NavLink>
            </li>
          )}
         


             {(role.includes("Admin") || role.includes("SuperAdmin")) && (
            <li>
              <NavLink
                to="/listeMyTachesSoustaches"
                onClick={() => handleSelect("Taches")}
                className={linkClass("Taches")}
              >
                <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                 Mes  Taches
                </div>
              </NavLink>
            </li>
          )}
   {(role.includes("Admin") || role.includes("SuperAdmin")) && (
            <li>
              <NavLink
                to="/Documents"
                onClick={() => handleSelect("Documents")}
                className={linkClass("Documents")}
              >
                <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Documents
                </div>
              </NavLink>
            </li>
          )}
          {/* Reunion */}
          {(role.includes("Admin") || role.includes("SuperAdmin")) && (
            <li>
              <NavLink
                to="/reunions"
                onClick={() => handleSelect("reunions")}
                className={linkClass("reunions")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Reunion
                </div>
              </NavLink>
            </li>
          )}
          {(role.includes("Admin") || role.includes("SuperAdmin") || role.includes("Utilisateur")) && (
            <li>
              <NavLink
                to="/chats"
                onClick={() => handleSelect("chats")}
                className={linkClass("chats")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
                  </svg>
                  Chats
                </div>
              </NavLink>
            </li>
          )}



          {/* Utilisateurs */}
          {(role.includes("Admin") || role.includes("SuperAdmin")) && (
            <li>
              <NavLink
                to="/gestionUsers"
                onClick={() => handleSelect("gestionUsers")}
                className={linkClass("gestionUsers")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Utilisateurs
                </div>
              </NavLink>
            </li>
          )}

         

          {/* Mes locations */}
          {(role.includes("Gestionnaire") || role.includes("Bailleur")) && (
            <li>
              <NavLink
                to="/locations"
                onClick={() => handleSelect("locations")}
                className={linkClass("locations")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Mes locations
                </div>
              </NavLink>
            </li>
          )}

          {/* Mes contrats */}
          {(role.includes("Gestionnaire") || role.includes("Bailleur")) && (
            <li>
              <NavLink
                to="/contrats"
                onClick={() => handleSelect("contrats")}
                className={linkClass("contrats")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Mes contrats
                </div>
              </NavLink>
            </li>
          )}
      
          {/* Paiements */}
          {(role.includes("Gestionnaire") || role.includes("Bailleur")) && (
            <li>
              <NavLink
                to="/paiements"
                onClick={() => handleSelect("paiements")}
                className={linkClass("paiements")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Paiements
                </div>
              </NavLink>
            </li>
          )}

          {/* Mes gestionnaires (pour Bailleur) */}
          {(role.includes("Bailleur")) && (
            <li>
              <NavLink
                to="/bailleurs/gestionnaires"
                onClick={() => handleSelect("gestionnaire")}
                className={linkClass("gestionnaire")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Mes gestionnaires
                </div>
              </NavLink>
            </li>
          )}
        </ul>

        {/* LOGOUT */}
        <div className="mt-auto pt-6 pb-4">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition disabled:bg-gray-400 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Aside;