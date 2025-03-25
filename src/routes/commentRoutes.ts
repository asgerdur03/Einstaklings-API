import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteComment, updateComment, getAllComments, createComment} from "../lib/comments.db.js"


const commentRoutes = new Hono<{Variables: {user: AuthenticatedUser}}>();

interface AuthenticatedUser {
    id: string;
    admin: boolean;
}



commentRoutes.get("/", async (c) => {
    const comments = await getAllComments();
    // get comment by postId 

    return c.json({ data: comments });
})

commentRoutes.post("/", authMiddleware,async (c) => {
    // create a new comment
    return c.json({ message: "POST /comments" });
})

commentRoutes.delete("/:id", authMiddleware, async (c) => {
    // delete by id and userId is ...
    return c.json({ message: "DELETE /comments/:id" });
})

commentRoutes.patch("/:id", authMiddleware, async (c) => {
    return c.json({ message: "PATCH /comments/:id" });
})

export default commentRoutes;