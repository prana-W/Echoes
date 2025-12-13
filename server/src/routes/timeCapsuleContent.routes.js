import express from "express";
import {verifyAccessToken} from '../middlewares/index.js';
import uploadImages from "../middlewares/timeCapsule/uploadImages.middleware.js";
import { uploadImagesToTimeCapsule } from "../controllers/timeCapsule/timeCapsuleContent.controller.js";

const router = express.Router();

router.post(
    "/images/:timecapsuleId",
    verifyAccessToken,
    uploadImages.array("images", 20),
    uploadImagesToTimeCapsule
);

export default router;
