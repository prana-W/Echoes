import mongoose from "mongoose";

const timeCapsuleContentSchema = new mongoose.Schema(
    {
        capsule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TimeCapsule",
            required: true,
        },

        type: {
            type: String,
            enum: ["image", "video", "audio", "text"],
            required: true,
        },

        content: {
            type: String, // URL for media OR text itself
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TimeCapsuleContent = mongoose.model(
    "TimeCapsuleContent",
    timeCapsuleContentSchema
);

export default TimeCapsuleContent;
