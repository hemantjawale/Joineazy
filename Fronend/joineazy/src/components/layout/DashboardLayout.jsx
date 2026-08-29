import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"} flex-1 flex flex-col min-h-screen`}>
        <DashboardHeader />
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-surface-200 py-4 px-6 hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-[8px]">J</span>
              </div>
              <span className="text-xs font-medium text-surface-400">Joineazy</span>
            </div>
            <p className="text-xs text-surface-400">&copy; {new Date().getFullYear()} Joineazy. All rights reserved.</p>
          </div>
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}