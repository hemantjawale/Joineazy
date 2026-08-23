import { useState, useEffect } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { ClipboardCheck, CheckCircle, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentSubmissions() {
  const { submissions, loading, getMySubmissions } = useSubmissions();

  useEffect(() => {
    getMySubmissions();
  }, [getMySubmissions]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">My Submissions</h1>
        <p className="text-surface-500 mt-1">Track all your submission statuses.</p>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="Submit your first assignment to see it here"
          icon={ClipboardCheck}
        />
      ) : (
        <div className="grid gap-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      sub.status === "confirmed" ? "bg-emerald-50" : "bg-amber-50"
                    }`}
                  >
                    {sub.status === "confirmed" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">
                      {sub.assignment?.title || "Assignment"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {sub.group && <Badge variant="info">{sub.group.name}</Badge>}
                      <span className="text-xs text-surface-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {sub.assignment?.dueDate ? formatDate(sub.assignment.dueDate) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={sub.status === "confirmed" ? "success" : "warning"}
                  className="shrink-0"
                >
                  {sub.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending Confirmation"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
