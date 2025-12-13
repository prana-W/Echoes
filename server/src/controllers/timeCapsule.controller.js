import mongoose from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utility/index.js";
import statusCode from "../constants/statusCode.js";
import TimeCapsule from "../models/timeCapsule/timeCapsule.model.js";
import User from "../models/user.model.js";
import {Analytics} from '../models/index.js';

const validateUsersExist = async (userIds = []) => {
    if (!Array.isArray(userIds) || userIds.length === 0) return;

    const uniqueIds = [...new Set(userIds.map(id => id.toString()))];

    // Validate ObjectId format
    for (const id of uniqueIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                `Invalid userId provided: ${id}`
            );
        }
    }

    const users = await User.find({ _id: { $in: uniqueIds } }).select("_id");

    if (users.length !== uniqueIds.length) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "One or more users provided do not exist"
        );
    }
};

const createTimeCapsule = asyncHandler(async (req, res) => {
    const ownerId = req.userId;

    const {
        title,
        description,
        contributors = [],
        recipients = [],
        openAt,
        event,
        theme,
        isEventRelated = false,
        allowContributorsToOpen = false
    } = req.body;

    if (!title) {
        throw new ApiError(statusCode.BAD_REQUEST, "Title is required");
    }

    // Event vs Date validation
    if (isEventRelated) {
        if (!event) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                "Event is required when isEventRelated is true"
            );
        }
    } else {
        if (!openAt) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                "openAt is required when isEventRelated is false"
            );
        }
    }

    // Validate users
    await validateUsersExist(contributors);
    await validateUsersExist(recipients);

    // Contributors (owner always included)
    const contributorSet = new Set([
        ownerId.toString(),
        ...contributors.map(id => id.toString()),
    ]);

    const finalContributors = Array.from(contributorSet);

    // Recipients (contributors auto-added)
    const recipientSet = new Set([
        ...finalContributors,
        ...recipients.map(id => id.toString()),
    ]);

    const finalRecipients = Array.from(recipientSet);

    const capsule = await TimeCapsule.create({
        title,
        description,
        owner: ownerId,
        contributors: finalContributors,
        recipients: finalRecipients,
        openAt: isEventRelated ? undefined : openAt,
        isEventRelated,
        event: isEventRelated ? event : undefined,
        theme,
        allowContributorsToOpen,
    });

    // For Analytics purposes
    await Analytics.findOneAndUpdate(
        {},
        { $inc: { totalCapsulesCreated: 1 } },
        { upsert: true, new: true }
    );

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            "Time capsule created successfully",
            capsule
        )
    );
});


const modifyTimeCapsule = asyncHandler(async (req, res) => {
    const { timecapsuleId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid timeCapsuleId");
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Time capsule not found");
    }

    // Only owner can modify
    if (capsule.owner.toString() !== userId) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            "Only the creator can modify this time capsule"
        );
    }

    const {
        title,
        description,
        addContributors = [],
        removeContributors = [],
        addRecipients = [],
        removeRecipients = [],
        openAt,
        isEventRelated,
        event,
        theme,
    } = req.body;

    // Validate users being added
    await validateUsersExist(addContributors);
    await validateUsersExist(addRecipients);

    //  Basic fields
    if (title !== undefined) capsule.title = title;
    if (description !== undefined) capsule.description = description;
    if (theme !== undefined) capsule.theme = theme;

    // Contributors
    let contributorSet = new Set(capsule.contributors.map(id => id.toString()));

    addContributors.forEach(id => contributorSet.add(id.toString()));
    removeContributors.forEach(id => contributorSet.delete(id.toString()));

    // Owner can NEVER be removed
    contributorSet.add(capsule.owner.toString());

    const updatedContributors = Array.from(contributorSet);

    // Recipients
    let recipientSet = new Set(capsule.recipients.map(id => id.toString()));

    // Contributors always recipients
    updatedContributors.forEach(id => recipientSet.add(id));

    addRecipients.forEach(id => recipientSet.add(id.toString()));
    removeRecipients.forEach(id => recipientSet.delete(id.toString()));

    capsule.contributors = updatedContributors;
    capsule.recipients = Array.from(recipientSet);

    // Event vs Date update
    if (isEventRelated !== undefined) {
        capsule.isEventRelated = isEventRelated;

        if (isEventRelated) {
            if (!event) {
                throw new ApiError(
                    statusCode.BAD_REQUEST,
                    "Event is required when isEventRelated is true"
                );
            }
            capsule.event = event;
            capsule.openAt = undefined;
        } else {
            if (!openAt) {
                throw new ApiError(
                    statusCode.BAD_REQUEST,
                    "openAt is required when isEventRelated is false"
                );
            }
            capsule.openAt = openAt;
            capsule.event = undefined;
        }
    }

    await capsule.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Time capsule updated successfully",
            capsule
        )
    );
});


const deleteTimeCapsule = asyncHandler(async (req, res) => {
    const { timecapsuleId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid timeCapsuleId");
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Time capsule not found");
    }

    // Only owner can delete
    if (capsule.owner.toString() !== userId) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            "Only the creator can delete this time capsule"
        );
    }

    await TimeCapsule.findByIdAndDelete(timecapsuleId);

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Time capsule deleted successfully"
        )
    );
});

const getTimeCapsule = asyncHandler(async (req, res) => {
    const { timecapsuleId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid timeCapsuleId");
    }

    const capsule = await TimeCapsule.findById(timecapsuleId)
        .populate("owner", "name email")
        .populate("contributors", "name email")
        .populate("recipients", "name email");

    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Time capsule not found");
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner._id.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        u => u._id.toString() === userIdStr
    );
    const isRecipient = capsule.recipients.some(
        u => u._id.toString() === userIdStr
    );

    if (!isOwner && !isContributor && !isRecipient) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            "You do not have access to this time capsule"
        );
    }

    // If capsule is not opened yet, restrict sensitive fields
    if (!capsule.isOpened && !isOwner) {
        return res.status(statusCode.OK).json(
            new ApiResponse(
                statusCode.OK,
                "Time capsule fetched (locked view)",
                {
                    _id: capsule._id,
                    title: capsule.title,
                    description: capsule.description,
                    theme: capsule.theme,
                    owner: capsule.owner,
                    contributors: capsule.contributors,
                    recipients: capsule.recipients,
                    openAt: capsule.openAt,
                    isEventRelated: capsule.isEventRelated,
                    event: capsule.event,
                    isOpened: capsule.isOpened,
                    createdAt: capsule.createdAt,
                }
            )
        );
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Time capsule fetched successfully",
            capsule
        )
    );
});


const getAllTimeCapsulesForUser = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const capsules = await TimeCapsule.find({
        $or: [
            { owner: userId },
            { contributors: userId },
            { recipients: userId },
        ],
    })
        .populate("owner", "name email")
        .populate("contributors", "name email")
        .populate("recipients", "name email")
        .sort({ createdAt: -1 });

    if (!capsules || capsules.length === 0) {
        return res.status(statusCode.OK).json(
            new ApiResponse(
                statusCode.OK,
                "No time capsules found for this user",
                []
            )
        );
    }

    const responseCapsules = capsules.map(capsule => {
        const isOwner = capsule.owner._id.toString() === userId.toString();

        // If capsule is locked and user is not owner, return limited view
        if (!capsule.isOpened && !isOwner) {
            return {
                _id: capsule._id,
                title: capsule.title,
                description: capsule.description,
                theme: capsule.theme,
                owner: capsule.owner,
                contributors: capsule.contributors,
                recipients: capsule.recipients,
                openAt: capsule.openAt,
                isEventRelated: capsule.isEventRelated,
                event: capsule.event,
                isOpened: capsule.isOpened,
                createdAt: capsule.createdAt,
            };
        }

        return capsule;
    });

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Time capsules fetched successfully",
            responseCapsules
        )
    );
});

const openTimeCapsule = asyncHandler(async (req, res) => {
    const { timecapsuleId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid timeCapsuleId");
    }

    const capsule = await TimeCapsule.findById(timecapsuleId)
        .populate("owner", "name email")
        .populate("contributors", "name email")
        .populate("recipients", "name email");

    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Time capsule not found");
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner._id.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        u => u._id.toString() === userIdStr
    );
    const isRecipient = capsule.recipients.some(
        u => u._id.toString() === userIdStr
    );

    // Access control
    if (capsule.allowContributorsToOpen) {
        if (!isOwner && !isContributor && !isRecipient) {
            throw new ApiError(
                statusCode.FORBIDDEN,
                "You are not allowed to open this time capsule"
            );
        }
    } else {
        if (!isOwner && !isRecipient) {
            throw new ApiError(
                statusCode.FORBIDDEN,
                "Only owner or recipients can open this time capsule"
            );
        }
    }

    if (!capsule.isOpened) {
        capsule.isOpened = true;
        await capsule.save();
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Time capsule opened successfully",
            capsule
        )
    );
});


export {
    createTimeCapsule,
    modifyTimeCapsule,
    deleteTimeCapsule,
    getTimeCapsule,
    getAllTimeCapsulesForUser,
    openTimeCapsule
};