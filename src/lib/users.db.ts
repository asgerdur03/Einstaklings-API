
import prisma from "./client.js";
import {z} from "zod"
import xss from "xss";
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "a-string-secret-at-least-256-bits-long";

const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
    admin: z.boolean(),
    createdAt: z.date()
    
})

const createUserSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    profilePic: z.string()
})

type User = z.infer<typeof userSchema>

export async function getAllUsers(limit=10, offset?: number): Promise<Array<User>|null> {
    const users = await prisma.user.findMany(
        {
            take: limit,
            skip: offset,
        }
    );
    return users ?? null;
}

export async function registerUser(body: z.infer<typeof createUserSchema>): Promise<User|null> {

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
            profilePic: body.profilePic
        }
    })
    return user ?? null;
}


export async function login(username: string, email: string, password: string) {
    const user = await getUser(username, email);

    if (!user) {
        return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        console.log("Invalid password");
        return "Invalid password";
    }

    const token =  jwt.sign({ id: user.id, admin: user.admin }, SECRET_KEY, { expiresIn: "3h" });

    return token;

}

export async function getUser(username: string, email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
            email: email
        }
    });
    return user ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            posts: true
        }

    });
    return user ?? null;
}

export async function validateUser(user: unknown) {
    const result = createUserSchema.safeParse(user);
    return result;

}


export async function updateUser(userId: string, body: z.infer<typeof createUserSchema>):Promise<User|null> {
    const safeUsername = xss(body.username);
    const safeEmail = xss(body.email);
    const safePassword = xss(body.password);
    const safeProfilePic = xss(body.profilePic);

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            username: safeUsername,
            email: safeEmail,
            password: safePassword,
            profilePic: safeProfilePic
        }
    });
    return user ?? null;

}

export async function deleteUser(userId: string) {
    const user = await prisma.user.delete({
        where: {
            id: userId
        }
    });
    return user ?? null;
}



