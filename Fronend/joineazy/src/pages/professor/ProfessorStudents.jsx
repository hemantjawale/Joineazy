import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { Search, GraduationCap, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProfessorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/professor/students");
        setStudents(res.data.students);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">All Students</h1>
        <p className="text-surface-500 mt-1">{students.length} registered students.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No students found"
          description={search ? "Try a different search term" : "No students have registered yet"}
          icon={GraduationCap}
        />
      ) : (
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-surface-50 border-b border-surface-200 text-xs font-medium text-surface-500 uppercase tracking-wider">
            <span>Student</span>
            <span>Email</span>
            <span>Groups</span>
            <span>Joined</span>
          </div>
          <div className="divide-y divide-surface-100">
            {filtered.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-surface-50 transition-colors items-start sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} />
                  <p className="text-sm font-medium text-surface-900">{student.name}</p>
                </div>

                <p className="text-sm text-surface-500 truncate pl-11 sm:pl-0">{student.email}</p>

                <div className="flex flex-wrap gap-1.5 pl-11 sm:pl-0">
                  {student.groups?.length > 0 ? (
                    student.groups.map((g) => (
                      <Badge key={g.id} variant={g.role === "leader" ? "warning" : "info"} className="text-[10px]">
                        <Users className="w-2.5 h-2.5 mr-0.5" />
                        {g.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-surface-300">No groups</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-surface-400 pl-11 sm:pl-0">
                  <Calendar className="w-3 h-3" />
                  {formatDate(student.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
