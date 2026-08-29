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
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const professorLinks = [
  { to: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/professor/assignments", label: "Assignments", icon: FileText },
  { to: "/professor/groups", label: "Groups", icon: Users },
  { to: "/professor/students", label: "Students", icon: GraduationCap },
  { to: "/professor/analytics", label: "Analytics", icon: BarChart3 },
];

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/assignments", label: "Assignments", icon: BookOpen },
  { to: "/student/groups", label: "My Groups", icon: Users },
  { to: "/student/submissions", label: "Submissions", icon: ClipboardCheck },
  { to: "/student/calendar", label: "Calendar", icon: Calendar },
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "professor" ? professorLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-screen bg-white border-r border-surface-200 fixed left-0 top-0 z-40 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "flex items-center py-5 border-b border-surface-200 relative h-[72px]",
        isCollapsed ? "justify-center px-0" : "px-6 gap-3"
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">J</span>
        </div>
        {!isCollapsed && <span className="text-xl font-bold text-surface-900 tracking-tight">Joineazy</span>}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-surface-500 hover:text-primary hover:border-primary shadow-sm z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            title={isCollapsed ? link.label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                isCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3",
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-800"
              )
            }
          >
            <link.icon size={20} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={cn(
        "border-t border-surface-200 transition-all duration-300",
        isCollapsed ? "p-3 flex flex-col items-center gap-4" : "p-4"
      )}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user?.name || "User"} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
              <p className="text-xs text-surface-400 capitalize">{user?.role}</p>
            </div>
          </div>
        ) : (
          <Avatar name={user?.name || "User"} size="sm" />
        )}
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={cn(
            "flex items-center text-sm text-surface-500 hover:text-danger hover:bg-red-50 transition-colors cursor-pointer rounded-lg",
            isCollapsed ? "justify-center p-2 w-full" : "px-3 py-2 gap-2 w-full"
          )}
        >
          <LogOut size={16} className="shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}