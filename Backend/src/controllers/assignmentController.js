import { Assignment, User, Submission } from "../models/index.js";

export const createAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, oneDriveLink, type, targetScope } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      oneDriveLink,
      type: type || "individual",
      targetScope: targetScope || "all",
      professorId: req.user.id,
    });

    res.status(201).json({ assignment });
  } catch (error) {
    next(error);
  }
};

export const getAssignments = async (req, res, next) => {
  try {
    const where = {};

    if (req.user.role === "professor") {
      where.professorId = req.user.id;
    }

    const assignments = await Assignment.findAll({
      where,
      include: [
        { model: User, as: "professor", attributes: ["id", "name", "email"] },
        { model: Submission, as: "submissions", attributes: ["id", "status", "userId", "groupId"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ assignments });
  } catch (error) {
    next(error);
  }
};

export const getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        { model: User, as: "professor", attributes: ["id", "name", "email"] },
        {
          model: Submission,
          as: "submissions",
          include: [
            { model: User, as: "user", attributes: ["id", "name", "email"] },
          ],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ assignment });
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.professorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, dueDate, oneDriveLink, type, targetScope } = req.body;

    await assignment.update({
      title: title || assignment.title,
      description: description !== undefined ? description : assignment.description,
      dueDate: dueDate || assignment.dueDate,
      oneDriveLink: oneDriveLink || assignment.oneDriveLink,
      type: type || assignment.type,
      targetScope: targetScope || assignment.targetScope,
    });

    res.json({ assignment });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.professorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await assignment.destroy();
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    next(error);
  }
};
