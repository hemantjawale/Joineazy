import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Award, CheckCircle, Search, User, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SkeletonList, SkeletonCard } from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleJoinCourse = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    setJoining(true);
    try {
      await api.post("/courses/join", { joinCode: joinCode.trim().toUpperCase() });
      toast.success("Successfully joined the course!");
      setJoinCode("");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join course. Check code.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-32" />
        <SkeletonList count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto relative z-10">
      
      {/* Profile Header */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-2xl font-black uppercase text-primary">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Student Portal</p>
          </div>
        </div>
        
        {/* Join Course Input */}
        <form onSubmit={handleJoinCourse} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input 
              type="text" 
              placeholder="Enter Course Join Code" 
              className="w-full glass-input pl-9 pr-3 py-2 text-sm uppercase"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              maxLength={6}
            />
          </div>
          <Button type="submit" disabled={joining || joinCode.length < 3}>
            {joining ? "Joining..." : "Join"}
          </Button>
        </form>
      </div>

      {/* Enrolled Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> My Enrolled Courses
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link 
              key={course.id} 
              to={`/student/assignments?courseId=${course.id}`} 
              className="block glass-card p-5 group hover:bg-white/20 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-primary/30 flex items-center justify-center mb-4 text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{course.name}</h3>
              <p className="text-xs text-surface-500 mb-4 line-clamp-2 h-8">{course.description}</p>
              
              <div className="flex items-center justify-between border-t border-[color:var(--border)] pt-4 mt-auto">
                <div className="flex items-center gap-2 text-xs font-medium text-surface-600">
                  <User className="w-3 h-3" /> {course.professor?.name || "Instructor"}
                </div>
                <ChevronRight className="w-4 h-4 text-surface-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full glass-panel p-12 text-center text-surface-500 flex flex-col items-center">
              <BookOpen className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-bold mb-1">No Courses Yet</h3>
              <p className="text-sm max-w-md mx-auto">You haven't enrolled in any courses. Ask your professor for a 6-character Join Code and enter it above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
