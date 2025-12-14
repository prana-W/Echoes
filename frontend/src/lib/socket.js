import {io} from 'socket.io-client';

let socket;

const getSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_BASE_SERVER_URL, {
            withCredentials: true,
            autoConnect: false, // IMPORTANT
        });
    }
    return socket;
};

export default getSocket;
