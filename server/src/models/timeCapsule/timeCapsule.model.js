import mongoose from 'mongoose';
import {eventList} from '../../constants/eventsList.js';

const reactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['like', 'heart', 'thumbsup', 'laugh', 'sad'],
            required: true,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    {_id: false}
);

const timeCapsuleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        contributors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        recipients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        openAt: {
            type: Date,
        },

        isEventRelated: {
            type: Boolean,
            default: false,
        },

        event: {
            type: String,
            enum: eventList
        },

        theme: {
            type: String,
            trim: true,
        },

        reactions: {
            type: [reactionSchema],
            default: [
                {type: 'like', count: 0},
                {type: 'heart', count: 0},
                {type: 'thumbsup', count: 0},
                {type: 'laugh', count: 0},
                {type: 'sad', count: 0},
            ],
        },

        isOpened: {
            type: Boolean,
            default: false,
        },
        allowContributorsToOpen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const TimeCapsule = mongoose.model('TimeCapsule', timeCapsuleSchema);

export default TimeCapsule;
