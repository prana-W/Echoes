import express from 'express';
import {
    createTimeCapsule,
    modifyTimeCapsule,
    deleteTimeCapsule,
    getTimeCapsule,
    getAllTimeCapsulesForUser,
    openTimeCapsule,
    reactToTimeCapsule,
    getMyReactionForTimeCapsule,
} from '../controllers/timeCapsule/index.js';
import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.get('/', verifyAccessToken, getAllTimeCapsulesForUser);
router.get('/:timecapsuleId', verifyAccessToken, getTimeCapsule);
router.post('/', verifyAccessToken, createTimeCapsule);
router.put('/:timecapsuleId', verifyAccessToken, modifyTimeCapsule);
router.delete('/:timecapsuleId', verifyAccessToken, deleteTimeCapsule);
router.post('/open/:timecapsuleId', verifyAccessToken, openTimeCapsule);
router.post('/reaction/:timecapsuleId', verifyAccessToken, reactToTimeCapsule);
router.get(
    '/reaction/:timecapsuleId',
    verifyAccessToken,
    getMyReactionForTimeCapsule
);

export default router;
