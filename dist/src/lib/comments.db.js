import prisma from "./client.js";
export async function getAllComments() {
    const comments = await prisma.comment.findMany();
    return comments ?? null;
}
export async function createComment(postId, userId, comment) {
    const newComment = await prisma.comment.create({
        data: {
            postId: postId,
            userId: userId,
            text: comment
        }
    });
    return newComment ?? null;
}
export async function deleteComment(commentId) {
    const comment = await prisma.comment.deleteMany({
        where: {
            id: commentId
        }
    });
    return comment ?? null;
}
export async function updateComment(commentId, comment) {
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
export async function getCommentsByPostId(postId) {
    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        }
    });
    return comments ?? null;
}
