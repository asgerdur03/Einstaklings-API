import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { toggleLike, getLikesByPostId, getAllLikes } from "../lib/likes.db.js";
const likeRoutes = new Hono();
// likes by their postId
likeRoutes.get("/", async (c) => {
    const likes = await getAllLikes();
    return c.json(likes);
});
likeRoutes.post("/", authMiddleware, async (c) => {
    // create like where userID = c.get("user") and postID = ?
    const { postId } = await c.req.json();
    const user = c.get("user");
    if (!user) {
        return c.json({ error: "not logged in" }, 401);
    }
    const res = await toggleLike(postId, user.id);
    return c.json(res);
});
likeRoutes.get("/:id", async (c) => {
    const postId = c.req.param("id");
    const likes = await getLikesByPostId(postId);
    const count = likes.length;
    return c.json(likes);
});
export default likeRoutes;
