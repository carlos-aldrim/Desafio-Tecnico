import { prisma } from "../../utils/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import {
  validateRequiredFields,
  validateUserRole,
  validateUserExists,
} from "../../validators/userValidators.js";

export class UserService {
  static async listUsers() {
    return prisma.user.findMany();
  }

  static async createUser({ name, email, password, role }) {
    validateRequiredFields({ name, email, password });

    const userRole = role || "user";
    validateUserRole(userRole);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw { status: 409, message: "Email already registered" };
    }

    const hashedPassword = hashPassword(password);

    return prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    });
  }

  static async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !comparePassword(password, user.password)) {
      throw { status: 401, message: "Invalid credentials" };
    }
    return user;
  }

  static async getUserById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  static async updateUser(id, { name, email, password, role }) {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    validateUserExists(user);

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = hashPassword(password);
    if (role) dataToUpdate.role = role;

    return prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
  }

  static async deleteUser(id) {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    validateUserExists(user);

    await prisma.comment.deleteMany({ where: { userId: Number(id) } });
    await prisma.user.delete({ where: { id: Number(id) } });
    return { message: "User deleted successfully" };
  }

  static async listAdmins() {
    return prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true, name: true, email: true, role: true },
    });
  }
}