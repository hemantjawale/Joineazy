import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { Search, BookOpen, Calendar, ExternalLink, User, Users, ChevronRight } from "lucide-react";
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

  const [searchParams] = useSearchParams();
  const courseIdFilter = searchParams.get("courseId");

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    const status = getSubmissionStatus(a.id);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesCourse = !courseIdFilter || a.courseId === courseIdFilter;
    return matchesSearch && matchesType && matchesStatus && matchesCourse;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto relative z-10">
      <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Assignments</h1>
          <p className="text-surface-500 mt-1">Browse and track all your assignments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full glass-input pl-9 pr-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="glass-input w-full sm:w-36">
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input w-full sm:w-44">
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="not_submitted">Not Submitted</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center text-surface-500 flex flex-col items-center">
          <BookOpen className="w-16 h-16 mb-4 opacity-20 text-primary" />
          <h3 className="text-lg font-bold mb-1">No assignments found</h3>
          <p className="text-sm max-w-md mx-auto">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => {
            const status = getSubmissionStatus(a.id);
            const overdue = isOverdue(a.dueDate);
            const days = daysUntil(a.dueDate);

            return (
              <Link
                key={a.id}
                to={`/student/assignments/${a.id}`}
                className="block glass-card p-5 group hover:bg-white/20 transition-all flex flex-col h-full"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-primary/30 flex items-center justify-center mb-4 text-primary shrink-0 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col h-full">
                  <h3 className="text-lg font-bold mb-1 text-surface-900 truncate group-hover:text-primary-600 transition-colors">
                    {a.title}
                  </h3>
                  {a.description && (
                    <p className="text-sm text-surface-500 mt-1 line-clamp-2 h-10">{a.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
                    <Badge variant={a.type === "group" ? "info" : "secondary"}>
                      {a.type === "group" ? <><Users className="w-3 h-3 mr-1" /> Group</> : <><User className="w-3 h-3 mr-1" /> Individual</>}
                    </Badge>
                    <Badge variant={overdue ? "danger" : days <= 3 ? "warning" : "success"}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {overdue ? "Overdue" : days === 0 ? "Due Today" : `${days}d left`}
                    </Badge>
                    <Badge variant={status === "confirmed" ? "success" : status === "pending" ? "warning" : "outline"}>
                      {status === "confirmed" ? "Confirmed" : status === "pending" ? "Pending" : "Not Submitted"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-[color:var(--border)] pt-4 mt-auto">
                    {a.professor && (
                      <div className="flex items-center gap-2 text-xs font-medium text-surface-600">
                        <User className="w-3 h-3" /> {a.professor.name}
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-surface-400 group-hover:translate-x-1 group-hover:text-primary-500 transition-all" />
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