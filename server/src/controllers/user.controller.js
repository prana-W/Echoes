import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import User from '../models/user.model.js';
import Relation from '../models/relation.model.js';
import {onlineUsers} from '../store/presence.store.js';

const getUsersByName = asyncHandler(async (req, res) => {
    const {name} = req.params;

    if (!name || !name.trim()) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Name parameter is required'
        );
    }

    const search = name.trim();

    const words = search.split(/\s+/);

    const regexConditions = words.map((word) => ({
        name: {$regex: word, $options: 'i'},
    }));

    const users = await User.find({
        $or: regexConditions,
    }).select('-password');

    if (users.length === 0) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'No users found with the given name'
        );
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(statusCode.OK, 'Users fetched successfully', users)
        );
});

const getUserByEmail = asyncHandler(async (req, res) => {
    const {email} = req.params;

    if (!email) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Email parameter is required'
        );
    }

    const user = await User.findOne({email}).select('-password');

    if (!user) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'User not found with the given email'
        );
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(statusCode.OK, 'User fetched successfully', user)
        );
});

const getFriendsOfUser = async (userId) => {
    // Find all relations where user is either side
    const relations = await Relation.find({
        $or: [{from: userId}, {to: userId}],
    });

    // Collect the "other" user IDs
    const friendIds = new Set();

    relations.forEach((rel) => {
        if (rel.from.toString() === userId.toString()) {
            friendIds.add(rel.to.toString());
        } else {
            friendIds.add(rel.from.toString());
        }
    });

    // Fetch user documents
    const friends = await User.find({
        _id: {$in: Array.from(friendIds)},
    }).select('name email');

    return friends;
};

const getUserPresence = asyncHandler(async (req, res) => {
    const userId = req.userId;

    // Step 1: Get friends (relations logic)
    const friends = await getFriendsOfUser(userId);
    // friends => [{ _id: friendUserId, ... }]

    // Step 2: Filter only online userIds
    const onlineFriendIds = friends
        .map((friend) => friend._id.toString())
        .filter((id) => onlineUsers.has(id));

    // Step 3: Fetch user details in ONE DB query
    const onlineUsersData = await User.find(
        {_id: {$in: onlineFriendIds}},
        {name: 1} // projection
    );

    // Step 4: Format response
    const presence = onlineUsersData.map((user) => ({
        userId: user._id,
        name: user.name,
        online: true,
    }));

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'User presence fetched successfully', {
            myRelationsData: presence,
            totalOnlineUsers: onlineUsers.size,
        })
    );
});

export {getUsersByName, getUserByEmail, getUserPresence};
