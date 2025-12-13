import createUploader from '../../utility/uploadMediaTimeCapsule.util.js';

const uploadImages = createUploader({
    allowedMimePrefix: 'image/',
    maxFileSize: 50 * 1024 * 1024,
    maxFiles: 20,
});

export default uploadImages;
