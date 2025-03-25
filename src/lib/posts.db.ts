import prisma from "./client.js";
import {z} from "zod"
import xss from "xss";
import { Agent } from "http";


const postSchema = z.object({
    id: z.string(),
    userId: z.string(),
    imageUrl: z.string(),
    caption: z.string(),
    lat: z.number(),
    lng: z.number(),
    color: z.enum(["BLACK", "ORANGE", "GRAY", "WHITE", "MIXED", "BROWN", "TABBY", "CALICO", "TORTOISESHELL"]),
    mood: z.enum(["FRIENDLY", "SCARED", "CURIOUS", "PLAYFUL", "ANGRY", "SLEEPY", "ALERT"]),
    size: z.enum(["SMALL", "MEDIUM", "LARGE", "CHONKY"]),
    age: z.enum(["KITTEN", "ADULT", "SENIOR"]),
    createdAt: z.date()
})

const createPostSchema = z.object({
    imageUrl: z.string().nullable(),  // optional rn, but should not be
    caption: z.string(),// optional rn, but should not be
    lat: z.number(),  //optional
    lng: z.number(),//optional
    color: z.enum(["BLACK", "ORANGE", "GRAY", "WHITE", "MIXED", "BROWN", "TABBY", "CALICO", "TORTOISESHELL"]),
    mood: z.enum(["FRIENDLY", "SCARED", "CURIOUS", "PLAYFUL", "ANGRY", "SLEEPY", "ALERT"]),
    size: z.enum(["SMALL", "MEDIUM", "LARGE", "CHONKY"]),
    age: z.enum(["KITTEN", "ADULT", "SENIOR"]),
})

type Post = z.infer<typeof postSchema>

export async function deletePost(postId: string, userId: string) {
    const post = await prisma.post.deleteMany(
        {where: 
            {
                id: postId, 
                userId: userId
            }
        });
    console.log(post);
}
export async function getAllPosts(limit=10, offset?: number) {
    const posts = await prisma.post.findMany(
        {
            take: limit,
            skip: offset,
        }
    );
    return posts ?? null;
}

export async function getPostById(postId: string) {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });
    return post ?? null;
}

export async function createPost(post: z.infer<typeof createPostSchema>, userId: string) {
    const safeCaption = xss(post.caption);

    // todo: add the enums to the database

    const postInfo = await prisma.post.create({
        data: {
            userId: userId,
            imageUrl: post.imageUrl ?? null,
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

export async function updatePost(postId: string, userId: string, post: z.infer<typeof createPostSchema>) {
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
    })

    return updatedPost ?? null;

}