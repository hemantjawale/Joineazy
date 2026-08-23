import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { Search, BookOpen, Calendar, ExternalLink, User } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { submissions, getMySubmissions } = useSubmissions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes] = await Promise.all([
          api.get("/assignments"),
          getMySubmissions(),
        ]);
        setAssignments(aRes.data.assignments);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getMySubmissions]);

  const getSubmissionStatus = (assignmentId) => {
    const sub = submissions.find((s) => s.assignmentId === assignmentId);
    return sub ? sub.status : "not_submitted";
  };

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    const status = getSubmissionStatus(a.id);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Assignments</h1>
        <p className="text-surface-500 mt-1">Browse and track all your assignments.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <Input
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full sm:w-36">
          <option value="all">All Types</option>
          <option value="individual">Individual</option>
          <option value="group">Group</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-44">
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="not_submitted">Not Submitted</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Try adjusting your filters"
          icon={BookOpen}
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((a) => {
            const status = getSubmissionStatus(a.id);
            const overdue = isOverdue(a.dueDate);
            const days = daysUntil(a.dueDate);

            return (
              <Link
                key={a.id}
                to={`/student/assignments/${a.id}`}
                className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 block group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-surface-900 truncate group-hover:text-primary-600 transition-colors">
                      {a.title}
                    </h3>
                    {a.description && (
                      <p className="text-sm text-surface-500 mt-1 line-clamp-2">{a.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant={a.type === "group" ? "info" : "secondary"}>
                        {a.type === "group" ? <><Users className="w-3 h-3 mr-1" /> Group</> : <><User className="w-3 h-3 mr-1" /> Individual</>}
                      </Badge>
                      <Badge variant={overdue ? "danger" : days <= 3 ? "warning" : "success"}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {overdue ? "Overdue" : days === 0 ? "Due Today" : `${days}d left`}
                      </Badge>
                      <Badge variant={status === "confirmed" ? "success" : status === "pending" ? "warning" : "outline"}>
                        {status === "confirmed" ? "✓ Confirmed" : status === "pending" ? "⏳ Pending" : "Not Submitted"}
                      </Badge>
                    </div>
                    {a.professor && (
                      <p className="text-xs text-surface-400 mt-2">Posted by {a.professor.name}</p>
                    )}
                  </div>
                  <div className="shrink-0 hidden sm:block">
                    <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
