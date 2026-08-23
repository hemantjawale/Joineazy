import { useState } from "react";
import { Link } from "react-router-dom";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { Plus, Users, ArrowRight, Crown } from "lucide-react";
import toast from "react-hot-toast";

export default function GroupList() {
  const { groups, loading, createGroup } = useGroups();
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setCreating(true);
    try {
      await createGroup(groupName.trim());
      toast.success("Group created!");
      setShowCreate(false);
      setGroupName("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Groups</h1>
          <p className="text-surface-500 mt-1">{groups.length} groups</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus size={16} /> New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          title="No groups yet"
          description="Create a group to collaborate with classmates on assignments"
          icon={Users}
          action={
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus size={14} /> Create Group
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/student/groups/${group.id}`}
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
          ))}
        </div>
      )}

      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder='e.g. "Team Alpha"'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>
              {creating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
