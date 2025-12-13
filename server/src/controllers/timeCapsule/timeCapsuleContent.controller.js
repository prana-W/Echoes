import mongoose from 'mongoose';
import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import TimeCapsule from '../../models/timeCapsule/timeCapsule.model.js';
import TimeCapsuleContent from '../../models/timeCapsule/timeCapsuleContent.model.js';
import fs from 'fs';
import path from 'path';

const getMyImagesForTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Invalid timeCapsuleId');
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, 'Time capsule not found');
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        (id) => id.toString() === userIdStr
    );
    const isRecipient = capsule.recipients.some(
        (id) => id.toString() === userIdStr
    );

    if (!isOwner && !isContributor && !isRecipient) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            'You do not have access to this time capsule'
        );
    }

    const images = await TimeCapsuleContent.find({
        capsule: timecapsuleId,
        type: 'image',
        createdBy: userId,
    }).sort({createdAt: 1});

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'User images fetched successfully',
                images
            )
        );
});

const uploadImagesToTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(timecapsuleId)) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Invalid timeCapsuleId');
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(statusCode.NOT_FOUND, 'Time capsule not found');
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isContributor = capsule.contributors.some(
        (id) => id.toString() === userIdStr
    );

    if (!isOwner && !isContributor) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            'Only owner or contributors can upload images'
        );
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(statusCode.BAD_REQUEST, 'No images uploaded');
    }

    const contents = req.files.map((file) => ({
        capsule: timecapsuleId,
        type: 'image',
        content: `/uploads/${file.filename}`,
        createdBy: userId,
    }));

    const savedContents = await TimeCapsuleContent.insertMany(contents);

    return res
        .status(statusCode.CREATED)
        .json(
            new ApiResponse(
                statusCode.CREATED,
                'Images uploaded successfully',
                savedContents
            )
        );
});

const deleteImageContent = asyncHandler(async (req, res) => {
    const {contentId} = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Invalid contentId');
    }

    const content = await TimeCapsuleContent.findById(contentId);
    if (!content) {
        throw new ApiError(statusCode.NOT_FOUND, 'Content not found');
    }

    if (content.type !== 'image') {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Only image content can be deleted using this endpoint'
        );
    }

    const capsule = await TimeCapsule.findById(content.capsule);
    if (!capsule) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Parent time capsule not found'
        );
    }

    const userIdStr = userId.toString();

    const isOwner = capsule.owner.toString() === userIdStr;
    const isCreator = content.createdBy.toString() === userIdStr;

    if (!isOwner && !isCreator) {
        throw new ApiError(
            statusCode.FORBIDDEN,
            'You are not allowed to delete this image'
        );
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), content.content);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Delete DB record
    await TimeCapsuleContent.findByIdAndDelete(contentId);

    return res
        .status(statusCode.OK)
        .json(new ApiResponse(statusCode.OK, 'Image deleted successfully'));
});

const uploadAudioToTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) throw new ApiError(404, 'Time capsule not found');

    const isAllowed =
        capsule.owner.toString() === userId ||
        capsule.contributors.some((id) => id.toString() === userId);

    if (!isAllowed) {
        throw new ApiError(403, 'Not allowed to upload audio');
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, 'No audio files uploaded');
    }

    const contents = req.files.map((file) => ({
        capsule: timecapsuleId,
        type: 'audio',
        content: `/uploads/${file.filename}`,
        createdBy: userId,
    }));

    const saved = await TimeCapsuleContent.insertMany(contents);

    return res.status(201).json(new ApiResponse(201, 'Audio uploaded', saved));
});

const getMyAudioForTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) throw new ApiError(404, 'Time capsule not found');

    const hasAccess =
        capsule.owner.toString() === userId ||
        capsule.contributors.some((id) => id.toString() === userId) ||
        capsule.recipients.some((id) => id.toString() === userId);

    if (!hasAccess) {
        throw new ApiError(403, 'Access denied');
    }

    const audio = await TimeCapsuleContent.find({
        capsule: timecapsuleId,
        type: 'audio',
        createdBy: userId,
    }).sort({createdAt: 1});

    return res.json(
        new ApiResponse(200, 'User audio fetched successfully', audio)
    );
});

const deleteAudioContent = asyncHandler(async (req, res) => {
    const {contentId} = req.params;
    const userId = req.userId;

    const content = await TimeCapsuleContent.findById(contentId);
    if (!content || content.type !== 'audio') {
        throw new ApiError(404, 'Audio not found');
    }

    const capsule = await TimeCapsule.findById(content.capsule);
    if (!capsule) {
        throw new ApiError(404, 'Parent time capsule not found');
    }

    const canDelete =
        capsule.owner.toString() === userId ||
        content.createdBy.toString() === userId;

    if (!canDelete) {
        throw new ApiError(403, 'Not allowed to delete audio');
    }

    // Delete audio file from filesystem
    const filePath = path.join(process.cwd(), content.content);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Delete DB record
    await TimeCapsuleContent.findByIdAndDelete(contentId);

    return res.json(new ApiResponse(200, 'Audio deleted successfully'));
});

const uploadVideoToTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) throw new ApiError(404, 'Time capsule not found');

    const isAllowed =
        capsule.owner.toString() === userId ||
        capsule.contributors.some((id) => id.toString() === userId);

    if (!isAllowed) throw new ApiError(403, 'Not allowed');

    const contents = req.files.map((file) => ({
        capsule: timecapsuleId,
        type: 'video',
        content: `/uploads/${file.filename}`,
        createdBy: userId,
    }));

    const saved = await TimeCapsuleContent.insertMany(contents);

    return res.status(201).json(new ApiResponse(201, 'Videos uploaded', saved));
});

const getMyVideosForTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) throw new ApiError(404, 'Time capsule not found');

    const hasAccess =
        capsule.owner.toString() === userId ||
        capsule.contributors.some((id) => id.toString() === userId) ||
        capsule.recipients.some((id) => id.toString() === userId);

    if (!hasAccess) {
        throw new ApiError(403, 'Access denied');
    }

    const videos = await TimeCapsuleContent.find({
        capsule: timecapsuleId,
        type: 'video',
        createdBy: userId,
    }).sort({createdAt: 1});

    return res.json(
        new ApiResponse(200, 'User videos fetched successfully', videos)
    );
});

const deleteVideoContent = asyncHandler(async (req, res) => {
    const {contentId} = req.params;
    const userId = req.userId;

    const content = await TimeCapsuleContent.findById(contentId);
    if (!content || content.type !== 'video') {
        throw new ApiError(404, 'Video not found');
    }

    const capsule = await TimeCapsule.findById(content.capsule);
    if (!capsule) {
        throw new ApiError(404, 'Parent time capsule not found');
    }

    const canDelete =
        capsule.owner.toString() === userId ||
        content.createdBy.toString() === userId;

    if (!canDelete) {
        throw new ApiError(403, 'Not allowed');
    }

    // Delete video file from filesystem
    const filePath = path.join(process.cwd(), content.content);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Delete DB record
    await TimeCapsuleContent.findByIdAndDelete(contentId);

    return res.json(new ApiResponse(200, 'Video deleted successfully'));
});

const addTextToTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const {text, isQuestion = false} = req.body;
    const userId = req.userId;

    if (!text || !text.trim()) {
        throw new ApiError(400, 'Text is required');
    }

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(404, 'Time capsule not found');
    }

    const isAllowed =
        capsule.owner.toString() === userId ||
        capsule.contributors.some((id) => id.toString() === userId);

    if (!isAllowed) {
        throw new ApiError(403, 'Not allowed');
    }

    const content = await TimeCapsuleContent.create({
        capsule: timecapsuleId,
        type: isQuestion ? 'question' : 'text',
        content: text,
        createdBy: userId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, 'Content added successfully', content));
});

const getMyTextsForTimeCapsule = asyncHandler(async (req, res) => {
    const {timecapsuleId} = req.params;
    const userId = req.userId;

    const capsule = await TimeCapsule.findById(timecapsuleId);
    if (!capsule) {
        throw new ApiError(404, 'Time capsule not found');
    }

    const hasAccess =
        capsule.owner.toString() === userId ||
        capsule.contributors.some((id) => id.toString() === userId) ||
        capsule.recipients.some((id) => id.toString() === userId);

    if (!hasAccess) {
        throw new ApiError(403, 'Access denied');
    }

    const texts = await TimeCapsuleContent.find({
        capsule: timecapsuleId,
        type: {$in: ['text', 'question']},
        createdBy: userId,
    }).sort({createdAt: 1});

    return res.json(
        new ApiResponse(200, 'User texts fetched successfully', texts)
    );
});

const deleteTextContent = asyncHandler(async (req, res) => {
    const {contentId} = req.params;
    const userId = req.userId;

    const content = await TimeCapsuleContent.findById(contentId);
    if (!content || !['text', 'question'].includes(content.type)) {
        throw new ApiError(404, 'Text not found');
    }

    const capsule = await TimeCapsule.findById(content.capsule);

    const canDelete =
        capsule.owner.toString() === userId ||
        content.createdBy.toString() === userId;

    if (!canDelete) {
        throw new ApiError(403, 'Not allowed');
    }

    await TimeCapsuleContent.findByIdAndDelete(contentId);

    return res.json(new ApiResponse(200, 'Text deleted successfully'));
});

export {
    getMyImagesForTimeCapsule,
    uploadImagesToTimeCapsule,
    deleteImageContent,
    getMyVideosForTimeCapsule,
    uploadVideoToTimeCapsule,
    deleteVideoContent,
    getMyAudioForTimeCapsule,
    uploadAudioToTimeCapsule,
    deleteAudioContent,
    getMyTextsForTimeCapsule,
    addTextToTimeCapsule,
    deleteTextContent,
};
