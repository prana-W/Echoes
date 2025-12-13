import {Server} from 'socket.io';

function initializeSocket(httpServer) {
    // Todo: Add options as needed
    const io = new Server(httpServer, {
        cors: {
            origin: '*', //todo: Adjust this to your client's origin in production
        },
    });

    return io;
}

export default initializeSocket;
