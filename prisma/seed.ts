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
                username: 'slay',
                email: 'slay',
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
    ]);

    // Create 3 posts (1 per user)
    const posts = await Promise.all(
        users.map((user, i) =>
            prisma.post.create({
                data: {
                    userId: user.id,
                    imageUrl: `https://picsum.photos/200/300?random=${i + 1}`,
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
                        text: `Nice post, ${post.caption}!`,
                    },
                })
            )
        )
    );

    // Create 1 like per post by the last user
    const allLikes = await Promise.all(
        posts.map((post) =>
            prisma.like.create({
                data: {
                    postId: post.id,
                    userId: users[2].id,
                },
            })
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
