import express from "express";
import { verifyAccessToken } from "../middlewares/index.js";
import uploadImages from "../middlewares/timeCapsule/uploadImages.middleware.js";
import uploadVideos from "../middlewares/timeCapsule/uploadVideo.middleware.js";
import uploadAudio from "../middlewares/timeCapsule/uploadAudio.middleware.js";

import {
    uploadImagesToTimeCapsule,
    deleteImageContent,
    getMyImagesForTimeCapsule,

    uploadVideoToTimeCapsule,
    deleteVideoContent,
    getMyVideosForTimeCapsule,

    uploadAudioToTimeCapsule,
    deleteAudioContent,
    getMyAudioForTimeCapsule,

    addTextToTimeCapsule,
    deleteTextContent,
    getMyTextsForTimeCapsule,
} from "../controllers/timeCapsule/timeCapsuleContent.controller.js";

const router = express.Router();


// Get all images uploaded by the user for a capsule
router.get(
    "/images/:timecapsuleId",
    verifyAccessToken,
    getMyImagesForTimeCapsule
);

// Upload images
router.post(
    "/images/:timecapsuleId",
    verifyAccessToken,
    uploadImages.array("images", 20),
    uploadImagesToTimeCapsule
);

// Delete an image
router.delete(
    "/images/:contentId",
    verifyAccessToken,
    deleteImageContent
);


// Get all videos uploaded by the user
router.get(
    "/video/:timecapsuleId",
    verifyAccessToken,
    getMyVideosForTimeCapsule
);

// Upload videos
router.post(
    "/video/:timecapsuleId",
    verifyAccessToken,
    uploadVideos.array("videos", 1),
    uploadVideoToTimeCapsule
);

// Delete a video
router.delete(
    "/video/:contentId",
    verifyAccessToken,
    deleteVideoContent
);


// Get all audio uploaded by the user
router.get(
    "/audio/:timecapsuleId",
    verifyAccessToken,
    getMyAudioForTimeCapsule
);

// Upload audio
router.post(
    "/audio/:timecapsuleId",
    verifyAccessToken,
    uploadAudio.array("audio", 10),
    uploadAudioToTimeCapsule
);

// Delete audio
router.delete(
    "/audio/:contentId",
    verifyAccessToken,
    deleteAudioContent
);


// Get all texts added by the user
router.get(
    "/texts/:timecapsuleId",
    verifyAccessToken,
    getMyTextsForTimeCapsule
);

// Add text
router.post(
    "/texts/:timecapsuleId",
    verifyAccessToken,
    addTextToTimeCapsule
);

// Delete text
router.delete(
    "/texts/:contentId",
    verifyAccessToken,
    deleteTextContent
);

export default router;
