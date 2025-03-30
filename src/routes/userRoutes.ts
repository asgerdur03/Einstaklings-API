
import { Hono } from "hono";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

import { registerUser, validateUser, login, getAllUsers , findUserById, updateUser, deleteUser} from "../lib/users.db.js";
import { use } from "hono/jsx";


const userRoutes = new Hono<{Variables: {user: AuthenticatedUser}}>();

interface AuthenticatedUser {
    id: string;
    admin: boolean;
}
// login route, returns the token✅
userRoutes.post("/login", async(c) => {
    const userToLogin = await c.req.json();
    
    try {
        
        const token = await login(userToLogin.username, userToLogin.email, userToLogin.password);

        if (!token) {
            return c.json({ error: "Invalid username or password" }, 401);
        }
        return c.json(token);

    } catch (error) {
        return c.json({ error: "Error logging in: " + error} );
    }    
});

// register new user if name is not taken ✅
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
    if (newUser) {
        const {password, ...rest} = newUser
        return c.json(rest);
    }

    //return c.json({ message: "POST /user/register", user: newUser });
    
});

// admin route, get all users ✅
userRoutes.get("/", authMiddleware, adminMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;
    if (!user || !user.admin) {
        return c.json({ error: "Forbidden - Admin only" }, 403);
    }
    const users = await getAllUsers();

    return c.json(users);	
})


// get the logged in user ✅
userRoutes.get("/me", authMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;
    if (!user) {
        return c.json({ error: "not logged in" }, 401);
    }
    const userId = user.id;
    const userInfo = await findUserById(userId);

    return c.json(userInfo);
})

// edit the logged in users info ✅
userRoutes.patch("/me", authMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;
    const userId = user.id;

    const updatedUser = await c.req.json();
    const updatedUserInfo = await updateUser(userId, updatedUser);

    return c.json(updatedUserInfo);
})

// delete logged in users account ✅
userRoutes.delete("/me",  authMiddleware, async (c) => {
    const user = c.get("user") as AuthenticatedUser;
    const userId = user.id;

    await deleteUser(userId);
    return c.json({ message: "DELETE /user/me/" });
})

// TODO: maybe add some admin routes, like deleting users


userRoutes.get("/find/:id", async (c) => {
    const userId = c.req.param("id");
    const user = await findUserById(userId);

    return c.json(user);
})


export default userRoutes;
