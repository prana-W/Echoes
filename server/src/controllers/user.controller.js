import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import User from '../models/user.model.js';

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

import Relation from "../models/relation.model.js";
import { onlineUsers } from "../store/presence.store.js";

const getFriendsOfUser = async (userId) => {
    // Find all relations where user is either side
    const relations = await Relation.find({
        $or: [
            { from: userId },
            { to: userId },
        ],
    });

    // Collect the "other" user IDs
    const friendIds = new Set();

    relations.forEach(rel => {
        if (rel.from.toString() === userId.toString()) {
            friendIds.add(rel.to.toString());
        } else {
            friendIds.add(rel.from.toString());
        }
    });

    // Fetch user documents
    const friends = await User.find({
        _id: { $in: Array.from(friendIds) },
    }).select("name email");

    return friends;
};

const getUserPresence = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const friends = await getFriendsOfUser(userId); // relations logic

    const presence = friends.map(friend => ({
        userId: friend._id,
        name: friend.name,
        online: onlineUsers.has(friend._id.toString()),
    }));

    return res.status(statusCode.OK).json(new ApiResponse(200, "User presence fetched successfully", presence));

});


export {getUsersByName, getUserByEmail, getUserPresence};
