import prisma from "./client.js";
import { z } from "zod";
import xss from "xss";
const postSchema = z.object({
    id: z.string(),
    userId: z.string(),
    imageUrl: z.string(),
    caption: z.string(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    color: z.enum(["BLACK", "ORANGE", "GRAY", "WHITE", "MIXED", "BROWN", "TABBY", "CALICO", "TORTOISESHELL"]).nullable(),
    mood: z.enum(["FRIENDLY", "SCARED", "CURIOUS", "PLAYFUL", "ANGRY", "SLEEPY", "ALERT"]).nullable(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE", "CHONKY"]).nullable(),
    age: z.enum(["KITTEN", "ADULT", "SENIOR"]).nullable(),
    createdAt: z.date()
});
const createPostSchema = z.object({
    imageUrl: z.string(),
    caption: z.string(),
    lat: z.number().nullable(), //optional
    lng: z.number(), //optional
    color: z.enum(["BLACK", "ORANGE", "GRAY", "WHITE", "MIXED", "BROWN", "TABBY", "CALICO", "TORTOISESHELL"]).nullable(),
    mood: z.enum(["FRIENDLY", "SCARED", "CURIOUS", "PLAYFUL", "ANGRY", "SLEEPY", "ALERT"]).nullable(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE", "CHONKY"]).nullable(),
    age: z.enum(["KITTEN", "ADULT", "SENIOR"]).nullable(),
});
export async function deletePost(postId, userId) {
    const post = await prisma.post.deleteMany({ where: {
            id: postId,
            userId: userId
        }
    });
    console.log(post);
}
export async function getAllPosts(limit = 10, offset) {
    const posts = await prisma.post.findMany({
        take: limit,
        skip: offset,
    });
    return posts ?? null;
}
export async function getPostById(postId) {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });
    return post ?? null;
}
export async function createPost(post, userId) {
    const safeCaption = xss(post.caption);
    const postInfo = await prisma.post.create({
        data: {
            userId: userId,
            imageUrl: post.imageUrl,
            caption: safeCaption,
            lat: post.lat,
            lng: post.lng,
            color: post.color,
            mood: post.mood,
            size: post.size,
            age: post.age
        }
    });
    return postInfo ?? null;
}
export async function updatePost(postId, userId, post) {
    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
            userId: userId
        },
        data: {
            imageUrl: post.imageUrl ?? "",
            caption: post.caption,
            lat: post.lat,
            lng: post.lng,
            color: post.color,
            mood: post.mood,
            size: post.size,
            age: post.age
        }
    });
    return updatedPost ?? null;
}
export async function getPostsByUserId(userId) {
    const posts = await prisma.post.findMany({
        where: {
            userId: userId
        }
    });
    return posts ?? null;
}
