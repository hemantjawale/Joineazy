import { useState, useCallback } from "react";
import api from "@/lib/api";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const confirmSubmission = useCallback(async (assignmentId, groupId, proofText) => {
    const res = await api.post("/submissions/confirm", { assignmentId, groupId, proofText });
    return res.data;
  }, []);

  const getAssignmentSubmissions = useCallback(async (assignmentId) => {
    setLoading(true);
    try {
      const res = await api.get(`/submissions/assignment/${assignmentId}`);
      setSubmissions(res.data.submissions);
      return res.data.submissions;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupSubmissions = useCallback(async (groupId) => {
    setLoading(true);
    try {
      const res = await api.get(`/submissions/group/${groupId}`);
      setSubmissions(res.data.submissions);
      return res.data.submissions;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMySubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/submissions/mine");
      setSubmissions(res.data.submissions);
      return res.data.submissions;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submissions,
    loading,
    confirmSubmission,
    getAssignmentSubmissions,
    getGroupSubmissions,
    getMySubmissions,
  };
}
