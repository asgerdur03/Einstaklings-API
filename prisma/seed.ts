import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';


async function main() {
    
    // Create 3 users
    const hashedPassword = await bcrypt.hash('password', 10);
    const users = await Promise.all([
        prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                admin: true,
                profilePic: 'https://i.pravatar.cc/150?img=1',
            },
        }),
        prisma.user.create({
            data: {
                username: 'user1',
                email: 'user1@users.com',
                password: hashedPassword,
                admin: false,
                profilePic: 'https://i.pravatar.cc/150?img=2',
            },
        }),
        prisma.user.create({
            data: {
                username: 'whiskers',
                email: 'whiskers@cats.com',
                password: 'ilovecats',
                admin: false,
                profilePic: 'https://i.pravatar.cc/150?img=3',
            },
        }),
        prisma.user.create({
            data: {
                username: 'meow',
                email: 'meow@cats.com',
                password: 'ilovecats',
                admin: false,
                profilePic: 'https://i.pravatar.cc/150?img=4',
            },
        }),
        prisma.user.create({
            data: {
                username: 'rawr',
                email: 'rawr@cats.com',
                password: 'ilovecats',
                admin: false,
                profilePic: 'https://i.pravatar.cc/150?img=4',
            },
        })
    ]);


    // Create 3 posts (1 per user)
    const posts = await Promise.all(
        users.map((user, i) =>
            prisma.post.create({
                data: {
                    userId: user.id,
                    imageUrl: `https://cataas.com/cat/says/${user.username}`,
                    caption: `Post #${i + 1} by ${user.username}`,
                    color: 'CALICO',
                    mood: 'PLAYFUL',
                    size: 'MEDIUM',
                    age: 'ADULT',
                },
            })
        )
    );

    // Create 2 comments per post
    const allComments = await Promise.all(
        posts.flatMap((post) =>
            users.slice(0, 2).map((user) =>
                prisma.comment.create({
                    data: {
                        postId: post.id,
                        userId: user.id,
                        text: `Nice post!`,
                    },
                })
            )
        )
    );

    console.log('✅ Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
