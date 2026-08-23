import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  LogOut,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const professorLinks = [
  { to: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/professor/assignments", label: "Assignments", icon: FileText },
  { to: "/professor/analytics", label: "Analytics", icon: BarChart3 },
];

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/assignments", label: "Assignments", icon: BookOpen },
  { to: "/student/groups", label: "My Groups", icon: Users },
  { to: "/student/submissions", label: "Submissions", icon: ClipboardCheck },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "professor" ? professorLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-surface-200 fixed left-0 top-0 z-40">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-200">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <span className="text-white font-bold text-sm">J</span>
        </div>
        <span className="text-xl font-bold text-surface-900 tracking-tight">Joineazy</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-800"
              )
            }
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={user?.name || "User"} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-surface-500 hover:text-danger hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
