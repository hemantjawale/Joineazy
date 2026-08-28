import { Assignment, Submission } from "../models/index.js";

export const getStudentCalendar = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Fetch all assignments (for flat structure, we assume targetScope="all" means it applies to everyone)
    // If targetScope="specific", we'd need to check group memberships, but for now we fetch all or specific.
    const assignments = await Assignment.findAll({
      attributes: ["id", "title", "description", "dueDate", "type"],
    });

    const assignmentIds = assignments.map((a) => a.id);
    
    // Fetch submissions for these assignments by this student
    const submissions = await Submission.findAll({
      where: { userId: studentId, assignmentId: assignmentIds },
    });

    const submissionMap = {};
    submissions.forEach((sub) => {
      submissionMap[sub.assignmentId] = sub;
    });

    // Map to calendar events with status
    const events = assignments.map((assignment) => {
      const submission = submissionMap[assignment.id];
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      
      let status = "pending"; // default
      if (submission && submission.status !== "pending") {
        status = "submitted"; 
      } else if (dueDate < now) {
        status = "overdue";
      }

      return {
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        type: assignment.type,
        status, // "pending", "submitted", "overdue"
      };
    });

    res.json({ events });
  } catch (error) {
    next(error);
  }
};
