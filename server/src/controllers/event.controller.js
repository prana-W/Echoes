import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import Event from '../models/event.model.js';
import {eventList} from '../constants/eventsList.js';

const triggerEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const {eventType, eventTime} = req.body;

    // Validate event type
    if (!eventType) {
        throw new ApiError(statusCode.BAD_REQUEST, 'eventType is required');
    }

    if (!eventList.includes(eventType)) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Invalid event type');
    }

    const event = await Event.create({
        user: userId,
        eventType,
        eventTime: eventTime ? new Date(eventTime) : undefined,
    });

    return res
        .status(statusCode.CREATED)
        .json(
            new ApiResponse(
                statusCode.CREATED,
                'Event triggered successfully',
                event
            )
        );
});

export {triggerEvent};
