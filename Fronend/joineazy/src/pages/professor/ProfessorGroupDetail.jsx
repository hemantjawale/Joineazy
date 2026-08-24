import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  ArrowLeft,
  Users,
  Crown,
  ListTodo,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProfessorGroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/professor/groups/${id}`);
        setData(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p className="text-center py-16 text-surface-500">Group not found</p>;

  const { group, tasks, submissions } = data;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const confirmedSubs = submissions.filter((s) => s.status === "confirmed").length;

  const memberTaskMap = {};
  group.members?.forEach((m) => {
    memberTaskMap[m.userId] = {
      member: m,
      tasks: tasks.filter((t) => t.assignedToId === m.userId),
      submissions: submissions.filter((s) => s.userId === m.userId),
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Groups
      </button>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center">
              <Users className="w-7 h-7 text-accent-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">{group.name}</h1>
              <p className="text-sm text-surface-400">{group.members?.length || 0} members &middot; Created by {group.creator?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{taskProgress}%</p>
              <p className="text-xs text-surface-400">Task Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{confirmedSubs}</p>
              <p className="text-xs text-surface-400">Confirmed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-surface-900">{group.members?.length || 0}</p>
          <p className="text-xs text-surface-500 mt-1">Members</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-surface-900">{totalTasks}</p>
          <p className="text-xs text-surface-500 mt-1">Total Tasks</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-success">{doneTasks}</p>
          <p className="text-xs text-surface-500 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5 text-center">
          <p className="text-2xl font-bold text-accent-500">{totalTasks - doneTasks}</p>
          <p className="text-xs text-surface-500 mt-1">Remaining</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Member Performance</h2>
        <div className="space-y-4">
          {group.members?.map((m) => {
            const memberData = memberTaskMap[m.userId];
            const memberTasks = memberData?.tasks || [];
            const memberSubs = memberData?.submissions || [];
            const memberDone = memberTasks.filter((t) => t.status === "done").length;
            const memberTotal = memberTasks.length;
            const memberPct = memberTotal > 0 ? Math.round((memberDone / memberTotal) * 100) : 0;

            return (
              <div key={m.id} className="p-4 rounded-xl bg-surface-50 border border-surface-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.user?.name || "User"} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-surface-900">{m.user?.name}</p>
                        {m.role === "leader" && (
                          <Badge variant="warning" className="gap-1"><Crown size={10} /> Leader</Badge>
                        )}
                      </div>
                      <p className="text-xs text-surface-400">{m.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-surface-700">{memberDone}/{memberTotal} tasks</p>
                      <Progress value={memberPct} size="sm" className="w-24 mt-1" />
                    </div>
                    <Badge variant={memberSubs.every((s) => s.status === "confirmed") && memberSubs.length > 0 ? "success" : "secondary"}>
                      {memberSubs.filter((s) => s.status === "confirmed").length} submitted
                    </Badge>
                  </div>
                </div>

                {memberTasks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {memberTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <ListTodo className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                          <span className="text-xs text-surface-700 truncate">{task.title}</span>
                        </div>
                        <Badge
                          variant={task.status === "done" ? "success" : task.status === "in_progress" ? "warning" : "secondary"}
                        >
                          {task.status === "done" ? <><CheckCircle className="w-3 h-3 mr-1" /> Done</> :
                           task.status === "in_progress" ? <><Clock className="w-3 h-3 mr-1" /> In Progress</> :
                           "To Do"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {memberSubs.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Submissions</p>
                    {memberSubs.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                          <span className="text-xs text-surface-700 truncate">{sub.assignment?.title || "Assignment"}</span>
                          {sub.assignment?.dueDate && (
                            <span className="text-[10px] text-surface-300 shrink-0">
                              <Calendar className="w-2.5 h-2.5 inline mr-0.5" />
                              {formatDate(sub.assignment.dueDate)}
                            </span>
                          )}
                        </div>
                        <Badge variant={sub.status === "confirmed" ? "success" : "warning"}>
                          {sub.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">All Group Tasks</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-surface-500">Overall progress</span>
            <span className="text-sm font-bold text-primary-600 ml-auto">{taskProgress}%</span>
          </div>
          <Progress value={taskProgress} size="lg" />

          <div className="mt-4 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ListTodo className="w-4 h-4 text-surface-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-800 truncate">{task.title}</p>
                    <p className="text-xs text-surface-400">Assigned to {task.assignedTo?.name}</p>
                  </div>
                </div>
                <Badge variant={task.status === "done" ? "success" : task.status === "in_progress" ? "warning" : "secondary"}>
                  {task.status === "done" ? "Done" : task.status === "in_progress" ? "In Progress" : "To Do"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
