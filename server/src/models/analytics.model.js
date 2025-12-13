import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
    {
        totalUsers: {
            type: Number,
            default: 0,
        },

        totalCapsulesCreated: {
            type: Number,
            default: 0,
        },

        totalCapsulesOpened: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
