import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/assignments");
      setAssignments(res.data.assignments);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssignment = useCallback(async (data) => {
    const res = await api.post("/assignments", data);
    setAssignments((prev) => [res.data.assignment, ...prev]);
    return res.data.assignment;
  }, []);

  const updateAssignment = useCallback(async (id, data) => {
    const res = await api.put(`/assignments/${id}`, data);
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? res.data.assignment : a))
    );
    return res.data.assignment;
  }, []);

  const deleteAssignment = useCallback(async (id) => {
    await api.delete(`/assignments/${id}`);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getAssignment = useCallback(async (id) => {
    const res = await api.get(`/assignments/${id}`);
    return res.data.assignment;
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignment,
  };
}
