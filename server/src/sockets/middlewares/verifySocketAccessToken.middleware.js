import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import {ApiError} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';

const verifySocketAccessToken = () => {
    return (socket, next) => {
        try {
            const cookies = socket.handshake.headers?.cookie;

            if (!cookies) {
                throw new ApiError(statusCode.UNAUTHORIZED, 'No cookies found');
            }

            const parsedCookies = cookie.parse(cookies);
            const accessToken = parsedCookies.accessToken;

            if (!accessToken) {
                throw new ApiError(
                    statusCode.UNAUTHORIZED,
                    'Access token missing in cookies'
                );
            }

            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            socket.userId = decoded.userId;
            socket.name = decoded.name;

            next();
        } catch (err) {
            next(new ApiError(statusCode.UNAUTHORIZED, err.message));
        }
    };
};

export default verifySocketAccessToken;
