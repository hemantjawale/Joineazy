import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { Assignment, Submission, User, Group, GroupMember, GroupTask } from "../models/index.js";

export const getOverview = async (req, res, next) => {
  try {
    const totalAssignments = await Assignment.count({
      where: { professorId: req.user.id },
    });

    const totalStudents = await User.count({
      where: { role: "student" },
    });

    const totalGroups = await Group.count();

    const assignments = await Assignment.findAll({
      where: { professorId: req.user.id },
      include: [{ model: Submission, as: "submissions" }],
    });

    let totalSubmissions = 0;
    let confirmedSubmissions = 0;

    assignments.forEach((a) => {
      totalSubmissions += a.submissions.length;
      confirmedSubmissions += a.submissions.filter((s) => s.status === "confirmed").length;
    });

    const recentAssignments = await Assignment.findAll({
      where: { professorId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 5,
      include: [{ model: Submission, as: "submissions" }],
    });

    const upcomingDeadlines = await Assignment.findAll({
      where: {
        professorId: req.user.id,
        dueDate: { [Op.gte]: new Date() },
      },
      order: [["dueDate", "ASC"]],
      limit: 5,
    });

    res.json({
      stats: {
        totalAssignments,
        totalStudents,
        totalGroups,
        totalSubmissions,
        confirmedSubmissions,
        submissionRate: totalSubmissions > 0
          ? Math.round((confirmedSubmissions / totalSubmissions) * 100)
          : 0,
      },
      recentAssignments,
      upcomingDeadlines,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentAnalytics = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        {
          model: Submission,
          as: "submissions",
          include: [
            { model: User, as: "user", attributes: ["id", "name", "email"] },
            { model: Group, as: "group", attributes: ["id", "name"] },
          ],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.professorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const totalStudents = await User.count({ where: { role: "student" } });
    const confirmedCount = assignment.submissions.filter((s) => s.status === "confirmed").length;
    const pendingCount = assignment.submissions.filter((s) => s.status === "pending").length;
    const notSubmitted = totalStudents - assignment.submissions.length;

    const groupSubmissions = {};
    assignment.submissions.forEach((sub) => {
      if (sub.group) {
        if (!groupSubmissions[sub.group.id]) {
          groupSubmissions[sub.group.id] = {
            groupName: sub.group.name,
            groupId: sub.group.id,
            confirmed: 0,
            pending: 0,
            members: [],
            totalTasks: 0,
            completedTasks: 0,
          };
        }
        groupSubmissions[sub.group.id].members.push({
          name: sub.user.name,
          email: sub.user.email,
          status: sub.status,
        });
        if (sub.status === "confirmed") {
          groupSubmissions[sub.group.id].confirmed++;
        } else {
          groupSubmissions[sub.group.id].pending++;
        }
      }
    });

    // Fetch tasks for each group for this assignment
    const groupIds = Object.keys(groupSubmissions);
    if (groupIds.length > 0) {
      const groupTasks = await GroupTask.findAll({
        where: {
          groupId: { [Op.in]: groupIds },
          assignmentId: assignment.id
        }
      });
      
      groupTasks.forEach(task => {
        if (groupSubmissions[task.groupId]) {
          groupSubmissions[task.groupId].totalTasks++;
          if (task.status === "done") {
            groupSubmissions[task.groupId].completedTasks++;
          }
        }
      });
    }

    res.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        type: assignment.type,
      },
      analytics: {
        totalStudents,
        confirmedCount,
        pendingCount,
        notSubmitted,
        completionRate: totalStudents > 0
          ? Math.round((confirmedCount / totalStudents) * 100)
          : 0,
      },
      groupBreakdown: Object.values(groupSubmissions),
      submissions: assignment.submissions,
    });
  } catch (error) {
    next(error);
  }
};