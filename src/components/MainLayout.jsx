// MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Aside from "../components/partial/aside"; // ton composant Aside

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-50 inline-flex items-center rounded-lg bg-black p-2 text-white shadow-lg lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-col lg:flex-row">
        <Aside isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <main className="flex-1 min-w-0 bg-gray-100 p-4 pt-16 sm:p-6 lg:p-8 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;