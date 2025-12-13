import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
    {
        totalUsers: {
            type: Number,
            default: 0,
        },

        totalTimeCapsulesCreated: {
            type: Number,
            default: 0,
        },

        totalTimeCapsulesOpened: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
