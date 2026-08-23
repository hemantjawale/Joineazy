import { useState } from "react";
import { Link } from "react-router-dom";
import { useAssignments } from "@/hooks/useAssignments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Plus, Search, FileText, Calendar, ExternalLink, Trash2, Edit } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AssignmentList() {
  const { assignments, loading, deleteAssignment } = useAssignments();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = async () => {
    try {
      await deleteAssignment(deleteId);
      toast.success("Assignment deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Assignments</h1>
          <p className="text-surface-500 mt-1">{assignments.length} total assignments</p>
        </div>
        <Link to="/professor/assignments/new">
          <Button className="gap-2">
            <Plus size={16} /> New Assignment
          </Button>
        </Link>
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
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full sm:w-40">
          <option value="all">All Types</option>
          <option value="individual">Individual</option>
          <option value="group">Group</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description={search ? "Try a different search term" : "Create your first assignment to get started"}
          icon={FileText}
          action={
            !search && (
              <Link to="/professor/assignments/new">
                <Button size="sm" className="gap-2"><Plus size={14} /> Create Assignment</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((assignment) => {
            const confirmed = assignment.submissions?.filter((s) => s.status === "confirmed").length || 0;
            const total = assignment.submissions?.length || 0;
            const days = daysUntil(assignment.dueDate);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/professor/assignments/${assignment.id}`} className="block">
                      <h3 className="text-base font-semibold text-surface-900 hover:text-primary-600 transition-colors truncate">
                        {assignment.title}
                      </h3>
                    </Link>
                    {assignment.description && (
                      <p className="text-sm text-surface-500 mt-1 line-clamp-2">{assignment.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant={assignment.type === "group" ? "info" : "secondary"}>
                        {assignment.type}
                      </Badge>
                      <Badge variant={overdue ? "danger" : days <= 3 ? "warning" : "success"}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {overdue ? "Overdue" : days === 0 ? "Due Today" : `${days}d left`}
                      </Badge>
                      <Badge variant="outline">
                        {confirmed}/{total} confirmed
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={assignment.oneDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <Link
                      to={`/professor/assignments/${assignment.id}/edit`}
                      className="p-2 rounded-lg text-surface-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(assignment.id)}
                      className="p-2 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        description="This action cannot be undone. All submission records for this assignment will also be removed."
      />
    </div>
  );
}
