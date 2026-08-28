import { Submission, Assignment, User, Group, GroupMember } from "../models/index.js";

export const confirmSubmission = async (req, res, next) => {
  try {
    const { assignmentId, groupId, proofText } = req.body;

    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.type === "group" && groupId) {
      const membership = await GroupMember.findOne({
        where: { groupId, userId: req.user.id }
      });
      if (!membership || membership.role !== "leader") {
        return res.status(403).json({ message: "Only the group leader can submit group assignments." });
      }
    }

    const existing = await Submission.findOne({
      where: { assignmentId, userId: req.user.id },
    });

    if (existing && existing.status === "confirmed") {
      return res.status(409).json({ message: "Already confirmed" });
    }

    if (existing && existing.status === "pending") {
      existing.status = "confirmed";
      existing.confirmedAt = new Date();
      if (proofText) existing.proofText = proofText;
      await existing.save();

      // If group assignment, update for all members (dummy logic here implies one sub per group or sync)
      return res.json({ submission: existing, step: 2 });
    }

    const submission = await Submission.create({
      assignmentId,
      userId: req.user.id,
      groupId: groupId || null,
      status: "pending",
    });

    res.status(201).json({ submission, step: 1 });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.findAll({
      where: { assignmentId: req.params.id },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Group, as: "group", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};

export const getGroupSubmissions = async (req, res, next) => {
  try {
    const membership = await GroupMember.findOne({
      where: { groupId: req.params.groupId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const submissions = await Submission.findAll({
      where: { groupId: req.params.groupId },
      include: [
        { model: Assignment, as: "assignment" },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};

export const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Assignment, as: "assignment" },
        { model: Group, as: "group", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { gradeR1, gradeR2, gradeR3, feedback } = req.body;
    const submissionId = req.params.id;

    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.gradeR1 = gradeR1 || 0;
    submission.gradeR2 = gradeR2 || 0;
    submission.gradeR3 = gradeR3 || 0;
    submission.totalScore = (gradeR1 || 0) + (gradeR2 || 0) + (gradeR3 || 0);
    submission.feedback = feedback;
    submission.status = "graded";
    await submission.save();

    res.json({ submission });
  } catch (error) {
    next(error);
  }
};
