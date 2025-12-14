import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_SERVER_URL, {
    withCredentials: true,
    autoConnect: true,
});

const generatePosition = () => ({
    x: Math.random() * 90 + 5, // %
    y: Math.random() * 90 + 5,
});

const getInitials = (name = "") =>
    name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

/* ---------------- Component ---------------- */
const OnlinePeopleWidget = () => {
    const api = useApi();

    const [people, setPeople] = useState([]);
    const [totalOnline, setTotalOnline] = useState(0);

    // Persist star positions per user
    const positionsRef = useRef({});

    /* ---------------- Initial Fetch ---------------- */
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

    useEffect(() => {
        fetchPresence();
    }, []);

    /* ---------------- Socket Updates ---------------- */
    useEffect(() => {
        const handleOnline = ({ userId, name }) => {
            toast.message(`${name} came online!`);

            setPeople((prev) => {
                if (prev.some((p) => p.userId === userId)) return prev;

                const pos = generatePosition();
                positionsRef.current[userId] = pos;

                return [
                    ...prev,
                    {
                        userId,
                        name,
                        online: true,
                        position: pos,
                    },
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
        };
    }, []);

    return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 vintage-shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg">Online Now</h3>
                <span className="text-sm text-muted-foreground">
                    {totalOnline} online
                </span>
            </div>

            {/* Star Map */}
            <div
                className="
                    relative h-64 w-full rounded-lg
                    bg-background overflow-hidden
                    border border-border
                "
            >
                {/* Stars */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:18px_18px]" />

                {/* People */}
                {people.map((person) => (
                    <div
                        key={person.userId}
                        className="absolute group transition-transform duration-500 hover:scale-125"
                        style={{
                            left: `${person.position.x}%`,
                            top: `${person.position.y}%`,
                        }}
                    >
                        {/* Bubble */}
                        <div
                            className="
                                w-9 h-9 rounded-full
                                bg-primary/80 text-primary-foreground
                                flex items-center justify-center
                                font-semibold text-xs
                                vintage-glow cursor-pointer
                            "
                        >
                            {getInitials(person.name)}
                        </div>

                        {/* Tooltip */}
                        <div
                            className="
                                absolute -top-8 left-1/2 -translate-x-1/2
                                px-2 py-1 rounded-md
                                bg-card border border-border
                                text-xs whitespace-nowrap
                                opacity-0 group-hover:opacity-100
                                transition-opacity
                            "
                        >
                            {person.name}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-muted-foreground italic text-center">
                Every light is someone thinking, right now.
            </p>
        </div>
    );
};

export default OnlinePeopleWidget;
