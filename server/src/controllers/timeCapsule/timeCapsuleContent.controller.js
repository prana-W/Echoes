import mongoose from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../../utility/index.js";
import statusCode from "../../constants/statusCode.js";
import TimeCapsule from "../../models/timeCapsule/timeCapsule.model.js";
import TimeCapsuleContent from "../../models/timeCapsule/timeCapsuleContent.model.js";
import fs from "fs";
import path from "path";


/**
 * GET /api/timecapsule/:timecapsuleId/images/me
 * Fetch images uploaded by the logged-in user for a specific time capsule
 */
const getMyImagesForTimeCapsule = asyncHandler(async (req, res) => {
    const { timecapsuleId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid timeCapsuleId");
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Time capsule not found");
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        id => id.toString() === userIdStr
    );
    const isRecipient = capsule.recipients.some(
        id => id.toString() === userIdStr
    );

    if (!isOwner && !isContributor && !isRecipient) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            "You do not have access to this time capsule"
        );
    }

    const images = await TimeCapsuleContent.find({
        capsule: timecapsuleId,
        type: "image",
        createdBy: userId,
    })
        .sort({ createdAt: 1 });

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "User images fetched successfully",
            images
        )
    );
});


const uploadImagesToTimeCapsule = asyncHandler(async (req, res) => {
    const { timecapsuleId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid timeCapsuleId");
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Time capsule not found");
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        id => id.toString() === userIdStr
    );

    if (!isOwner && !isContributor) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            "Only owner or contributors can upload images"
        );
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "No images uploaded"
        );
    }

    const contents = req.files.map(file => ({
        capsule: timecapsuleId,
        type: "image",
        content: `/uploads/${file.filename}`,
        createdBy: userId,
    }));

    const savedContents = await TimeCapsuleContent.insertMany(contents);

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            "Images uploaded successfully",
            savedContents
        )
    );
});

const deleteImageContent = asyncHandler(async (req, res) => {
    const { contentId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(statusCode.BAD_REQUEST, "Invalid contentId");
    }

    const content = await TimeCapsuleContent.findById(contentId);
    if (!content) {
        throw new ApiError(statusCode.NOT_FOUND, "Content not found");
    }

    if (content.type !== "image") {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "Only image content can be deleted using this endpoint"
        );
    }

    const capsule = await TimeCapsule.findById(content.capsule);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, "Parent time capsule not found");
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isCreator = content.createdBy.toString() === userIdStr;

    if (!isOwner && !isCreator) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            "You are not allowed to delete this image"
        );
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), content.content);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Delete DB record
    await TimeCapsuleContent.findByIdAndDelete(contentId);

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Image deleted successfully"
        )
    );
});

export { getMyImagesForTimeCapsule, uploadImagesToTimeCapsule, deleteImageContent };
