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

export async function deleteLike(postId: string, userId: string) {
    const like = await prisma.like.deleteMany(
        {where: 
            { 
                postId: postId, 
                userId: userId 
            } 
        });
    return like ?? null;
}

