import verifySocketAccessToken from "./middlewares/verifySocketAccessToken.middleware.js";
import { onlineUsers } from "../store/presence.store.js";
import User from "../models/user.model.js";

function registerSockets(io) {
    // Authenticate every socket
    io.use(verifySocketAccessToken());

    io.on("connection", async (socket) => {
        const userId = socket.userId;

        // Resolve name (JWT or DB fallback)
        let name = socket.name;
        if (!name) {
            const user = await User.findById(userId).select("name");
            name = user?.name || "Unknown";
        }

        console.log("✅ Socket connected:", socket.id, "User:", userId);

        // First connection for this user
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, {
                sockets: new Set(),
                name,
            });

            // Notify everyone
            io.emit("user:online", { userId, name });
        }

        // Track socket
        onlineUsers.get(userId).sockets.add(socket.id);

        socket.on("disconnect", () => {
            const entry = onlineUsers.get(userId);
            if (!entry) return;

            entry.sockets.delete(socket.id);

            // Last socket disconnected → user offline
            if (entry.sockets.size === 0) {
                onlineUsers.delete(userId);
                io.emit("user:offline", { userId, name: entry.name });
            }

            console.log("❌ Socket disconnected:", socket.id);
        });
    });
}

export default registerSockets;
