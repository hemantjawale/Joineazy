import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowLeft, ExternalLink, Calendar, Users, CheckCircle, Clock, Edit } from "lucide-react";
import { formatDate, formatDateTime, isOverdue, daysUntil } from "@/lib/utils";

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, anRes] = await Promise.all([
          api.get(`/assignments/${id}`),
          api.get(`/analytics/assignments/${id}`),
        ]);
        setAssignment(aRes.data.assignment);
        setAnalytics(anRes.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!assignment) return <p className="text-center py-16 text-surface-500">Assignment not found</p>;

  const overdue = isOverdue(assignment.dueDate);
  const days = daysUntil(assignment.dueDate);
  const completionRate = analytics?.analytics?.completionRate || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-surface-900">{assignment.title}</h1>
            {assignment.description && (
              <p className="text-surface-500 mt-2 text-sm leading-relaxed">{assignment.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant={assignment.type === "group" ? "info" : "secondary"}>{assignment.type}</Badge>
              <Badge variant={overdue ? "danger" : "success"}>
                <Calendar className="w-3 h-3 mr-1" />
                {overdue ? "Overdue" : days === 0 ? "Due Today" : `${days} days left`}
              </Badge>
              <Badge variant="outline">{formatDate(assignment.dueDate)}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={assignment.oneDriveLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink size={14} /> OneDrive
              </Button>
            </a>
            <Link to={`/professor/assignments/${id}/edit`}>
              <Button variant="secondary" size="sm" className="gap-2">
                <Edit size={14} /> Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-surface-900">{analytics?.analytics?.totalStudents || 0}</p>
          <p className="text-xs text-surface-500 mt-1">Total Students</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-success">{analytics?.analytics?.confirmedCount || 0}</p>
          <p className="text-xs text-surface-500 mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-accent-500">{analytics?.analytics?.pendingCount || 0}</p>
          <p className="text-xs text-surface-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-surface-400">{analytics?.analytics?.notSubmitted || 0}</p>
          <p className="text-xs text-surface-500 mt-1">Not Submitted</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">Completion Rate</h2>
          <span className="text-2xl font-bold text-primary-600">{completionRate}%</span>
        </div>
        <Progress value={completionRate} size="lg" />
      </div>

      {analytics?.groupBreakdown?.length > 0 && (
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Group Breakdown</h2>
          <div className="space-y-4">
            {analytics.groupBreakdown.map((g) => (
              <div key={g.groupId} className="p-4 rounded-xl bg-surface-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="font-medium text-surface-900">{g.groupName}</span>
                  </div>
                  <Badge variant={g.confirmed === g.members.length ? "success" : "warning"}>
                    {g.confirmed}/{g.members.length} confirmed
                  </Badge>
                </div>
                <div className="grid gap-2">
                  {g.members.map((m) => (
                    <div key={m.email} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={m.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-surface-800">{m.name}</p>
                          <p className="text-xs text-surface-400">{m.email}</p>
                        </div>
                      </div>
                      <Badge variant={m.status === "confirmed" ? "success" : "warning"}>
                        {m.status === "confirmed" ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">All Submissions</h2>
        {analytics?.submissions?.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-6">No submissions yet</p>
        ) : (
          <div className="space-y-2">
            {analytics?.submissions?.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={s.user?.name || "User"} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-surface-800">{s.user?.name}</p>
                    <p className="text-xs text-surface-400">{s.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.group && <Badge variant="info">{s.group.name}</Badge>}
                  <Badge variant={s.status === "confirmed" ? "success" : "warning"}>
                    {s.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
