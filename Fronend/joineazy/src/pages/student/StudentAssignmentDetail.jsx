import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useGroups } from "@/hooks/useGroups";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle, AlertTriangle, Users, BookOpen } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";
import toast from "react-hot-toast";

export default function StudentAssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirmSubmission, getMySubmissions } = useSubmissions();
  const { groups } = useGroups();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [proofText, setProofText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, subs] = await Promise.all([
          api.get(`/assignments/${id}`),
          getMySubmissions(),
        ]);
        setAssignment(aRes.data.assignment);
        const sub = subs.find((s) => s.assignmentId === id);
        setMySubmission(sub || null);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, getMySubmissions]);

  const handleConfirmSubmission = async () => {
    setSubmitting(true);
    try {
      const result = await confirmSubmission(id, selectedGroup || undefined, proofText || undefined);

      if (result.step === 1) {
        setMySubmission({ ...result.submission, status: "pending" });
        toast.success("Step 1: Marked as submitted. Now provide your proof of work.");
      } else {
        setMySubmission({ ...result.submission, status: "confirmed", proofText });
        toast.success("Submission confirmed!");
      }
      setShowConfirmDialog(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm. Make sure you are the group leader.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!assignment) return <p className="text-center py-16 text-[color:var(--text-muted)]">Assignment not found</p>;

  const overdue = isOverdue(assignment.dueDate);
  const days = daysUntil(assignment.dueDate);
  const isPending = mySubmission?.status === "pending";
  const isConfirmed = mySubmission?.status === "confirmed";
  const isGraded = mySubmission?.status === "graded";
  
  // Group logic
  const isGroup = assignment.type === "group";
  let isLeader = false;
  if (isGroup && selectedGroup) {
    const group = groups.find(g => g.id === selectedGroup);
    if (group) {
      const me = group.members.find(m => m.userId === user.id);
      if (me && me.role === "leader") isLeader = true;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Coursework
      </button>

      <div className="skeuo-panel overflow-hidden">
        {/* Header Ribbon */}
        <div className={`p-6 border-b border-[color:var(--border-shadow)] ${overdue ? 'bg-red-50 dark:bg-red-900/20' : 'bg-[color:var(--bg-page)]'}`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider skeuo-input ${isGroup ? 'text-blue-600' : 'text-purple-600'}`}>
              {isGroup ? 'Group' : 'Individual'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider skeuo-input flex items-center gap-1 ${overdue ? 'text-red-600' : 'text-green-600'}`}>
              <Calendar className="w-3 h-3" />
              {overdue ? "Overdue" : days === 0 ? "Due Today" : `${days} days left`}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]" style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8)" }}>
            {assignment.title}
          </h1>
          {assignment.professor && (
            <p className="text-sm font-medium text-[color:var(--text-secondary)] mt-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Instructor: {assignment.professor.name}
            </p>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Instructions */}
          {assignment.description && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--text-secondary)] mb-3">Briefing</h3>
              <div className="skeuo-input p-6 rounded-xl text-[color:var(--text-primary)] leading-relaxed bg-[color:var(--bg-page)]" style={{ whiteSpace: "pre-wrap" }}>
                {assignment.description}
              </div>
            </div>
          )}

          {/* Details & Submission Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--text-secondary)] mb-3">Deadline</h3>
              <div className="skeuo-input p-4 rounded-xl flex items-center gap-4 bg-[color:var(--bg-page)]">
                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center skeuo-panel ${overdue ? 'text-red-600' : 'text-[color:var(--text-primary)]'}`}>
                  <span className="text-[10px] font-bold uppercase border-b border-[color:var(--border-shadow)] w-full text-center">{new Date(assignment.dueDate).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-black">{new Date(assignment.dueDate).getDate()}</span>
                </div>
                <div>
                  <p className="font-bold text-[color:var(--text-primary)]">{formatDate(assignment.dueDate)}</p>
                  <p className="text-xs text-[color:var(--text-secondary)]">Time remaining: {overdue ? 'None' : `${days} days`}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--text-secondary)] mb-3">Workspace</h3>
              <a href={assignment.oneDriveLink} target="_blank" rel="noopener noreferrer" className="block skeuo-btn p-4 rounded-xl text-center group bg-[color:var(--bg-page)]">
                <ExternalLink className="w-6 h-6 mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-blue-600">Open Cloud Folder</p>
                <p className="text-xs text-[color:var(--text-muted)] mt-1">Upload files before confirming below</p>
              </a>
            </div>
          </div>

          <hr className="border-[color:var(--border-shadow)] border-t-2 border-b-0 shadow-[0_1px_0_rgba(255,255,255,0.8)]" />

          {/* Status Console */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--text-secondary)] mb-4">Submission Console</h3>

            {isGraded ? (
              <div className="space-y-4 animate-pop-in">
                <div className="skeuo-panel p-6 border-l-4 border-green-500 flex flex-col md:flex-row gap-6 justify-between items-center bg-green-50 dark:bg-green-900/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full skeuo-indicator-green flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-green-800 dark:text-green-300">Graded Confirmed</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">Professor has reviewed your submission</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right w-full md:w-auto skeuo-input p-4 rounded-xl bg-[color:var(--bg-page)]">
                    <p className="text-xs font-bold uppercase text-[color:var(--text-muted)] mb-1">Total Score</p>
                    <p className="text-4xl font-black text-[color:var(--color-primary-600)]">{mySubmission.totalScore}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="skeuo-input p-4 rounded-xl text-center bg-[color:var(--bg-page)]">
                    <p className="text-xs font-bold uppercase text-[color:var(--text-secondary)]">R1: Timeliness</p>
                    <p className="text-2xl font-black mt-2 text-[color:var(--text-primary)]">{mySubmission.gradeR1}</p>
                  </div>
                  <div className="skeuo-input p-4 rounded-xl text-center bg-[color:var(--bg-page)]">
                    <p className="text-xs font-bold uppercase text-[color:var(--text-secondary)]">R2: Quality</p>
                    <p className="text-2xl font-black mt-2 text-[color:var(--text-primary)]">{mySubmission.gradeR2}</p>
                  </div>
                  <div className="skeuo-input p-4 rounded-xl text-center bg-[color:var(--bg-page)]">
                    <p className="text-xs font-bold uppercase text-[color:var(--text-secondary)]">R3: Presentation</p>
                    <p className="text-2xl font-black mt-2 text-[color:var(--text-primary)]">{mySubmission.gradeR3}</p>
                  </div>
                </div>

                {mySubmission.feedback && (
                  <div className="skeuo-input p-6 rounded-xl bg-[color:var(--bg-page)] mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)] mb-2">Professor Feedback</h4>
                    <p className="text-sm font-medium italic text-[color:var(--text-primary)]">"{mySubmission.feedback}"</p>
                  </div>
                )}
              </div>
            ) : isConfirmed ? (
              <div className="skeuo-panel p-6 border-l-4 border-blue-500 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 animate-pop-in">
                <div className="w-12 h-12 rounded-full skeuo-indicator-green flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-800 dark:text-blue-300">Submission Confirmed</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Waiting for professor review.</p>
                </div>
              </div>
            ) : isPending ? (
              <div className="space-y-4 p-6 skeuo-panel bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 animate-pop-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full skeuo-indicator-yellow flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">Action Required: Step 2</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">Acknowledge completion and provide proof.</p>
                  </div>
                </div>
                
                {(!isGroup || (isGroup && isLeader)) ? (
                  <button onClick={() => setShowConfirmDialog(true)} className="skeuo-btn-primary w-full py-4 text-lg rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Finalize Submission
                  </button>
                ) : (
                  <div className="skeuo-input p-4 text-center rounded-xl bg-[color:var(--bg-page)] text-yellow-700">
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-bold">Group Leader Action Required</p>
                    <p className="text-xs">Only the designated group leader can finalize this submission.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="skeuo-panel p-6 bg-[color:var(--bg-page)] text-center animate-pop-in">
                <div className="w-16 h-16 rounded-full skeuo-input flex items-center justify-center mx-auto mb-4 bg-surface-100">
                  <AlertTriangle className="w-8 h-8 text-surface-400" />
                </div>
                <h4 className="text-xl font-bold text-[color:var(--text-primary)] mb-2">No Submission Started</h4>
                <p className="text-sm text-[color:var(--text-secondary)] mb-6">You have not acknowledged this assignment yet.</p>
                
                {isGroup && !selectedGroup && (
                  <div className="mb-6 max-w-sm mx-auto text-left">
                    <label className="text-xs font-bold uppercase text-[color:var(--text-secondary)] mb-2 block">Select your group to begin:</label>
                    <select 
                      className="skeuo-input w-full p-3 rounded-lg"
                      value={selectedGroup} 
                      onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                      <option value="">-- Choose Group --</option>
                      {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                )}

                <button 
                  onClick={() => setShowConfirmDialog(true)} 
                  disabled={isGroup && !selectedGroup}
                  className={`skeuo-btn py-4 px-8 text-lg rounded-xl font-bold flex items-center justify-center gap-2 mx-auto ${isGroup && !selectedGroup ? 'opacity-50 cursor-not-allowed' : 'text-blue-600'}`}
                >
                  <CheckCircle className="w-5 h-5" /> Initiate Submission (Step 1)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[color:var(--text-primary)]">
            {isPending ? "Final Confirmation" : "Initiate Submission"}
          </DialogTitle>
        </DialogHeader>
        <DialogContent className="bg-[color:var(--bg-page)] text-[color:var(--text-primary)]">
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium text-[color:var(--text-secondary)]">
              {isPending
                ? "Provide a description or link to your work to complete the submission."
                : "By initiating, you confirm you will upload your work to the provided workspace."}
            </p>
            {isPending && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Proof of Work</label>
                <textarea 
                  className="skeuo-input w-full p-4 rounded-xl resize-none h-32"
                  placeholder="e.g. Uploaded as Final_Report_Team7.pdf in OneDrive" 
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogFooter className="gap-2 sm:gap-0">
          <button className="skeuo-btn px-6 py-2 rounded-lg" onClick={() => setShowConfirmDialog(false)}>Cancel</button>
          <button 
            className="skeuo-btn-primary px-6 py-2 rounded-lg flex items-center gap-2" 
            onClick={handleConfirmSubmission} 
            disabled={submitting || (isPending && !proofText.trim())}
          >
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isPending ? "Submit Work" : "Acknowledge")}
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
