import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as bcrypt from "bcrypt"


async function main() {
    // create 10 users
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: `password${i}`,
                admin: false,
            },
        });
    }

    // create admin user
    const hashedPassword = await bcrypt.hash("password", 10);
    const user = await prisma.user.create({
        data: {
            username: "admin",
            email: "admin@admin.com",
            password: hashedPassword,
            admin: true,
        },
    });


    // create 10 posts
    for (let i = 0; i < 10; i++) {
        await prisma.post.create({
            data: {
                userId: user.id,
                imageUrl: `https://picsum.photos/200/300?random=${i}`,
                caption: `Post ${i}`,
                lat: 0,
                lng: 0,
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    