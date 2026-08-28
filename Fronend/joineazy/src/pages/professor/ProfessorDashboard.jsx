import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FileText, CheckCircle, Clock, BookOpen, Plus, Search, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ProfessorDashboard() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");

  const fetchDashboardData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        api.get("/professor/dashboard/attention"),
        api.get("/courses")
      ]);
      setStats(statsRes.data);
      setCourses(coursesRes.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses", { name: newCourseName, description: newCourseDesc });
      toast.success("Course created successfully!");
      setShowCreateCourse(false);
      setNewCourseName("");
      setNewCourseDesc("");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Professor Dashboard
        </h1>
        <p className="text-sm mt-1 font-medium text-surface-600 dark:text-surface-400">
          Manage your courses and view statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Courses Panel */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="text-primary" /> My Courses
            </h2>
            <Button variant="glass" size="sm" onClick={() => setShowCreateCourse(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create Course
            </Button>
          </div>

          {showCreateCourse && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="mb-6 glass-card p-4 rounded-xl border-primary-300"
              onSubmit={handleCreateCourse}
            >
              <h3 className="font-bold mb-3 text-sm">New Course Details</h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Course Name (e.g. Intro to Computer Science)" 
                  className="w-full glass-input px-3 py-2 text-sm"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  required
                />
                <textarea 
                  placeholder="Course Description" 
                  className="w-full glass-input px-3 py-2 text-sm h-20 resize-none"
                  value={newCourseDesc}
                  onChange={e => setNewCourseDesc(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateCourse(false)}>Cancel</Button>
                  <Button type="submit" size="sm">Create</Button>
                </div>
              </div>
            </motion.form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {courses.length === 0 && !showCreateCourse && (
              <div className="col-span-full flex flex-col items-center justify-center text-surface-500 py-12">
                <BookOpen className="w-12 h-12 mb-2 opacity-20" />
                <p>No courses created yet.</p>
              </div>
            )}
            {courses.map(course => (
              <div key={course.id} className="glass-card p-4 rounded-xl flex flex-col group cursor-pointer hover:bg-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{course.name}</h3>
                  <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-mono font-bold tracking-widest">
                    {course.joinCode}
                  </div>
                </div>
                <p className="text-xs text-surface-500 mb-4 line-clamp-2 flex-1">{course.description || "No description provided."}</p>
                <div className="flex justify-between items-center border-t border-[color:var(--border)] pt-3 mt-auto">
                  <span className="text-xs font-medium text-surface-600 flex items-center gap-1">
                    <Users className="w-3 h-3" /> View Students
                  </span>
                  <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Statistics Panel */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <div className="mb-6 pb-4 border-b border-[color:var(--border)]">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-blue-500" /> Platform Stats
            </h2>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <StatBlock label="Total Students" value={stats.totalStudents} icon={Users} color="text-blue-600" />
            <StatBlock label="Platform Assignments" value={stats.totalAssignments} icon={FileText} color="text-indigo-600" />
            <StatBlock label="Submissions" value={stats.submitted} icon={CheckCircle} color="text-emerald-600" />
            <StatBlock label="Pending Grading" value={stats.pendingGrading} icon={Clock} color="text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, icon: Icon, color }) {
  return (
    <div className="glass-card rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md bg-white/50 dark:bg-black/20 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="text-2xl font-black tabular-nums">
        {value}
      </div>
    </div>
  );
}
