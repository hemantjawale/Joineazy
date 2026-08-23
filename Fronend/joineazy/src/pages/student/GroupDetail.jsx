import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  Crown,
  MessageCircle,
  ListTodo,
  Users,
  Send,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDateTime } from "@/lib/utils";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const { messages, loading: chatLoading, sendMessage } = useChat(id);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedToId: "" });
  const [creatingTask, setCreatingTask] = useState(false);

  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/groups/${id}`);
        setGroup(res.data.group);
        await fetchTasks(id);
      } catch {
        toast.error("Failed to load group");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, fetchTasks]);

  const isLeader = group?.members?.some(
    (m) => m.userId === user?.id && m.role === "leader"
  );

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddingMember(true);
    try {
      const res = await api.post(`/groups/${id}/members`, { email: memberEmail });
      setGroup(res.data.group);
      toast.success("Member added!");
      setShowAddMember(false);
      setMemberEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/groups/${id}/members/${userId}`);
      setGroup((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId !== userId),
      }));
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreatingTask(true);
    try {
      await createTask({ groupId: id, ...taskForm });
      toast.success("Task created!");
      setShowCreateTask(false);
      setTaskForm({ title: "", description: "", assignedToId: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      await sendMessage(chatInput.trim(), user?.name);
      setChatInput("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!group) return <p className="text-center py-16 text-surface-500">Group not found</p>;

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-surface-900">{group.name}</h1>
                <p className="text-sm text-surface-400">{group.members?.length || 0} members</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-primary-600">{taskProgress}%</p>
              <p className="text-xs text-surface-400">Progress</p>
            </div>
            <Progress value={taskProgress} className="w-24" />
          </div>
        </div>
      </div>

      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="members" activeValue={activeTab} onValueChange={setActiveTab} className="gap-1.5">
          <Users size={14} /> Members
        </TabsTrigger>
        <TabsTrigger value="tasks" activeValue={activeTab} onValueChange={setActiveTab} className="gap-1.5">
          <ListTodo size={14} /> Tasks
        </TabsTrigger>
        <TabsTrigger value="chat" activeValue={activeTab} onValueChange={setActiveTab} className="gap-1.5">
          <MessageCircle size={14} /> Chat
        </TabsTrigger>
      </TabsList>

      <TabsContent value="members" activeValue={activeTab}>
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Members</h2>
            {isLeader && (
              <Button size="sm" variant="outline" onClick={() => setShowAddMember(true)} className="gap-2">
                <UserPlus size={14} /> Add
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {group.members?.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
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
                {isLeader && m.userId !== user?.id && (
                  <button
                    onClick={() => handleRemoveMember(m.userId)}
                    className="p-2 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <UserMinus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tasks" activeValue={activeTab}>
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Tasks ({doneTasks}/{totalTasks})</h2>
            <Button size="sm" onClick={() => setShowCreateTask(true)} className="gap-2">
              <Plus size={14} /> Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-8">No tasks yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {["todo", "in_progress", "done"].map((status) => {
                const statusTasks = tasks.filter((t) => t.status === status);
                if (statusTasks.length === 0) return null;

                const statusLabels = { todo: "To Do", in_progress: "In Progress", done: "Done" };
                const statusColors = { todo: "secondary", in_progress: "warning", done: "success" };

                return (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={statusColors[status]}>{statusLabels[status]}</Badge>
                      <span className="text-xs text-surface-400">{statusTasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {statusTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900">{task.title}</p>
                            {task.description && <p className="text-xs text-surface-400 mt-0.5 truncate">{task.description}</p>}
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar name={task.assignedTo?.name || "User"} size="sm" />
                              <span className="text-xs text-surface-500">{task.assignedTo?.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={task.status}
                              onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                              className="h-8 text-xs w-28"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="done">Done</option>
                            </Select>
                            {task.createdById === user?.id && (
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1.5 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="chat" activeValue={activeTab}>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm flex flex-col" style={{ height: "500px" }}>
          <div className="p-4 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">Group Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatLoading ? (
              <LoadingSpinner text="Loading messages..." />
            ) : messages.length === 0 ? (
              <p className="text-sm text-surface-400 text-center py-8">No messages yet. Say hello!</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id || msg.sender?.id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${isMe ? "order-2" : ""}`}>
                      {!isMe && (
                        <p className="text-xs text-surface-400 mb-1 ml-1">
                          {msg.sender?.name || msg.senderName}
                        </p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? "bg-primary-600 text-white rounded-br-md"
                            : "bg-surface-100 text-surface-800 rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-surface-300 mt-0.5 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                        {formatDateTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-surface-200 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send size={16} />
            </Button>
          </form>
        </div>
      </TabsContent>

      <Dialog open={showAddMember} onClose={() => setShowAddMember(false)}>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddMember}>
          <DialogContent>
            <div className="space-y-2">
              <Label htmlFor="member-email">Student Email</Label>
              <Input
                id="member-email"
                type="email"
                placeholder="student@university.edu"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
            <Button type="submit" disabled={addingMember}>
              {addingMember ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog open={showCreateTask} onClose={() => setShowCreateTask(false)}>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateTask}>
          <DialogContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  placeholder="e.g. Design wireframes"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-desc">Description (optional)</Label>
                <Input
                  id="task-desc"
                  placeholder="Brief description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assign To</Label>
                <Select
                  id="task-assignee"
                  value={taskForm.assignedToId}
                  onChange={(e) => setTaskForm((p) => ({ ...p, assignedToId: e.target.value }))}
                  required
                >
                  <option value="">Select member</option>
                  {group.members?.map((m) => (
                    <option key={m.userId} value={m.userId}>{m.user?.name}</option>
                  ))}
                </Select>
              </div>
            </div>
          </DialogContent>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreateTask(false)}>Cancel</Button>
            <Button type="submit" disabled={creatingTask}>
              {creatingTask ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
