import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import StatCard from "@/components/shared/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, CheckCircle, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = ["#14b8a6", "#f59e0b", "#94a3b8"];

export default function ProfessorAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setData(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const pieData = [
    { name: "Confirmed", value: data?.stats?.confirmedSubmissions || 0 },
    { name: "Pending", value: (data?.stats?.totalSubmissions || 0) - (data?.stats?.confirmedSubmissions || 0) },
  ];

  const barData = data?.recentAssignments?.map((a) => ({
    name: a.title.length > 20 ? a.title.slice(0, 20) + "..." : a.title,
    confirmed: a.submissions?.filter((s) => s.status === "confirmed").length || 0,
    pending: a.submissions?.filter((s) => s.status === "pending").length || 0,
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        <p className="text-surface-500 mt-1">Submission performance and trends overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assignments" value={data?.stats?.totalAssignments || 0} icon={FileText} />
        <StatCard title="Students" value={data?.stats?.totalStudents || 0} icon={Users} />
        <StatCard title="Confirmed" value={data?.stats?.confirmedSubmissions || 0} icon={CheckCircle} />
        <StatCard title="Overall Rate" value={`${data?.stats?.submissionRate || 0}%`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-surface-900 mb-6">Submission Distribution</h2>
          {pieData[0].value + pieData[1].value === 0 ? (
            <p className="text-sm text-surface-400 text-center py-12">No submission data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center justify-center gap-6 mt-2">
            {pieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx] }} />
                <span className="text-sm text-surface-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-surface-900 mb-6">Recent Assignments</h2>
          {barData.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-12">No data to display</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="confirmed" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-sm text-surface-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-500" />
              <span className="text-sm text-surface-600">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Assignment Performance</h2>
        {data?.recentAssignments?.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-6">No assignments to analyze</p>
        ) : (
          <div className="space-y-4">
            {data?.recentAssignments?.map((a) => {
              const confirmed = a.submissions?.filter((s) => s.status === "confirmed").length || 0;
              const total = a.submissions?.length || 1;
              const pct = Math.round((confirmed / total) * 100);

              return (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-surface-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{formatDate(a.dueDate)}</Badge>
                      <Badge variant={a.type === "group" ? "info" : "secondary"}>{a.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-32">
                      <Progress value={pct} />
                    </div>
                    <span className="text-sm font-semibold text-surface-700 w-12 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
