import { Course, CourseEnrollment, User } from "../models/index.js";
import crypto from "crypto";

export const createCourse = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Generate a unique 6-character join code
    const joinCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const course = await Course.create({
      name,
      description,
      joinCode,
      professorId: req.user.id,
    });

    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    let courses;
    if (req.user.role === "professor") {
      courses = await Course.findAll({ where: { professorId: req.user.id } });
    } else {
      const userWithCourses = await User.findByPk(req.user.id, {
        include: [{
          model: Course,
          as: "enrolledCourses",
          include: [{ model: User, as: "professor", attributes: ["name"] }]
        }]
      });
      courses = userWithCourses ? userWithCourses.enrolledCourses : [];
    }
    res.json({ courses });
  } catch (error) {
    next(error);
  }
};

export const joinCourse = async (req, res, next) => {
  try {
    const { joinCode } = req.body;

    const course = await Course.findOne({ where: { joinCode } });
    if (!course) {
      return res.status(404).json({ message: "Course not found. Check the join code." });
    }

    const existing = await CourseEnrollment.findOne({
      where: { courseId: course.id, studentId: req.user.id }
    });

    if (existing) {
      return res.status(409).json({ message: "You are already enrolled in this course." });
    }

    await CourseEnrollment.create({
      courseId: course.id,
      studentId: req.user.id,
    });

    res.status(200).json({ message: "Successfully joined the course!", course });
  } catch (error) {
    next(error);
  }
};

export const getEnrolledStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ 
      where: { id, professorId: req.user.id },
      include: [{
        model: User,
        as: "students",
        attributes: ["id", "name", "email"]
      }]
    });
    
    if (!course) {
      return res.status(403).json({ message: "Not authorized to view this course." });
    }

    res.json({ students: course.students || [] });
  } catch (error) {
    next(error);
  }
};
