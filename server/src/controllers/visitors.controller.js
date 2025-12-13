import {ApiResponse, asyncHandler} from '../utility/index.js';
import Visitor from '../models/visitors.model.js';

const addVisitorCount = asyncHandler(async (req, res) => {
    let counter = await Visitor.findOne({name: 'siteVisits'});

    if (!counter) {
        counter = new Visitor({name: 'siteVisits', count: 1});
    } else {
        counter.count += 1;
    }

    await counter.save();
    return res.status(200).json(
        new ApiResponse(200, 'Visitor count added!', {
            count: counter?.count,
        })
    );
});

const getVisitorCount = asyncHandler(async (req, res) => {
    let counter = await Visitor.findOne({name: 'siteVisits'});

    if (!counter) {
        counter = await Visitor.create({name: 'siteVisits', count: 1});
    }

    return res.status(200).json(
        new ApiResponse(200, 'Visitor count fetched!', {
            count: counter?.count,
        })
    );
});

export {addVisitorCount, getVisitorCount};
