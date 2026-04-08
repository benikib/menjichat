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
          {(role === "Gestionnaire" || role === "Bailleur") && (
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

          {/* Agence */}
          {(role === "Admin" || role === "SuperAdmin") && (
            <li>
              <NavLink
                to="/agence"
                onClick={() => handleSelect("Agence")}
                className={linkClass("Agence")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Agence
                </div>
              </NavLink>
            </li>
          )}

          {/* Gestion des bailleurs */}
          {(role === "Admin" || role === "SuperAdmin") && (
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
                  Gestion des bailleurs
                </div>
              </NavLink>
            </li>
          )}

          {/* Mes biens */}
          {(role === "Gestionnaire" || role === "Bailleur") && (
            <li>
              <NavLink
                to="/biens"
                onClick={() => handleSelect("biens")}
                className={linkClass("biens")}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Mes biens
                </div>
              </NavLink>
            </li>
          )}

          {/* Mes locations */}
          {(role === "Gestionnaire" || role === "Bailleur") && (
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
          {(role === "Gestionnaire" || role === "Bailleur") && (
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
          {(role === "Gestionnaire" || role === "Bailleur") && (
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
          {(role === "Bailleur") && (
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