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
    getEntireTimeCapsule
} from '../controllers/timeCapsule/index.js';

import {
    addCommentToCapsule,
    editComment,
    deleteComment,
    getAllCommentsForCapsule,
    getMyComments,
} from '../controllers/timeCapsule/timeCapsuleComment.controller.js';

import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.get('/', verifyAccessToken, getAllTimeCapsulesForUser);
router.get('/:timecapsuleId', verifyAccessToken, getTimeCapsule);
router.post('/', verifyAccessToken, createTimeCapsule);
router.put('/:timecapsuleId', verifyAccessToken, modifyTimeCapsule);
router.delete('/:timecapsuleId', verifyAccessToken, deleteTimeCapsule);
router.post('/open/:timecapsuleId', verifyAccessToken, openTimeCapsule); // for just making the isOpen field true in the database

router.post('/reaction/:timecapsuleId', verifyAccessToken, reactToTimeCapsule);
router.get(
    '/reaction/:timecapsuleId',
    verifyAccessToken,
    getMyReactionForTimeCapsule
);

// Add comment
router.post('/:timecapsuleId/comment', verifyAccessToken, addCommentToCapsule);

// Edit comment
router.put('/comment/:commentId', verifyAccessToken, editComment);

// Delete comment
router.delete('/comment/:commentId', verifyAccessToken, deleteComment);

// Get all comments for capsule
router.get(
    '/:timecapsuleId/comments',
    verifyAccessToken,
    getAllCommentsForCapsule
);

// Get all comments by logged-in user
router.get('/comments/me', verifyAccessToken, getMyComments);

router.get('/view/:timecapsuleId', verifyAccessToken, getEntireTimeCapsule)

export default router;
