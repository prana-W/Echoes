import {asyncHandler, ApiResponse} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';

const checkHealth = asyncHandler(async (req, res) => {
    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Server is running!', {
            test: process.env.TEST,
        })
    );
});

export default checkHealth;
