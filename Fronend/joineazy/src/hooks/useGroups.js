import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/groups");
      setGroups(res.data.groups);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (name) => {
    const res = await api.post("/groups", { name });
    setGroups((prev) => [res.data.group, ...prev]);
    return res.data.group;
  }, []);

  const getGroup = useCallback(async (id) => {
    const res = await api.get(`/groups/${id}`);
    return res.data.group;
  }, []);

  const addMember = useCallback(async (groupId, email) => {
    const res = await api.post(`/groups/${groupId}/members`, { email });
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? res.data.group : g))
    );
    return res.data.group;
  }, []);

  const removeMember = useCallback(async (groupId, userId) => {
    await api.delete(`/groups/${groupId}/members/${userId}`);
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter((m) => m.userId !== userId),
          };
        }
        return g;
      })
    );
  }, []);

  const fetchStudents = useCallback(async () => {
    const res = await api.get("/groups/students");
    return res.data.students;
  }, []);

  const getInvitations = useCallback(async () => {
    const res = await api.get("/groups/invitations");
    return res.data.groups;
  }, []);

  const acceptInvitation = useCallback(async (groupId) => {
    await api.post(`/groups/${groupId}/invitations/accept`);
    fetchGroups();
  }, [fetchGroups]);

  const rejectInvitation = useCallback(async (groupId) => {
    await api.post(`/groups/${groupId}/invitations/reject`);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    getGroup,
    addMember,
    removeMember,
    fetchStudents,
    getInvitations,
    acceptInvitation,
    rejectInvitation,
  };
}
