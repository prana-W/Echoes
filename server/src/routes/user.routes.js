import express from "express";
import {
    getUsersByName,
    getUserByEmail,
} from "../controllers/user.controller.js";
import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.get("/search/:name", verifyAccessToken, getUsersByName);
router.get("/email/:email", verifyAccessToken, getUserByEmail);

export default router;
