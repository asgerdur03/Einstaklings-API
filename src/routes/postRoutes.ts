
import { cloudinary } from "../lib/cloudinary.js";
import { IncomingForm } from "formidable";
import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {deletePost, updatePost, getAllPosts, getPostById, createPost, getPostsByUserId} from "../lib/posts.db.js"
import { raw } from "@prisma/client/runtime/library";
import { use } from "hono/jsx";

const postRoutes = new Hono<{Variables: {user: AuthenticatedUser}}>()

interface AuthenticatedUser {
    id: string;
    admin: boolean;
}

// all posts for feed, paginated ✅
postRoutes.get("/", async (c) => {
    // not user specific, but to view you have to be logged in
    const posts = await getAllPosts();

    return c.json({data: posts});
})

//get single post ✅
postRoutes.get("/:id",async (c) => {
    const postId = c.req.param("id");

    const post = await getPostById(postId);

    return c.json({data: post});
})

// create a new post ✅
postRoutes.post("/", authMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;
    const userId = user.id;

    const body = await c.req.json();

    const newPost = await createPost(body, userId);

    return c.json({data: newPost});

});

/*
    const color = body.color?.toString() as
    | 'BLACK' | 'ORANGE' | 'GRAY' | 'WHITE'
    | 'MIXED' | 'BROWN' | 'TABBY' | 'CALICO' | 'TORTOISESHELL' | null;

const mood = body.mood?.toString() as
    | 'FRIENDLY' | 'SCARED' | 'CURIOUS' | 'PLAYFUL'
    | 'ANGRY' | 'SLEEPY' | 'ALERT' | null;

const size = body.size?.toString() as 'SMALL' | 'MEDIUM' | 'LARGE' | 'CHONKY' | null;
const age = body.age?.toString() as 'KITTEN' | 'ADULT' | 'SENIOR' | null;

    const newPost = {
        userId: userId,
        imageUrl: cloudinaryResult.secure_url.toString(),
        caption: body.caption.toString(),
        lat: parseFloat(body.lat.toString()), //body.lat,
        lng: parseFloat(body.lng.toString()), //body.lng.toString(),
        color: color,
        mood:mood,
        size: size,
        age: age,
    }*/







    



// update a post ✅
postRoutes.patch("/:id", authMiddleware, async (c) => {
    const postId = c.req.param("id");
    const user = c.get("user") as AuthenticatedUser;
    const userId = user.id;

    const updatedPost = await c.req.json();

    await updatePost(postId, userId, updatedPost);



    return c.json({data: updatedPost});
})

// delete a post ✅
postRoutes.delete("/:id", authMiddleware, async (c) => {
    const postId = c.req.param("id");
    const user = c.get("user") as AuthenticatedUser;
    const userId = user.id;

    await deletePost(postId, userId);

    return c.json({ message: "DELETE /posts/:id" });
})

postRoutes.get("/users/:id", async (c) => {
    const userId = c.req.param("id");

    const posts = await getPostsByUserId(userId);

    return c.json({data: posts});
})


export default postRoutes