import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteLike, createLike, getAllLikes} from "../lib/likes.db.js"

const likeRoutes = new Hono<{Variables: {user: AuthenticatedUser}}>();

interface AuthenticatedUser {
    id: string;
    admin: boolean;
}

// likes by their postId


likeRoutes.get("/", async (c) => {
    const likes = await getAllLikes();
    return c.json({ date: likes });
})

likeRoutes.post("/", authMiddleware, async (c) => {
    // create like where userID = c.get("user") and postID = ?
    return c.json({ message: "POST /likes" });
})

likeRoutes.delete("/", authMiddleware, async (c) => {
    // delete like where userID = c.get("user") and postID = ? 
    
    return c.json({ message: "DELETE /likes" });
})


export default likeRoutes;