import prisma from "./client.js";
import { z } from "zod";
import xss from "xss";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { profile } from "console";
import { use } from "hono/jsx";
const SECRET_KEY = process.env.JWT_SECRET || "a-string-secret-at-least-256-bits-long";
const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
    profilePic: z.string().nullable(),
    admin: z.boolean(),
    createdAt: z.date()
});
const createUserSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    profilePic: z.string().nullable()
});
export async function getAllUsers(limit = 10, offset) {
    const users = await prisma.user.findMany({
        take: limit,
        skip: offset,
    });
    return users ?? null;
}
export async function registerUser(body) {
    const safeUsername = xss(body.username);
    const safeEmail = xss(body.email);
    const safePassword = xss(body.password);
    const password = await bcrypt.hash(safePassword, 10);
    const user = await prisma.user.create({
        data: {
            username: safeUsername,
            email: safeEmail,
            password: password,
            admin: false,
            profilePic: null
        }
    });
    return user ?? null;
}
export async function login(username, email, password) {
    const user = await getUser(username, email);
    if (!user) {
        return null;
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        console.log("Invalid password");
        return "Invalid password";
    }
    const token = jwt.sign({ id: user.id, admin: user.admin }, SECRET_KEY, { expiresIn: "3h" });
    return { token, user };
}
export async function getUser(username, email) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
            email: email
        }
    });
    return user ?? null;
}
export async function findUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    return user ?? null;
}
export async function validateUser(user) {
    const result = createUserSchema.safeParse(user);
    return result;
}
export async function updateUser(userId, body) {
    const safeUsername = xss(body.username);
    const safeEmail = xss(body.email);
    const safePassword = xss(body.password);
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            username: safeUsername,
            email: safeEmail,
            password: safePassword,
            profilePic: body.profilePic
        }
    });
    return user ?? null;
}
export async function deleteUser(userId) {
    const user = await prisma.user.delete({
        where: {
            id: userId
        }
    });
    return user ?? null;
}
