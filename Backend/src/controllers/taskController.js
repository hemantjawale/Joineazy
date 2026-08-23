import { GroupTask, GroupMember, User } from "../models/index.js";

export const createTask = async (req, res, next) => {
  try {
    const { groupId, assignmentId, title, description, assignedToId } = req.body;

    const membership = await GroupMember.findOne({
      where: { groupId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const task = await GroupTask.create({
      groupId,
      assignmentId: assignmentId || null,
      title,
      description,
      assignedToId,
      createdById: req.user.id,
      status: "todo",
    });

    const fullTask = await GroupTask.findByPk(task.id, {
      include: [
        { model: User, as: "assignedTo", attributes: ["id", "name", "email"] },
        { model: User, as: "taskCreator", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json({ task: fullTask });
  } catch (error) {
    next(error);
  }
};

export const getGroupTasks = async (req, res, next) => {
  try {
    const membership = await GroupMember.findOne({
      where: { groupId: req.params.groupId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const tasks = await GroupTask.findAll({
      where: { groupId: req.params.groupId },
      include: [
        { model: User, as: "assignedTo", attributes: ["id", "name", "email"] },
        { model: User, as: "taskCreator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await GroupTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const membership = await GroupMember.findOne({
      where: { groupId: task.groupId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, status, assignedToId } = req.body;

    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      assignedToId: assignedToId || task.assignedToId,
    });

    const updatedTask = await GroupTask.findByPk(task.id, {
      include: [
        { model: User, as: "assignedTo", attributes: ["id", "name", "email"] },
        { model: User, as: "taskCreator", attributes: ["id", "name", "email"] },
      ],
    });

    res.json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await GroupTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdById !== req.user.id) {
      return res.status(403).json({ message: "Only task creator can delete" });
    }

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
