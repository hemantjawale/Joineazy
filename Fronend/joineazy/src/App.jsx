import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import ProfessorDashboard from "@/pages/professor/ProfessorDashboard";
import AssignmentList from "@/pages/professor/AssignmentList";
import AssignmentForm from "@/pages/professor/AssignmentForm";
import AssignmentDetail from "@/pages/professor/AssignmentDetail";
import ProfessorAnalytics from "@/pages/professor/ProfessorAnalytics";
import ProfessorGroups from "@/pages/professor/ProfessorGroups";
import ProfessorGroupDetail from "@/pages/professor/ProfessorGroupDetail";
import ProfessorStudents from "@/pages/professor/ProfessorStudents";
import StudentReportCard from "@/pages/professor/StudentReportCard";

import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentAssignments from "@/pages/student/StudentAssignments";
import StudentAssignmentDetail from "@/pages/student/StudentAssignmentDetail";
import GroupList from "@/pages/student/GroupList";
import GroupDetail from "@/pages/student/GroupDetail";
import StudentSubmissions from "@/pages/student/StudentSubmissions";
import CalendarView from "@/pages/student/CalendarView";

function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (user) {
    const dashboard = user.role === "professor" ? "/professor/dashboard" : "/student/dashboard";
    return <Navigate to={dashboard} state={{ from: location }} />;
  }

  return children;
}

function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    const dashboard = user.role === "professor" ? "/professor/dashboard" : "/student/dashboard";
    return <Navigate to={dashboard} state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RequireGuest><Landing /></RequireGuest>} />

        <Route element={<RequireGuest><AuthLayout /></RequireGuest>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth role="professor"><DashboardLayout /></RequireAuth>}>
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/professor/assignments" element={<AssignmentList />} />
          <Route path="/professor/assignments/new" element={<AssignmentForm />} />
          <Route path="/professor/assignments/:id" element={<AssignmentDetail />} />
          <Route path="/professor/assignments/:id/edit" element={<AssignmentForm />} />
          <Route path="/professor/analytics" element={<ProfessorAnalytics />} />
          <Route path="/professor/groups" element={<ProfessorGroups />} />
          <Route path="/professor/groups/:id" element={<ProfessorGroupDetail />} />
          <Route path="/professor/students" element={<ProfessorStudents />} />
          <Route path="/professor/students/:id/report" element={<StudentReportCard />} />
        </Route>

        <Route element={<RequireAuth role="student"><DashboardLayout /></RequireAuth>}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/assignments/:id" element={<StudentAssignmentDetail />} />
          <Route path="/student/groups" element={<GroupList />} />
          <Route path="/student/groups/:id" element={<GroupDetail />} />
          <Route path="/student/submissions" element={<StudentSubmissions />} />
          <Route path="/student/calendar" element={<CalendarView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
