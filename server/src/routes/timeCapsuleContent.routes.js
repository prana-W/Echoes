import express from "express";
import {verifyAccessToken} from '../middlewares/index.js';
import uploadImages from "../middlewares/timeCapsule/uploadImages.middleware.js";
import { uploadImagesToTimeCapsule, deleteImageContent, getMyImagesForTimeCapsule } from "../controllers/timeCapsule/timeCapsuleContent.controller.js";

const router = express.Router();

router.get('/images/:timecapsuleId', verifyAccessToken, getMyImagesForTimeCapsule);

router.post(
    "/images/:timecapsuleId",
    verifyAccessToken,
    uploadImages.array("images", 20),
    uploadImagesToTimeCapsule
);

router.delete("/images/:contentId", verifyAccessToken, deleteImageContent);

export default router;
