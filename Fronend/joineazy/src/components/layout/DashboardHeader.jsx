import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Bell, LogOut, ChevronLeft } from "lucide-react";

const pageTitles = {
  "/professor/dashboard": "Dashboard",
  "/professor/assignments": "Assignments",
  "/professor/assignments/new": "New Assignment",
  "/professor/analytics": "Analytics",
  "/professor/groups": "Groups",
  "/professor/students": "Students",
  "/student/dashboard": "Dashboard",
  "/student/assignments": "Assignments",
  "/student/groups": "My Groups",
  "/student/submissions": "Submissions",
};

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathBase = location.pathname.replace(/\/[a-f0-9-]{36,}.*$/, "").replace(/\/new$/, "/new").replace(/\/edit$/, "");
  const title = pageTitles[pathBase] || "Joineazy";

  const isSubPage =
    location.pathname.split("/").length > 3 &&
    !Object.keys(pageTitles).includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          {isSubPage && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors cursor-pointer lg:hidden"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-base font-semibold text-surface-900 lg:hidden">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors cursor-pointer relative">
            <Bell size={18} />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-surface-200">
            <Avatar name={user?.name || "User"} size="sm" />
            <div className="hidden md:block">
              <p className="text-xs font-medium text-surface-800 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-surface-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
