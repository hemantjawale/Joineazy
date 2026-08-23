import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDate, isOverdue, daysUntil } from "@/lib/utils";
import toast from "react-hot-toast";

export default function StudentAssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirmSubmission, getMySubmissions } = useSubmissions();
  const { groups } = useGroups();

  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
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
      const result = await confirmSubmission(id, selectedGroup || undefined);

      if (result.step === 1) {
        setMySubmission({ ...result.submission, status: "pending" });
        toast.success("Step 1: Marked as submitted. Click again to confirm.");
      } else {
        setMySubmission({ ...result.submission, status: "confirmed" });
        toast.success("Submission confirmed!");
      }
      setShowConfirmDialog(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!assignment) return <p className="text-center py-16 text-surface-500">Assignment not found</p>;

  const overdue = isOverdue(assignment.dueDate);
  const days = daysUntil(assignment.dueDate);
  const isPending = mySubmission?.status === "pending";
  const isConfirmed = mySubmission?.status === "confirmed";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={assignment.type === "group" ? "info" : "secondary"}>{assignment.type}</Badge>
            <Badge variant={overdue ? "danger" : days <= 3 ? "warning" : "success"}>
              <Calendar className="w-3 h-3 mr-1" />
              {overdue ? "Overdue" : days === 0 ? "Due Today" : `${days} days left`}
            </Badge>
          </div>
          <CardTitle className="text-xl">{assignment.title}</CardTitle>
          {assignment.professor && (
            <p className="text-sm text-surface-400 mt-1">by {assignment.professor.name}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {assignment.description && (
            <div>
              <h3 className="text-sm font-medium text-surface-700 mb-1">Instructions</h3>
              <p className="text-sm text-surface-600 leading-relaxed bg-surface-50 p-4 rounded-xl">{assignment.description}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-surface-700 mb-2">Due Date</h3>
            <p className="text-sm text-surface-600">{formatDate(assignment.dueDate)}</p>
          </div>

          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <h3 className="text-sm font-medium text-primary-800 mb-2">Submission Link</h3>
            <a
              href={assignment.oneDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline break-all"
            >
              <ExternalLink size={14} />
              Open OneDrive Folder
            </a>
            <p className="text-xs text-primary-600/70 mt-1">Upload your work here before confirming submission</p>
          </div>

          <div className="border-t border-surface-200 pt-6">
            <h3 className="text-sm font-medium text-surface-700 mb-3">Submission Status</h3>

            {isConfirmed ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle className="w-6 h-6 text-success shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Submission Confirmed</p>
                  <p className="text-xs text-emerald-600">Your submission has been verified</p>
                </div>
              </div>
            ) : isPending ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Step 1 Complete — Confirm Now</p>
                    <p className="text-xs text-amber-600">Click below to finalize your submission</p>
                  </div>
                </div>
                <Button onClick={() => setShowConfirmDialog(true)} variant="success" className="w-full gap-2">
                  <CheckCircle size={16} /> Confirm Submission (Step 2)
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowConfirmDialog(true)} className="w-full gap-2">
                <CheckCircle size={16} /> I Have Submitted (Step 1)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogHeader>
          <DialogTitle>
            {isPending ? "Confirm Submission" : "Mark as Submitted"}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-surface-600 mb-4">
            {isPending
              ? "Are you sure you want to confirm? This verifies that you have uploaded your work to the OneDrive link."
              : "Have you uploaded your work to the OneDrive folder? This is step 1 of 2."}
          </p>
          {assignment.type === "group" && groups.length > 0 && !isPending && (
            <div className="space-y-2">
              <Label>Select Group (optional)</Label>
              <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="">No group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </Select>
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmission} disabled={submitting} variant={isPending ? "success" : "default"}>
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isPending ? "Yes, Confirm" : "Yes, I submitted"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
