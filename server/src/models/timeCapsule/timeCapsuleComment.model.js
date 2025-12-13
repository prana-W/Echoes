import mongoose from 'mongoose';

const timeCapsuleCommentSchema = new mongoose.Schema(
    {
        capsule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeCapsule',
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const TimeCapsuleComment = mongoose.model(
    'TimeCapsuleComment',
    timeCapsuleCommentSchema
);

export default TimeCapsuleComment;
