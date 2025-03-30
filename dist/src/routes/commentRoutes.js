import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteComment, updateComment, getAllComments, createComment, getCommentsByPostId } from "../lib/comments.db.js";
import { date } from "zod";
const commentRoutes = new Hono();
//
commentRoutes.get("/", async (c) => {
    const comments = await getAllComments();
    return c.json(comments);
});
commentRoutes.post("/", authMiddleware, async (c) => {
    // create a new comment
    const { postId, comment } = await c.req.json();
    const user = c.get("user");
    const userId = user.id;
    const newComment = await createComment(postId, userId, comment);
    return c.json(newComment);
});
commentRoutes.delete("/:id", authMiddleware, async (c) => {
    const commentId = c.req.param("id");
    await deleteComment(commentId);
    return c.json({ message: "DELETE /comments/:id" });
});
commentRoutes.patch("/:id", authMiddleware, async (c) => {
    const commentId = c.req.param("id");
    const data = await c.req.json();
    const comment = await updateComment(commentId, data.text);
    return c.json(comment);
});
commentRoutes.get("/:id", async (c) => {
    const postId = c.req.param("id");
    const comments = await getCommentsByPostId(postId);
    return c.json(comments);
});
export default commentRoutes;
