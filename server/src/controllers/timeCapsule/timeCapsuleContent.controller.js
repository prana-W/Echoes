import mongoose from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../../utility/index.js";
import statusCode from "../../constants/statusCode.js";
import TimeCapsule from "../../models/timeCapsule/timeCapsule.model.js";
import TimeCapsuleContent from "../../models/timeCapsule/timeCapsuleContent.model.js";

/**
 * POST /api/timecapsule/:timecapsuleId/images
 * Upload multiple images to a time capsule
 */
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

export { uploadImagesToTimeCapsule };
