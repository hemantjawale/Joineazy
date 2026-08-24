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
