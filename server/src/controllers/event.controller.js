import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import Event from '../models/event.model.js';
import TimeCapsule from '../models/timeCapsule/timeCapsule.model.js';
import { eventList } from '../constants/eventsList.js';

const triggerEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { eventType, eventTime } = req.body;

    if (!eventType) {
        throw new ApiError(statusCode.BAD_REQUEST, 'eventType is required');
    }

    if (!eventList.includes(eventType)) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Invalid event type');
    }

    const event = await Event.create({
        user: userId,
        eventType,
        eventTime: eventTime ? new Date(eventTime) : new Date(),
    });

    const capsulesToOpen = await TimeCapsule.find({
        owner: userId,
        isEventRelated: true,
        event: eventType,
        isSealed: true,
        isOpened: false,
    });

    const capsuleIds = capsulesToOpen.map(c => c._id);

    if (capsuleIds.length > 0) {
        await TimeCapsule.updateMany(
            { _id: { $in: capsuleIds } },
            {
                $set: {
                    isOpened: true,
                    openedAt: new Date(),
                },
            }
        );
    }

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Event triggered successfully. Relevant capsules have been opened.',
            {
                event,
                openedCapsulesCount: capsuleIds.length,
                openedCapsuleIds: capsuleIds,
            }
        )
    );
});

export { triggerEvent };
