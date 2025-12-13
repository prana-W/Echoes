import createUploader from '../../utility/uploadMediaTimeCapsule.util.js';

const uploadVideos = createUploader({
    allowedMimePrefix: 'video/',
    maxFileSize: 300 * 1024 * 1024, // 300MB
    maxFiles: 1,
});

export default uploadVideos;
