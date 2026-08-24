import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { Search, Users, ArrowRight, Crown } from "lucide-react";

export default function ProfessorGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/professor/groups");
        setGroups(res.data.groups);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.members?.some((m) => m.user?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Student Groups</h1>
        <p className="text-surface-500 mt-1">View all {groups.length} student groups and their members.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <Input
          placeholder="Search by group name or member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No groups found"
          description={search ? "Try a different search term" : "No student groups have been created yet"}
          icon={Users}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((group) => {
            const leader = group.members?.find((m) => m.role === "leader");
            return (
              <Link
                key={group.id}
                to={`/professor/groups/${group.id}`}
                className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 block group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs text-surface-400 mb-3">{group.members?.length || 0} members</p>

                {leader && (
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-surface-500">Led by {leader.user?.name}</span>
                  </div>
                )}

                <div className="flex items-center -space-x-2">
                  {group.members?.slice(0, 5).map((m) => (
                    <Avatar key={m.id} name={m.user?.name || "User"} size="sm" className="border-2 border-white" />
                  ))}
                  {(group.members?.length || 0) > 5 && (
                    <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center text-xs font-medium text-surface-600 border-2 border-white">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
