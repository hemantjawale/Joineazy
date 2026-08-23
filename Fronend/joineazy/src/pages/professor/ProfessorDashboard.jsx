import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import StatCard from "@/components/shared/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Users, CheckCircle, Clock, BarChart3, Calendar } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setData(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-surface-500 mt-1">Here&apos;s what&apos;s happening with your assignments.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assignments" value={data?.stats?.totalAssignments || 0} icon={FileText} />
        <StatCard title="Total Students" value={data?.stats?.totalStudents || 0} icon={Users} />
        <StatCard title="Confirmed" value={data?.stats?.confirmedSubmissions || 0} icon={CheckCircle} />
        <StatCard title="Submission Rate" value={`${data?.stats?.submissionRate || 0}%`} icon={BarChart3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-surface-900">Recent Assignments</h2>
            <Link to="/professor/assignments" className="text-sm text-primary-600 hover:underline font-medium">
              View all
            </Link>
          </div>
          {data?.recentAssignments?.length === 0 ? (
            <p className="text-sm text-surface-400 py-8 text-center">No assignments yet</p>
          ) : (
            <div className="space-y-3">
              {data?.recentAssignments?.map((a) => {
                const confirmed = a.submissions?.filter((s) => s.status === "confirmed").length || 0;
                const total = a.submissions?.length || 0;
                const pct = total > 0 ? Math.round((confirmed / total) * 100) : 0;

                return (
                  <Link
                    key={a.id}
                    to={`/professor/assignments/${a.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={isOverdue(a.dueDate) ? "danger" : "secondary"}>
                          {isOverdue(a.dueDate) ? "Overdue" : `Due ${formatDate(a.dueDate)}`}
                        </Badge>
                        <Badge variant={a.type === "group" ? "info" : "secondary"}>{a.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-semibold text-surface-700">{pct}%</p>
                      <Progress value={pct} size="sm" className="w-20 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-surface-900">Upcoming Deadlines</h2>
            <Calendar className="w-5 h-5 text-surface-400" />
          </div>
          {data?.upcomingDeadlines?.length === 0 ? (
            <p className="text-sm text-surface-400 py-8 text-center">No upcoming deadlines</p>
          ) : (
            <div className="space-y-3">
              {data?.upcomingDeadlines?.map((a) => {
                const days = daysUntil(a.dueDate);
                return (
                  <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-50">
                    <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{a.title}</p>
                      <p className="text-xs text-surface-400">{formatDate(a.dueDate)}</p>
                    </div>
                    <Badge variant={days <= 2 ? "danger" : days <= 5 ? "warning" : "success"}>
                      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
