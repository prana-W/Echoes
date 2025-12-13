import express from "express";
import {
    createTimeCapsule,
    modifyTimeCapsule,
    deleteTimeCapsule,
    getTimeCapsule,
    getAllTimeCapsulesForUser,
    openTimeCapsule
} from "../controllers/timeCapsule.controller.js";
import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.get('/', verifyAccessToken, getAllTimeCapsulesForUser)
router.get('/:timecapsuleId', verifyAccessToken, getTimeCapsule)
router.post("/", verifyAccessToken, createTimeCapsule);
router.put("/:timecapsuleId", verifyAccessToken, modifyTimeCapsule);
router.delete("/:timecapsuleId", verifyAccessToken, deleteTimeCapsule);
router.post('/open/:timecapsuleId', openTimeCapsule);

export default router;