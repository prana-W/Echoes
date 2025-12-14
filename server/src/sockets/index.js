import {Server} from 'socket.io';
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

function initializeSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    return io;
}

export default initializeSocket;
