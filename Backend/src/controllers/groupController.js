import { Group, GroupMember, User } from "../models/index.js";

export const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdById: req.user.id,
    });

    await GroupMember.create({
      groupId: group.id,
      userId: req.user.id,
      role: "leader",
      status: "active",
    });

    const fullGroup = await Group.findByPk(group.id, {
      include: [
        { model: GroupMember, as: "members", include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json({ group: fullGroup });
  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const memberships = await GroupMember.findAll({
      where: { userId: req.user.id, status: "active" },
      attributes: ["groupId"],
    });

    const groupIds = memberships.map((m) => m.groupId);

    const groups = await Group.findAll({
      where: { id: groupIds },
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

export const getGroup = async (req, res, next) => {
  try {
    const membership = await GroupMember.findOne({
      where: { groupId: req.params.id, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

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

    res.json({ group });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const groupId = req.params.id;

    const leadership = await GroupMember.findOne({
      where: { groupId, userId: req.user.id, role: "leader" },
    });

    if (!leadership) {
      return res.status(403).json({ message: "Only group leaders can add members" });
    }

    const user = await User.findOne({ where: { email, role: "student" } });
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingMember = await GroupMember.findOne({
      where: { groupId, userId: user.id },
    });

    if (existingMember) {
      return res.status(409).json({ message: "User is already a member" });
    }

    await GroupMember.create({
      groupId,
      userId: user.id,
      role: "member",
      status: "pending",
    });

    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
        },
      ],
    });

    res.status(201).json({ group });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params;

    const leadership = await GroupMember.findOne({
      where: { groupId, userId: req.user.id, role: "leader" },
    });

    if (!leadership) {
      return res.status(403).json({ message: "Only group leaders can remove members" });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot remove yourself as leader" });
    }

    const member = await GroupMember.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await member.destroy();
    res.json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "name", "email"],
      order: [["name", "ASC"]],
    });

    res.json({ students });
  } catch (error) {
    next(error);
  }
};

export const getInvitations = async (req, res, next) => {
  try {
    const memberships = await GroupMember.findAll({
      where: { userId: req.user.id, status: "pending" },
      attributes: ["groupId"],
    });

    const groupIds = memberships.map((m) => m.groupId);

    const groups = await Group.findAll({
      where: { id: groupIds },
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ groups });
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req, res, next) => {
  try {
    const membership = await GroupMember.findOne({
      where: { groupId: req.params.id, userId: req.user.id, status: "pending" },
    });
    
    if (!membership) {
      return res.status(404).json({ message: "Invitation not found" });
    }
    
    membership.status = "active";
    await membership.save();
    
    res.json({ message: "Invitation accepted" });
  } catch (error) {
    next(error);
  }
};

export const rejectInvitation = async (req, res, next) => {
  try {
    const membership = await GroupMember.findOne({
      where: { groupId: req.params.id, userId: req.user.id, status: "pending" },
    });
    
    if (!membership) {
      return res.status(404).json({ message: "Invitation not found" });
    }
    
    await membership.destroy();
    
    res.json({ message: "Invitation rejected" });
  } catch (error) {
    next(error);
  }
};
