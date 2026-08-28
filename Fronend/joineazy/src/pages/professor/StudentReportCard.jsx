import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer, Award, BookOpen, Clock, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";

export default function StudentReportCard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/professor/students/${id}/report`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <SkeletonCard className="h-96" />;
  if (!data) return <div>Student not found.</div>;

  const { student, report } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link to="/professor/students" className="skeuo-btn p-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>
        <button onClick={() => window.print()} className="skeuo-btn p-2 flex items-center gap-2 text-[color:var(--color-primary-600)]">
          <Printer className="w-4 h-4" /> Print Transcript
        </button>
      </div>

      <div className="skeuo-panel p-8 bg-white dark:bg-surface-900 border-[8px] border-double border-[color:var(--border-main)]" style={{ background: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}>
        {/* Header */}
        <div className="text-center mb-10 pb-6 border-b-2 border-[color:var(--border-main)]">
          <h1 className="text-4xl font-serif font-bold text-surface-900 dark:text-white tracking-widest uppercase mb-2">
            Academic Transcript
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 font-medium">Joineazy University System</p>
        </div>

        {/* Student Info */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-sm font-bold uppercase text-surface-500 mb-1">Student Name</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{student.name}</p>
            <p className="text-surface-600">{student.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase text-surface-500 mb-1">Overall Grade</p>
            <div className="text-5xl font-black text-[color:var(--color-primary-600)]">{report.percentage}%</div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="skeuo-input p-4 text-center rounded-sm border-l-4 border-[color:var(--color-primary-500)] bg-white/50 backdrop-blur">
            <BookOpen className="w-5 h-5 mx-auto mb-2 text-surface-400" />
            <div className="text-2xl font-bold">{report.totalAssignments}</div>
            <div className="text-[10px] uppercase font-bold text-surface-500">Assignments</div>
          </div>
          <div className="skeuo-input p-4 text-center rounded-sm border-l-4 border-emerald-500 bg-white/50 backdrop-blur">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-surface-400" />
            <div className="text-2xl font-bold">{report.completed}</div>
            <div className="text-[10px] uppercase font-bold text-surface-500">Completed</div>
          </div>
          <div className="skeuo-input p-4 text-center rounded-sm border-l-4 border-blue-500 bg-white/50 backdrop-blur">
            <Award className="w-5 h-5 mx-auto mb-2 text-surface-400" />
            <div className="text-2xl font-bold">{report.totalScore}</div>
            <div className="text-[10px] uppercase font-bold text-surface-500">Total Points</div>
          </div>
          <div className="skeuo-input p-4 text-center rounded-sm border-l-4 border-purple-500 bg-white/50 backdrop-blur">
            <Clock className="w-5 h-5 mx-auto mb-2 text-surface-400" />
            <div className="text-2xl font-bold">{report.maxPossible}</div>
            <div className="text-[10px] uppercase font-bold text-surface-500">Max Possible</div>
          </div>
        </div>

        {/* Detailed Grades */}
        <div>
          <h3 className="text-lg font-bold border-b border-surface-200 pb-2 mb-4 uppercase tracking-wider text-surface-700 dark:text-surface-300">Detailed Coursework</h3>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-surface-300 text-sm font-bold uppercase text-surface-500">
                <th className="py-3 px-2">Assignment</th>
                <th className="py-3 px-2 text-center">Type</th>
                <th className="py-3 px-2 text-center" title="Timely Submission">R1 (10)</th>
                <th className="py-3 px-2 text-center" title="Quality Content">R2 (10)</th>
                <th className="py-3 px-2 text-center" title="Presentation">R3 (10)</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.submissions.map((sub, idx) => (
                <tr key={idx} className="border-b border-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-surface-900 dark:text-white">
                    {sub.assignmentTitle}
                    {sub.feedback && <div className="text-xs text-surface-500 font-normal mt-1 italic">"{sub.feedback}"</div>}
                  </td>
                  <td className="py-3 px-2 text-center text-sm capitalize text-surface-600">{sub.type}</td>
                  <td className="py-3 px-2 text-center font-mono">{sub.r1 ?? "-"}</td>
                  <td className="py-3 px-2 text-center font-mono">{sub.r2 ?? "-"}</td>
                  <td className="py-3 px-2 text-center font-mono">{sub.r3 ?? "-"}</td>
                  <td className="py-3 px-2 text-right font-bold font-mono text-[color:var(--color-primary-600)]">{sub.total ?? "-"}</td>
                </tr>
              ))}
              {report.submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-surface-500 italic">No graded coursework recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Official Stamp Simulation */}
        <div className="mt-16 flex justify-end">
          <div className="border-4 border-red-500/30 text-red-500/30 rounded-full w-32 h-32 flex items-center justify-center transform -rotate-12 select-none">
            <div className="text-center font-serif">
              <div className="font-bold tracking-widest text-lg">OFFICIAL</div>
              <div className="text-xs">{new Date().getFullYear()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
