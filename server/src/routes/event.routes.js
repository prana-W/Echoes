import express from "express";
import { verifyAccessToken } from "../middlewares/index.js";
import { triggerEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.post(
    "/",
    verifyAccessToken,
    triggerEvent
);

export default router;
