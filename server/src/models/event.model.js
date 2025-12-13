import mongoose from "mongoose";
import {eventList} from '../constants/eventsList.js';

const eventSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        eventType: {
            type: String,
            enum: eventList,
            required: true,
        },

        eventTime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.index({ user: 1, eventType: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
