import mongoose from "mongoose";

const timeCapsuleReactionSchema = new mongoose.Schema(
    {
        capsule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TimeCapsule",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reactionType: {
            type: String,
            enum: ["like", "heart", "thumbsup", "laugh", "sad"],
            required: true,
        },
    },
    { timestamps: true }
);

// HARD GUARANTEE: one reaction per user per capsule
timeCapsuleReactionSchema.index(
    { capsule: 1, user: 1 },
    { unique: true }
);

const TimeCapsuleReaction = mongoose.model(
    "TimeCapsuleReaction",
    timeCapsuleReactionSchema
);

export default TimeCapsuleReaction;
