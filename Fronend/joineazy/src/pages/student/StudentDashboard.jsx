import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useGroups } from "@/hooks/useGroups";
import { useSubmissions } from "@/hooks/useSubmissions";
import StatCard from "@/components/shared/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, CheckCircle, Clock, Calendar, ArrowRight } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const { getMySubmissions } = useSubmissions();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, subs] = await Promise.all([
          api.get("/assignments"),
          getMySubmissions(),
        ]);
        setAssignments(aRes.data.assignments);
        setSubmissions(subs);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getMySubmissions]);

  if (loading || groupsLoading) return <LoadingSpinner />;

  const upcomingAssignments = assignments
    .filter((a) => !isOverdue(a.dueDate))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const confirmedCount = submissions.filter((s) => s.status === "confirmed").length;
  const completionRate = submissions.length > 0 ? Math.round((confirmedCount / submissions.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Hey, {user?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-surface-500 mt-1">Here&apos;s your assignment overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assignments" value={assignments.length} icon={BookOpen} />
        <StatCard title="My Groups" value={groups.length} icon={Users} />
        <StatCard title="Confirmed" value={confirmedCount} icon={CheckCircle} />
        <StatCard title="Completion" value={`${completionRate}%`} icon={Clock} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-surface-900">Upcoming Deadlines</h2>
            <Link to="/student/assignments" className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {upcomingAssignments.length === 0 ? (
            <p className="text-sm text-surface-400 py-8 text-center">No upcoming assignments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map((a) => {
                const days = daysUntil(a.dueDate);
                const submitted = submissions.find((s) => s.assignmentId === a.id);

                return (
                  <Link
                    key={a.id}
                    to={`/student/assignments/${a.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={days <= 2 ? "danger" : days <= 5 ? "warning" : "success"}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {days === 0 ? "Today" : `${days}d left`}
                        </Badge>
                        {submitted && (
                          <Badge variant={submitted.status === "confirmed" ? "success" : "warning"}>
                            {submitted.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-surface-900">My Groups</h2>
            <Link to="/student/groups" className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {groups.length === 0 ? (
            <p className="text-sm text-surface-400 py-8 text-center">No groups yet. Create or join one!</p>
          ) : (
            <div className="space-y-3">
              {groups.slice(0, 4).map((g) => (
                <Link
                  key={g.id}
                  to={`/student/groups/${g.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{g.name}</p>
                      <p className="text-xs text-surface-400">{g.members?.length || 0} members</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">My Progress</h2>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-surface-500">Overall completion</span>
          <span className="text-sm font-bold text-primary-600 ml-auto">{completionRate}%</span>
        </div>
        <Progress value={completionRate} size="lg" />
      </div>
    </div>
  );
}
