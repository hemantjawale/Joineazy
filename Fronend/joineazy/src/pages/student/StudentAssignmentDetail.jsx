import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useGroups } from "@/hooks/useGroups";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle, AlertTriangle, Users, BookOpen, Plus, User } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";

export default function StudentAssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirmSubmission, getMySubmissions } = useSubmissions();
  const { groups } = useGroups();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  
  // Dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [proofText, setProofText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Group logic
  const [selectedGroup, setSelectedGroup] = useState("");
  
  // Sub-task distribution
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          api.get(`/assignments/${id}`),
          getMySubmissions()
        ]);
        
        const data = aRes.data.assignment;
        setAssignment(data);
        
        let sub = sRes.find(s => s.assignmentId === id);
        
        let initialGroup = "";
        if (sub && sub.groupId) {
          initialGroup = sub.groupId;
        } else if (data.type === "group") {
          const stored = localStorage.getItem(`assignment_group_${id}`);
          if (stored) initialGroup = stored;
        }

        setSelectedGroup(initialGroup);
        setMySubmission(sub || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, getMySubmissions]);

  // Auto-select if only 1 group
  useEffect(() => {
    if (assignment?.type === "group" && groups.length === 1 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
      localStorage.setItem(`assignment_group_${id}`, groups[0].id);
    }
  }, [assignment, groups, selectedGroup, id]);

  // Fetch group submission if we don't have a personal one
  useEffect(() => {
    if (assignment?.type === "group" && selectedGroup && !mySubmission) {
      const fetchGroupSub = async () => {
        try {
          const res = await api.get(`/submissions/group/${selectedGroup}`);
          const gSub = res.data.submissions.find(s => s.assignmentId === id);
          if (gSub) setMySubmission(gSub);
        } catch (err) {
          console.error(err);
        }
      };
      fetchGroupSub();
    }
  }, [assignment, selectedGroup, mySubmission, id]);

  useEffect(() => {
    if (selectedGroup && assignment?.type === "group") {
      const fetchTasks = async () => {
        try {
          const res = await api.get(`/tasks/group/${selectedGroup}`);
          const groupTasks = res.data.tasks.filter(t => t.assignmentId === id);
          setTasks(groupTasks);
        } catch (err) {
          console.error("Failed to fetch group tasks", err);
        }
      };
      fetchTasks();
    }
  }, [selectedGroup, assignment?.type, id]);

  const isGroup = assignment?.type === "group";
  let isLeader = false;
  let activeGroup = null;
  if (isGroup && selectedGroup) {
    activeGroup = groups.find(g => g.id === selectedGroup);
    if (activeGroup) {
      const me = activeGroup.members.find(m => m.userId === user.id);
      if (me && me.role === "leader") isLeader = true;
    }
  }

  const handleConfirmSubmission = async () => {
    setSubmitting(true);
    try {
      if (mySubmission) {
        await api.put(`/submissions/${mySubmission.id}/finalize`, { proofText });
      } else {
        await confirmSubmission(id, isGroup ? selectedGroup : null);
      }
      const sRes = await getMySubmissions();
      const sub = sRes.find(s => s.assignmentId === id);
      setMySubmission(sub || null);
      setShowConfirmDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskAssignee) return;
    
    setCreatingTask(true);
    try {
      const res = await api.post('/tasks', {
        groupId: selectedGroup,
        assignmentId: id,
        title: newTaskTitle,
        assignedToId: newTaskAssignee
      });
      setTasks([res.data.task, ...tasks]);
      setNewTaskTitle("");
      setNewTaskAssignee("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "todo" ? "in_progress" : currentStatus === "in_progress" ? "done" : "todo";
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? res.data.task : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!assignment) return <div>Assignment not found</div>;

  const overdue = isOverdue(assignment.dueDate);
  const days = daysUntil(assignment.dueDate);
  const isPending = mySubmission && mySubmission.status === "pending";
  const isConfirmed = mySubmission && mySubmission.status === "confirmed";
  const isGraded = mySubmission && mySubmission.status === "graded";
  
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative z-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Coursework
      </button>

      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BookOpen className="w-64 h-64 text-primary-500" />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isGroup ? 'bg-primary-100 text-primary-700' : 'bg-purple-100 text-purple-700'}`}>
            {isGroup ? "GROUP ASSIGNMENT" : "INDIVIDUAL ASSIGNMENT"}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 ${overdue ? 'bg-red-100 text-red-700' : days <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            <Calendar className="w-3 h-3" />
            {overdue ? "OVERDUE" : days === 0 ? "DUE TODAY" : `${days} DAYS LEFT`}
          </div>
          {assignment.courseId && (
            <div className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-surface-100 text-surface-600">
              COURSE ASSIGNMENT
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-surface-900 mb-2">{assignment.title}</h1>
        
        <div className="flex items-center gap-2 text-surface-500 mb-8">
          <User className="w-4 h-4" /> Instructor: <span className="font-medium text-surface-700">{assignment.professor?.name}</span>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-surface-200 via-surface-300 to-transparent my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400 mb-3">Briefing</h3>
            <p className="text-surface-700 whitespace-pre-wrap leading-relaxed">
              {assignment.description || "No description provided."}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400 mb-3">Deadline</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-100 flex flex-col items-center justify-center shrink-0 border border-surface-200">
                  <span className="text-[10px] font-bold text-surface-500 uppercase">{new Date(assignment.dueDate).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-black text-surface-900 leading-none">{new Date(assignment.dueDate).getDate()}</span>
                </div>
                <div>
                  <p className="font-bold text-surface-900">{formatDate(assignment.dueDate)}</p>
                  <p className="text-sm text-surface-500">Time remaining: {days} days</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400 mb-3">Workspace</h3>
              <a 
                href={assignment.oneDriveLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-colors group"
              >
                <ExternalLink className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Open Cloud Folder</span>
                <span className="text-xs text-blue-400/80 mt-1">Upload files before confirming below</span>
              </a>
            </div>
          </div>
        </div>

        {/* Group Work Distribution Section */}
        {isGroup && selectedGroup && activeGroup && (
          <div className="mt-12 pt-8 border-t border-surface-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" /> Work Distribution
                </h3>
                <p className="text-sm text-surface-500">Manage tasks for {activeGroup.name}</p>
              </div>
              <div className="w-full sm:w-48">
                <div className="flex justify-between text-xs font-bold text-surface-600 mb-1">
                  <span>Progress</span>
                  <span>{completedTasks} / {tasks.length}</span>
                </div>
                <Progress value={taskProgress} className="h-2" />
              </div>
            </div>

            {isLeader && !isConfirmed && !isGraded && (
              <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Task title..." 
                  className="glass-input flex-1"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
                <select 
                  className="glass-input w-40"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  required
                >
                  <option value="">Assign to...</option>
                  {activeGroup.members.map(m => (
                    <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                  ))}
                </select>
                <button type="submit" disabled={creatingTask} className="glass-btn px-4 bg-primary-50 text-primary-600 hover:bg-primary-100 border-primary-200">
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            )}

            {tasks.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-surface-300 rounded-xl bg-surface-50/50">
                <p className="text-sm text-surface-500">No tasks created yet.</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {tasks.map(task => {
                  const isMine = task.assignedToId === user.id;
                  const canEdit = isMine && !isConfirmed && !isGraded;
                  
                  return (
                    <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${task.status === 'done' ? 'bg-green-50/50 border-green-200' : 'bg-white border-surface-200'}`}>
                      <div className="flex items-center gap-3">
                        <button 
                          disabled={!canEdit}
                          onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 
                            task.status === 'in_progress' ? 'bg-yellow-100 border-yellow-400 text-transparent' : 
                            'border-surface-300 hover:border-primary-400 text-transparent'
                          } ${canEdit ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-surface-400' : 'text-surface-900'}`}>{task.title}</p>
                          <p className="text-xs text-surface-500">Assigned to: {task.assignedTo?.name}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-xs font-bold uppercase tracking-wider text-surface-400">
                        {task.status.replace('_', ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="w-full h-px bg-gradient-to-r from-surface-200 via-surface-300 to-transparent my-8" />

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400 mb-6">Submission Console</h3>
          
          <div className="max-w-2xl mx-auto">
            {isGraded ? (
              <div className="glass-card border-primary-200 p-8 text-center bg-gradient-to-br from-primary-50 to-white">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-2xl font-black text-surface-900 mb-2">Graded</h4>
                <p className="text-surface-600 mb-6">Your professor has reviewed your work.</p>
                
                <div className="flex justify-center mb-6">
                  <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-surface-200">
                    <p className="text-xs font-bold uppercase text-surface-400 mb-1">Score</p>
                    <p className="text-4xl font-black text-primary-600">{mySubmission.grade || "N/A"}</p>
                  </div>
                </div>

                {mySubmission.feedback && (
                  <div className="glass-input p-6 rounded-xl text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">Professor Feedback</h4>
                    <p className="text-sm font-medium text-surface-800">"{mySubmission.feedback}"</p>
                  </div>
                )}
              </div>
            ) : isConfirmed ? (
              <div className="glass-card p-6 border-l-4 border-blue-500 flex items-center gap-4 bg-gradient-to-r from-blue-50/50 to-transparent">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-900">Submission Confirmed</h4>
                  <p className="text-sm text-blue-600">Waiting for professor review.</p>
                </div>
              </div>
            ) : isPending ? (
              <div className="space-y-4 p-6 glass-card bg-gradient-to-r from-yellow-50/50 to-transparent border-l-4 border-yellow-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900">Action Required: Step 2</h4>
                    <p className="text-sm text-yellow-700">Acknowledge completion and provide proof.</p>
                  </div>
                </div>
                
                {(!isGroup || (isGroup && isLeader)) ? (
                  <button onClick={() => setShowConfirmDialog(true)} className="glass-btn w-full py-4 text-lg bg-primary-600 hover:bg-primary-700 text-white border-transparent">
                    <CheckCircle className="w-5 h-5 mr-2" /> Finalize Submission
                  </button>
                ) : (
                  <div className="glass-input p-4 text-center text-yellow-700">
                    <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="font-bold">Group Leader Action Required</p>
                    <p className="text-xs mt-1">Only the designated group leader can finalize this submission.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-surface-400" />
                </div>
                <h4 className="text-xl font-bold text-surface-900 mb-2">No Submission Started</h4>
                <p className="text-sm text-surface-500 mb-6">You have not acknowledged this assignment yet.</p>
                
                {isGroup && !selectedGroup && (
                  <div className="mb-6 max-w-sm mx-auto text-left">
                    <label className="text-xs font-bold uppercase text-surface-500 mb-2 block">Select your group to begin:</label>
                    <select 
                      className="glass-input w-full"
                      value={selectedGroup} 
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        localStorage.setItem(`assignment_group_${id}`, e.target.value);
                      }}
                    >
                      <option value="">-- Choose Group --</option>
                      {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                )}

                <button 
                  onClick={() => setShowConfirmDialog(true)} 
                  disabled={isGroup && !selectedGroup}
                  className={`glass-btn py-3 px-8 text-lg mx-auto ${isGroup && !selectedGroup ? 'opacity-50 cursor-not-allowed' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Initiate Submission (Step 1)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogHeader>
          <DialogTitle>
            {isPending ? "Final Confirmation" : "Initiate Submission"}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4 py-4">
            <p className="text-sm text-surface-600">
              {isPending
                ? "Provide a description or link to your work to complete the submission."
                : "By initiating, you confirm you will upload your work to the provided workspace."}
            </p>
            {isPending && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-surface-500">Proof of Work</label>
                <textarea 
                  className="glass-input w-full p-4 h-32 resize-none"
                  placeholder="e.g. Uploaded as Final_Report_Team7.pdf in OneDrive" 
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogFooter>
          <button className="glass-btn px-6 py-2" onClick={() => setShowConfirmDialog(false)}>Cancel</button>
          <button 
            className="glass-btn bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 border-transparent disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleConfirmSubmission} 
            disabled={submitting || (isPending && !proofText.trim())}
          >
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : (isPending ? "Submit Work" : "Acknowledge")}
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}