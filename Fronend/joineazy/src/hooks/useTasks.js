import { useState, useCallback } from "react";
import api from "@/lib/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (groupId) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/group/${groupId}`);
      setTasks(res.data.tasks);
      return res.data.tasks;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const res = await api.post("/tasks", data);
    setTasks((prev) => [res.data.task, ...prev]);
    return res.data.task;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? res.data.task : t))
    );
    return res.data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
