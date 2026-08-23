import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssignments } from "@/hooks/useAssignments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AssignmentForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { createAssignment, updateAssignment, getAssignment } = useAssignments();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    oneDriveLink: "",
    type: "individual",
    targetScope: "all",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      getAssignment(id)
        .then((a) => {
          setFormData({
            title: a.title,
            description: a.description || "",
            dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : "",
            oneDriveLink: a.oneDriveLink,
            type: a.type,
            targetScope: a.targetScope,
          });
        })
        .catch(() => toast.error("Failed to load assignment"))
        .finally(() => setLoadingData(false));
    }
  }, [id, isEditing, getAssignment]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateAssignment(id, formData);
        toast.success("Assignment updated");
      } else {
        await createAssignment(formData);
        toast.success("Assignment created");
      }
      navigate("/professor/assignments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Assignment" : "New Assignment"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder='e.g. "Assignment 3 – ER Diagram Design"'
                value={formData.title}
                onChange={handleChange("title")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief instructions for students (2-3 lines)"
                value={formData.description}
                onChange={handleChange("description")}
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={handleChange("dueDate")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select id="type" value={formData.type} onChange={handleChange("type")}>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oneDriveLink">OneDrive Submission Link</Label>
              <Input
                id="oneDriveLink"
                type="url"
                placeholder="https://onedrive.live.com/..."
                value={formData.oneDriveLink}
                onChange={handleChange("oneDriveLink")}
                required
              />
              <p className="text-xs text-surface-400">Paste the OneDrive folder link where students will upload their work</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetScope">Target</Label>
              <Select id="targetScope" value={formData.targetScope} onChange={handleChange("targetScope")}>
                <option value="all">All Students</option>
                <option value="specific">Specific Groups</option>
              </Select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    {isEditing ? "Update" : "Create"} Assignment
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
