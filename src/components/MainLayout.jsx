// MainLayout.jsx
import { Outlet } from "react-router-dom";
import Aside from "../components/partial/aside"; // ton composant Aside

function MainLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Aside />

      {/* Main content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;