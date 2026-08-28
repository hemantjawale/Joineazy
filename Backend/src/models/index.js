import User from "./User.js";
import Assignment from "./Assignment.js";
import Group from "./Group.js";
import GroupMember from "./GroupMember.js";
import Submission from "./Submission.js";
import GroupTask from "./GroupTask.js";
import ChatMessage from "./ChatMessage.js";
import Course from "./Course.js";
import CourseEnrollment from "./CourseEnrollment.js";

// Course Relations
User.hasMany(Course, { foreignKey: "professorId", as: "coursesTaught" });
Course.belongsTo(User, { foreignKey: "professorId", as: "professor" });

Course.belongsToMany(User, { through: CourseEnrollment, foreignKey: "courseId", as: "students" });
User.belongsToMany(Course, { through: CourseEnrollment, foreignKey: "studentId", as: "enrolledCourses" });

// Modify Assignment to belong to a Course instead of just floating
Course.hasMany(Assignment, { foreignKey: "courseId", as: "assignments" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Assignment, { foreignKey: "professorId", as: "assignments" });
Assignment.belongsTo(User, { foreignKey: "professorId", as: "professor" });

User.hasMany(Group, { foreignKey: "createdById", as: "createdGroups" });
Group.belongsTo(User, { foreignKey: "createdById", as: "creator" });

Group.hasMany(GroupMember, { foreignKey: "groupId", as: "members" });
GroupMember.belongsTo(Group, { foreignKey: "groupId", as: "group" });

User.hasMany(GroupMember, { foreignKey: "userId", as: "groupMemberships" });
GroupMember.belongsTo(User, { foreignKey: "userId", as: "user" });

Assignment.hasMany(Submission, { foreignKey: "assignmentId", as: "submissions" });
Submission.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

User.hasMany(Submission, { foreignKey: "userId", as: "submissions" });
Submission.belongsTo(User, { foreignKey: "userId", as: "user" });

Group.hasMany(Submission, { foreignKey: "groupId", as: "submissions" });
Submission.belongsTo(Group, { foreignKey: "groupId", as: "group" });

Group.hasMany(GroupTask, { foreignKey: "groupId", as: "tasks" });
GroupTask.belongsTo(Group, { foreignKey: "groupId", as: "group" });

Assignment.hasMany(GroupTask, { foreignKey: "assignmentId", as: "tasks" });
GroupTask.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

User.hasMany(GroupTask, { foreignKey: "assignedToId", as: "assignedTasks" });
GroupTask.belongsTo(User, { foreignKey: "assignedToId", as: "assignedTo" });

User.hasMany(GroupTask, { foreignKey: "createdById", as: "createdTasks" });
GroupTask.belongsTo(User, { foreignKey: "createdById", as: "taskCreator" });

Group.hasMany(ChatMessage, { foreignKey: "groupId", as: "messages" });
ChatMessage.belongsTo(Group, { foreignKey: "groupId", as: "group" });

User.hasMany(ChatMessage, { foreignKey: "senderId", as: "chatMessages" });
ChatMessage.belongsTo(User, { foreignKey: "senderId", as: "sender" });

export {
  User,
  Assignment,
  Group,
  GroupMember,
  Submission,
  GroupTask,
  ChatMessage,
  Course,
  CourseEnrollment,
};
