import { ApiError, ApiResponse, asyncHandler } from "../utility/index.js";
import statusCode from "../constants/statusCode.js";
import Relation from "../models/relation.model.js";
import User from "../models/user.model.js";

// Todo: Must be same as in relation.model.js
const reciprocalMap = {
    father: "son",
    mother: "son",
    son: "father",
    daughter: "father",

    husband: "wife",
    wife: "husband",

    brother: "brother",
    sister: "sister",

    grandfather: "grandson",
    grandmother: "grandson",
    grandson: "grandfather",
    granddaughter: "grandmother",

    maternal_uncle: "nephew",
    paternal_uncle: "nephew",
    maternal_aunt: "niece",
    paternal_aunt: "niece",

    uncle: "nephew",
    aunt: "niece",
    nephew: "uncle",
    niece: "aunt",
};

const createRelation = asyncHandler(async (req, res) => {
    const fromUserId = req.userId;
    const { targetUserId, relation } = req.body;

    if (!targetUserId || !relation) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "targetUserId and relation are required"
        );
    }

    if (fromUserId === targetUserId) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "You cannot create a relation with yourself"
        );
    }

    const reciprocalRelation = reciprocalMap[relation];
    if (!reciprocalRelation) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "Invalid or unsupported relation type"
        );
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        throw new ApiError(statusCode.NOT_FOUND, "Target user not found");
    }

    // CHECK 1: Direct relation already exists
    const directExists = await Relation.findOne({
        from: fromUserId,
        to: targetUserId,
        relation,
    });

    // CHECK 2: Reciprocal relation already exists
    const reverseExists = await Relation.findOne({
        from: targetUserId,
        to: fromUserId,
        relation: reciprocalRelation,
    });

    if (directExists || reverseExists) {
        throw new ApiError(
            statusCode.CONFLICT,
            "This relationship is already established"
        );
    }

    // Create both relations
    const relations = await Relation.create([
        {
            from: fromUserId,
            to: targetUserId,
            relation,
        },
        {
            from: targetUserId,
            to: fromUserId,
            relation: reciprocalRelation,
        },
    ]);

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            "Relationship created successfully",
            relations
        )
    );
});


const getAllRelations = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const relations = await Relation.find({ from: userId })
        .populate("to", "name email")
        .sort({ createdAt: -1 });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, "Relations fetched successfully", relations)
    );
});

const getRelationByType = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { relationType } = req.params;

    if (!relationType) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            "Relation type is required"
        );
    }

    const relations = await Relation.find({
        from: userId,
        relation: relationType,
    }).populate("to", "name email");

    if (relations.length === 0) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            `No '${relationType}' relation found`
        );
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            `${relationType} relation fetched successfully`,
            relations
        )
    );
});

export { createRelation, getAllRelations, getRelationByType };
