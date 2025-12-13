import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { verifyAccessToken } from "../middlewares/index.js";

const router = express.Router();

router.get(
    "/",
    verifyAccessToken,
    getAnalytics
);

export default router;
