import prisma from "./client.js";

export async function getAllComments() {
    const comments = await prisma.comment.findMany();
    return comments ?? null;
}

export async function createComment(postId: string, userId: string, comment: string) {
    const newComment = await prisma.comment.create({
        data: {
            postId: postId,
            userId: userId,
            text: comment
        }
    });
    return newComment ?? null;
}


export async function deleteComment(commentId: string) {
    const comment = await prisma.comment.deleteMany({
        where: {
            id: commentId
        }
    });
    return comment ?? null;
}

export async function updateComment(commentId: string, comment: string) {
    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            text: comment
        }
    });
    return updatedComment ?? null;
}

export async function getCommentsByPostId(postId: string) {
    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        }
    });
    return comments ?? null;
}
