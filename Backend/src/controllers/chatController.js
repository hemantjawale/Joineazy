import { ChatMessage, GroupMember, User } from "../models/index.js";

export const getMessages = async (req, res, next) => {
  try {
    const membership = await GroupMember.findOne({
      where: { groupId: req.params.groupId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const { limit = 50, offset = 0 } = req.query;

    const messages = await ChatMessage.findAndCountAll({
      where: { groupId: req.params.groupId },
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "ASC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      messages: messages.rows,
      total: messages.count,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { groupId, content } = req.body;

    const membership = await GroupMember.findOne({
      where: { groupId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const message = await ChatMessage.create({
      groupId,
      senderId: req.user.id,
      content,
    });

    const fullMessage = await ChatMessage.findByPk(message.id, {
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json({ message: fullMessage });
  } catch (error) {
    next(error);
  }
};
