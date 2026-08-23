import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const professorLinks = [
  { to: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/professor/assignments", label: "Assignments", icon: FileText },
  { to: "/professor/analytics", label: "Analytics", icon: BarChart3 },
];

const studentLinks = [
  { to: "/student/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/student/assignments", label: "Tasks", icon: BookOpen },
  { to: "/student/groups", label: "Groups", icon: Users },
  { to: "/student/submissions", label: "Status", icon: ClipboardCheck },
];

export default function MobileNav() {
  const { user } = useAuth();
  const links = user?.role === "professor" ? professorLinks : studentLinks;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-surface-200">
      <div className="flex items-center justify-around py-2 px-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary-600"
                  : "text-surface-400 hover:text-surface-600"
              )
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
