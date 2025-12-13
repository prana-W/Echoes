import mongoose from 'mongoose';
import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import TimeCapsule from '../../models/timeCapsule/timeCapsule.model.js';
import TimeCapsuleComment from '../../models/timeCapsule/timeCapsuleComment.model.js';

const addCommentToCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const {text} = req.body;
    const userId = req.userId;

    if (!text || !text.trim()) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Comment text is required');
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, 'Time capsule not found');
    }

    const userIdStr = userId.toString();
    const hasAccess =
        capsule.owner.toString() === userIdStr ||
        capsule.contributors.some((id) => id.toString() === userIdStr) ||
        capsule.recipients.some((id) => id.toString() === userIdStr);

    if (!hasAccess) {
        throw new ApiError(statusCode.FORBIDDEN, 'Access denied');
    }

    const comment = await TimeCapsuleComment.create({
        capsule: timecapsuleId,
        user: userId,
        text,
    });

    return res
        .status(statusCode.CREATED)
        .json(new ApiResponse(statusCode.CREATED, 'Comment added', comment));
});

const editComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {text} = req.body;
    const userId = req.userId;

    if (!text || !text.trim()) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Updated text is required');
    }

    const comment = await TimeCapsuleComment.findById(commentId);
    if (!comment) {
        throw new ApiError(statusCode.NOT_FOUND, 'Comment not found');
    }

    if (comment.user.toString() !== userId) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            'You can only edit your own comments'
        );
    }

    comment.text = text;
    await comment.save();

    return res.json(new ApiResponse(statusCode.OK, 'Comment updated', comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const userId = req.userId;

    const comment = await TimeCapsuleComment.findById(commentId);
    if (!comment) {
        throw new ApiError(statusCode.NOT_FOUND, 'Comment not found');
    }

    if (comment.user.toString() !== userId) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            'You can only delete your own comments'
        );
    }

    await TimeCapsuleComment.findByIdAndDelete(commentId);

    return res.json(new ApiResponse(statusCode.OK, 'Comment deleted'));
});

const getAllCommentsForCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, 'Time capsule not found');
    }

    const userIdStr = userId.toString();
    const hasAccess =
        capsule.owner.toString() === userIdStr ||
        capsule.contributors.some((id) => id.toString() === userIdStr) ||
        capsule.recipients.some((id) => id.toString() === userIdStr);

    if (!hasAccess) {
        throw new ApiError(statusCode.FORBIDDEN, 'Access denied');
    }

    const comments = await TimeCapsuleComment.find({
        capsule: timecapsuleId,
    })
        .populate('user', 'name email')
        .sort({createdAt: 1});

    return res.json(
        new ApiResponse(statusCode.OK, 'Comments fetched', comments)
    );
});

const getMyComments = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const comments = await TimeCapsuleComment.find({
        user: userId,
    })
        .populate('capsule', 'title')
        .sort({createdAt: -1});

    return res.json(
        new ApiResponse(statusCode.OK, 'User comments fetched', comments)
    );
});

export {
    addCommentToCapsule,
    editComment,
    deleteComment,
    getAllCommentsForCapsule,
    getMyComments,
};
