
import { Hono } from "hono";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

import { registerUser, validateUser, login, getAllUsers , findUserById} from "../lib/users.db.js";


const userRoutes = new Hono<{Variables: {user: AuthenticatedUser}}>();

interface AuthenticatedUser {
    id: string;
    admin: boolean;
}

userRoutes.post("/login", async(c) => {
    const userToLogin = await c.req.json();
    
    try {
        
        const token = await login(userToLogin.username, userToLogin.email, userToLogin.password);

        if (!token) {
            return c.json({ error: "Invalid username or password" }, 401);
        }
        return c.json({ message: 'POST /user/login', token: token });

    } catch (error) {
        return c.json({ error: "Error logging in: " + error} );
    }    
});

userRoutes.post("/register", async (c) => {
    let userToCreate: unknown;

    try {
        userToCreate = await c.req.json();
    } catch (error) {
        return c.json({ error: "Invalid JSON" }, 400);
    }

    const validUser = await validateUser(userToCreate);

    if (!validUser.success) {
        return c.json({ error: validUser.error.flatten() }, 400);
    }

    const newUser = await registerUser(validUser.data);

    return c.json({ message: "POST /user/register", user: newUser });
    
});

// admin route, get all users
userRoutes.get("/", authMiddleware, adminMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;
    if (!user || !user.admin) {
        return c.json({ error: "Forbidden - Admin only" }, 403);
    }
    const users = await getAllUsers();

    return c.json({ message: "GET /user/", users: users ?? [] });
})


// get the logged in user
userRoutes.get("/me", authMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;

    if (!user) {
        return c.json({ error: "not logged in" }, 401);
    }

    const userId = user.id;
    const userInfo = await findUserById(userId);


    return c.json({ message: "GET /user/:id", user: userInfo });
})

// edit the logged in users info
userRoutes.post("/me", authMiddleware, async (c) => {
    return c.json({ message: "POST /user/me/:id" });
})

// delete logged in users account
userRoutes.delete("/me",  authMiddleware, async (c) => {
    return c.json({ message: "DELETE /user/me/:id" });
})


// TODO: maybe add some admin routes, like deleting users


export default userRoutes;
