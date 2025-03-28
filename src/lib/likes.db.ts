import  prisma  from "./client.js";	


export async function getAllLikes() {
    const likes = await prisma.like.findMany();
    return likes ?? null;
}

export async function createLike(postId: string, userId: string) {
    const like = await prisma.like.create(
        { data: 
            { 
                postId: postId, 
                userId: userId 
            } 
        });
    return like ?? null;
}

export async function toggleLike(postId: string, userId: string) {
    const like = await prisma.like.findFirst({
        where: { postId, userId },
    });

    if (like) {
        await prisma.like.delete({
            where: {id : like.id},
        });
        return {liked: false}
    } else {
        await prisma.like.create({
            data: {
                postId: postId,
                userId: userId,
            },
        });
        return {liked: true}
    }

}

export async function getLikesByPostId(postId: string) {
    const likes = await prisma.like.findMany({
        where: { postId },
    });
    return likes ?? null;
}
