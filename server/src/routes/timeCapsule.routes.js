import express from "express";
import {
    createTimeCapsule,
    modifyTimeCapsule,
    deleteTimeCapsule,
} from "../controllers/timeCapsule.controller.js";
import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.post("/", verifyAccessToken, createTimeCapsule);
router.put("/:timecapsuleId", verifyAccessToken, modifyTimeCapsule);
router.delete("/:timecapsuleId", verifyAccessToken, deleteTimeCapsule);

export default router;