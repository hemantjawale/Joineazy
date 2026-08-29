import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssignments } from "@/hooks/useAssignments";
import api from "@/lib/api";
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

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    oneDriveLink: "",
    type: "individual",
    targetScope: "all",
    courseId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const courseRes = await api.get("/courses");
        setCourses(courseRes.data.courses || []);

        if (isEditing) {
          const a = await getAssignment(id);
          setFormData({
            title: a.title,
            description: a.description || "",
            dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : "",
            oneDriveLink: a.oneDriveLink,
            type: a.type,
            targetScope: a.targetScope,
            courseId: a.courseId || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load necessary data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchInitialData();
  }, [id, isEditing, getAssignment]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = { ...formData };
      if (!submitData.courseId) delete submitData.courseId; // Omit if empty

      if (isEditing) {
        await updateAssignment(id, submitData);
        toast.success("Assignment updated");
      } else {
        await createAssignment(submitData);
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
                placeholder='e.g. "Assignment 3 - ER Diagram Design"'
                value={formData.title}
                onChange={handleChange("title")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">Course (Optional)</Label>
              <Select id="courseId" value={formData.courseId} onChange={handleChange("courseId")}>
                <option value="">-- Select a Course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </Select>
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