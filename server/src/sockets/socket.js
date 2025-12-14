import verifyAccessToken from './middlewares/verifyAccessToken.middleware.js';
import {onlineUsers} from '../store/presence.store.js';

function registerSockets(io) {
    // Middleware to verify access token for each socket connection
    io.use(verifyAccessToken());

    io.on('connection', (socket) => {
        console.log('✅ Socket connected:', socket.id);

        // const userId = socket.handshake.auth.userId;
        const userId = socket?.userId;
        console.log(userId);

        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit('presence:update', {userId, status: 'online'});
        }

        socket.on('disconnect', () => {
            if (userId) {
                onlineUsers.delete(userId);
                io.emit('presence:update', {userId, status: 'offline'});
            }
        });
    });
}

export default registerSockets;
