import { Group, GroupMember, GroupTask, User, Submission, Assignment } from "../models/index.js";

export const getAllGroupsForProfessor = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
        },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ groups });
  } catch (error) {
    next(error);
  }
};

export const getGroupDetailForProfessor = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
        },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const tasks = await GroupTask.findAll({
      where: { groupId: group.id },
      include: [
        { model: User, as: "assignedTo", attributes: ["id", "name", "email"] },
        { model: User, as: "taskCreator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const memberIds = group.members.map((m) => m.userId);

    const submissions = await Submission.findAll({
      where: { userId: memberIds },
      include: [
        { model: Assignment, as: "assignment", attributes: ["id", "title", "dueDate", "type"] },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });

    res.json({ group, tasks, submissions });
  } catch (error) {
    next(error);
  }
};

export const getAllStudentsForProfessor = async (req, res, next) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "name", "email", "createdAt"],
      order: [["name", "ASC"]],
    });

    const memberships = await GroupMember.findAll({
      include: [
        { model: Group, as: "group", attributes: ["id", "name"] },
        { model: User, as: "user", attributes: ["id"], where: { role: "student" } },
      ],
    });

    const studentGroupMap = {};
    memberships.forEach((m) => {
      if (!studentGroupMap[m.userId]) {
        studentGroupMap[m.userId] = [];
      }
      studentGroupMap[m.userId].push({
        id: m.group.id,
        name: m.group.name,
        role: m.role,
      });
    });

    const enrichedStudents = students.map((s) => ({
      ...s.toJSON(),
      groups: studentGroupMap[s.id] || [],
    }));

    res.json({ students: enrichedStudents });
  } catch (error) {
    next(error);
  }
};

import { Op } from "sequelize";

export const getDashboardAttention = async (req, res, next) => {
  try {
    const professorId = req.user.id;
    const now = new Date();

    // 1. Assignments past due date (Overdue work tracking)
    const assignments = await Assignment.findAll({ where: { professorId } });
    const assignmentIds = assignments.map(a => a.id);

    // 2. Fetch submissions
    const submissions = await Submission.findAll({
      where: { assignmentId: assignmentIds },
    });

    let overdueWork = 0;
    let pendingGrading = 0;
    
    assignments.forEach(a => {
      if (new Date(a.dueDate) < now) {
        // Count students who haven't submitted
        const subsForA = submissions.filter(s => s.assignmentId === a.id);
        const late = subsForA.filter(s => s.status === "pending").length;
        overdueWork += late;
      }
    });

    pendingGrading = submissions.filter(s => s.status === "confirmed").length;

    // 3. Inactive teams (No tasks updated in last 4 days)
    const fourDaysAgo = new Date(now.setDate(now.getDate() - 4));
    const inactiveTasks = await GroupTask.findAll({
      where: { updatedAt: { [Op.lt]: fourDaysAgo } }
    });

    const stats = {
      overdueWork,
      pendingGrading,
      inactiveTeams: new Set(inactiveTasks.map(t => t.groupId)).size,
      missedAssignments: 0, // Placeholder
      totalStudents: await User.count({ where: { role: "student" } }),
      totalAssignments: assignments.length,
      submitted: submissions.filter(s => s.status !== "pending").length,
      pending: submissions.filter(s => s.status === "pending").length,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getStudentReportCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await User.findByPk(id, { attributes: ["id", "name", "email"] });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const submissions = await Submission.findAll({
      where: { userId: id },
      include: [{ model: Assignment, as: "assignment", attributes: ["title", "dueDate", "type"] }]
    });

    let totalScore = 0;
    let maxPossible = submissions.length * 30; // Assuming 10 for each R1,R2,R3

    const gradedSubmissions = submissions.map(s => {
      totalScore += (s.totalScore || 0);
      return {
        assignmentTitle: s.assignment.title,
        type: s.assignment.type,
        r1: s.gradeR1,
        r2: s.gradeR2,
        r3: s.gradeR3,
        total: s.totalScore,
        feedback: s.feedback,
        status: s.status
      };
    });

    res.json({
      student,
      report: {
        totalAssignments: submissions.length,
        completed: submissions.filter(s => s.status !== "pending").length,
        totalScore,
        maxPossible,
        percentage: maxPossible > 0 ? ((totalScore / maxPossible) * 100).toFixed(1) : 0,
        submissions: gradedSubmissions
      }
    });
  } catch (error) {
    next(error);
  }
};
