import TimeCapsuleReaction from '../../models/timeCapsule/timeCapsuleReaction.model.js';
import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import {TimeCapsule} from '../../models/index.js';
import mongoose from 'mongoose';
import statusCode from '../../constants/statusCode.js';

const reactToTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const {reactionType} = req.body;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(400, 'No such capsule exists!');
    }
    if (!capsule.isOpened) {
        throw new ApiError(400, 'Capsule not yet opened!');
    }

    const existingReaction = await TimeCapsuleReaction.findOne({
        capsule: timecapsuleId,
        user: userId,
    });

    if (!existingReaction) {
        // First-time reaction
        await TimeCapsuleReaction.create({
            capsule: timecapsuleId,
            user: userId,
            reactionType,
        });

        capsule.reactions.find((r) => r.type === reactionType).count += 1;
    } else if (existingReaction.reactionType !== reactionType) {
        // Change reaction
        capsule.reactions.find(
            (r) => r.type === existingReaction.reactionType
        ).count -= 1;

        capsule.reactions.find((r) => r.type === reactionType).count += 1;

        existingReaction.reactionType = reactionType;
        await existingReaction.save();
    } else {
        // Same reaction again → reject
        throw new ApiError(400, 'You have already reacted');
    }

    await capsule.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Reaction recorded successfully', reactionType)
        );
});

const getMyReactionForTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Invalid timeCapsuleId');
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, 'Time capsule not found');
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        (id) => id.toString() === userIdStr
    );
    const isRecipient = capsule.recipients.some(
        (id) => id.toString() === userIdStr
    );

    if (!isOwner && !isContributor && !isRecipient) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            'You are not allowed to view reactions for this time capsule'
        );
    }

    const reaction = await TimeCapsuleReaction.findOne({
        capsule: timecapsuleId,
        user: userId,
    }).select('reactionType createdAt');

    const allReaction =
        await TimeCapsule.findById(timecapsuleId).select('reactions');

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'User reaction fetched successfully', {
            myReaction: reaction,
            allReaction: allReaction,
        })
    );
});

export {reactToTimeCapsule, getMyReactionForTimeCapsule};
