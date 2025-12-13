import {ApiResponse, asyncHandler} from '../utility/index.js';
import Analytics from '../models/analytics.model.js';
import Visitor from '../models/visitors.model.js';

const getAnalytics = asyncHandler(async (req, res) => {
    // There should ideally be only one analytics document
    let analytics = await Analytics.findOne();

    // Safety: if analytics doc doesn't exist yet
    if (!analytics) {
        analytics = await Analytics.create({});
    }

    // Aggregate total visitors from Visitor collection
    const visitorAggregation = await Visitor.aggregate([
        {
            $group: {
                _id: null,
                totalVisitors: {$sum: '$count'},
            },
        },
    ]);

    const totalVisitors =
        visitorAggregation.length > 0 ? visitorAggregation[0].totalVisitors : 0;

    const response = {
        totalUsers: analytics.totalUsers,
        totalCapsulesCreated: analytics.totalCapsulesCreated,
        totalCapsulesOpened: analytics.totalCapsulesOpened,
        totalVisitors,
        updatedAt: analytics.updatedAt,
    };

    return res.json(
        new ApiResponse(200, 'Analytics fetched successfully', response)
    );
});

export {getAnalytics};
