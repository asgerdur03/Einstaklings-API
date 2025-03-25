

import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {deletePost, updatePost, getAllPosts, getPostById, createPost} from "../lib/posts.db.js"

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

    const newPost = await c.req.json();

    const post = await createPost(newPost, userId);

    return c.json({data: post});
})

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


export default postRoutes