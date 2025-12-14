import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import getSocket from "@/lib/socket";

const socket = getSocket();

const PresenceContext = createContext(null);

export const PresenceProvider = ({ children }) => {
    const api = useApi();

    const [people, setPeople] = useState([]);
    const [totalOnline, setTotalOnline] = useState(0);

    const positionsRef = useRef({});

    const generatePosition = () => ({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
    });

    /* ---------- Initial fetch ---------- */
    const fetchPresence = async () => {
        try {
            const { data } = await api.get("/users/presence");

            const enriched = data.myRelationsData.map((p) => {
                if (!positionsRef.current[p.userId]) {
                    positionsRef.current[p.userId] = generatePosition();
                }

                return {
                    ...p,
                    position: positionsRef.current[p.userId],
                };
            });

            setPeople(enriched);
            setTotalOnline(data.totalOnlineUsers ?? enriched.length);
        } catch (err) {
            toast.error(err?.message || "Failed to fetch presence");
        }
    };

    /* ---------- Socket lifecycle ---------- */
    useEffect(() => {
        socket.connect();
        fetchPresence();

        const handleOnline = ({ userId, name }) => {

            setPeople((prev) => {
                if (prev.some((p) => p.userId === userId)) return prev;

                const pos = generatePosition();
                positionsRef.current[userId] = pos;

                return [
                    ...prev,
                    { userId, name, online: true, position: pos },
                ];
            });

            setTotalOnline((prev) => prev + 1);
        };

        const handleOffline = ({ userId }) => {
            setPeople((prev) =>
                prev.filter((p) => p.userId !== userId)
            );
            setTotalOnline((prev) => Math.max(prev - 1, 0));
        };

        socket.on("user:online", handleOnline);
        socket.on("user:offline", handleOffline);

        return () => {
            socket.off("user:online", handleOnline);
            socket.off("user:offline", handleOffline);
            socket.disconnect();
        };
    }, []);

    return (
        <PresenceContext.Provider
            value={{ people, totalOnline }}
        >
            {children}
        </PresenceContext.Provider>
    );
};

export const usePresence = () => {
    const ctx = useContext(PresenceContext);
    if (!ctx) {
        throw new Error("usePresence must be used inside PresenceProvider");
    }
    return ctx;
};
