import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {SERVER_TIME} from '../constants/constants.js';

const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const {timecapsuleId} = req.params;
        const userId = req.userId;

        const random = Math.floor(Math.random() * 1e9);

        const filename = `${timecapsuleId}_${userId}_${SERVER_TIME()}_${random}${path.extname(
            file.originalname
        )}`;

        cb(null, filename);
    },
});

/**
 * Multer factory
 */
const createUploader = ({
    allowedMimePrefix,
    maxFileSize = 50 * 1024 * 1024,
    maxFiles = 20,
}) => {
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith(allowedMimePrefix)) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${allowedMimePrefix} files are allowed`), false);
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxFileSize,
            files: maxFiles,
        },
    });
};

export default createUploader;
