import express from 'express';
import {
    createRelation,
    getAllRelations,
    getRelationByType,
} from '../controllers/relation.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const router = express.Router();

router.post('/', verifyAccessToken, createRelation);
router.get('/', verifyAccessToken, getAllRelations);
router.get('/:relationType', verifyAccessToken, getRelationByType);

export default router;
