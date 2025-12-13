import express from 'express';
import {
    getUsersByName,
    getUserByEmail,
    getUserPresence,
} from '../controllers/user.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.get('/search/:name', verifyAccessToken, getUsersByName);
router.get('/email/:email', verifyAccessToken, getUserByEmail);
router.get('/presence', verifyAccessToken, getUserPresence);

export default router;
