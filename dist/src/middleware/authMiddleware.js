import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "a-string-secret-at-least-256-bits-long";
export async function authMiddleware(c, next) {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        c.set("user", decoded);
        console.log("Authenticated User ID:", c.get("user"));
        return next();
    }
    catch (error) {
        return c.json({ error: "Invalid token: " + error }, 401);
    }
}
export async function adminMiddleware(c, next) {
    const user = c.get("user");
    if (!user || !user.admin) {
        return c.json({ error: "Forbidden - Admin only" }, 403);
    }
    return next();
}
