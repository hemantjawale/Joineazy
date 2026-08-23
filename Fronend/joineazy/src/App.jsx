import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import ProfessorDashboard from "@/pages/professor/ProfessorDashboard";
import AssignmentList from "@/pages/professor/AssignmentList";
import AssignmentForm from "@/pages/professor/AssignmentForm";
import AssignmentDetail from "@/pages/professor/AssignmentDetail";
import ProfessorAnalytics from "@/pages/professor/ProfessorAnalytics";

import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentAssignments from "@/pages/student/StudentAssignments";
import StudentAssignmentDetail from "@/pages/student/StudentAssignmentDetail";
import GroupList from "@/pages/student/GroupList";
import GroupDetail from "@/pages/student/GroupDetail";
import StudentSubmissions from "@/pages/student/StudentSubmissions";

function AuthRedirect({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "professor" ? "/professor/dashboard" : "/student/dashboard"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRedirect><Landing /></AuthRedirect>} />

        <Route element={<AuthRedirect><AuthLayout /></AuthRedirect>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute role="professor"><DashboardLayout /></ProtectedRoute>}>
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/professor/assignments" element={<AssignmentList />} />
          <Route path="/professor/assignments/new" element={<AssignmentForm />} />
          <Route path="/professor/assignments/:id" element={<AssignmentDetail />} />
          <Route path="/professor/assignments/:id/edit" element={<AssignmentForm />} />
          <Route path="/professor/analytics" element={<ProfessorAnalytics />} />
        </Route>

        <Route element={<ProtectedRoute role="student"><DashboardLayout /></ProtectedRoute>}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/assignments/:id" element={<StudentAssignmentDetail />} />
          <Route path="/student/groups" element={<GroupList />} />
          <Route path="/student/groups/:id" element={<GroupDetail />} />
          <Route path="/student/submissions" element={<StudentSubmissions />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
