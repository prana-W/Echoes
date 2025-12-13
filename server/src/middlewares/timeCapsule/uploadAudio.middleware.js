import createUploader from "../../utility/uploadMediaTimeCapsule.util.js";

const uploadAudio = createUploader({
    allowedMimePrefix: "audio/",
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10,
});

export default uploadAudio;
