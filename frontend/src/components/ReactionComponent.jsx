import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import { REACTIONS } from "@/constants/reactions.js";

const HIDE_DELAY = 180; // ms – enough to move cursor comfortably

const ReactionBar = ({ timecapsuleId }) => {
    const api = useApi();

    const [open, setOpen] = useState(false);
    const [myReaction, setMyReaction] = useState(null);
    const [allReactions, setAllReactions] = useState([]);

    const hideTimeoutRef = useRef(null);

    /* ---------------- Fetch reactions ---------------- */
    const fetchReactions = async () => {
        try {
            const { data } = await api.get(
                `/timecapsule/reaction/${timecapsuleId}`
            );

            setMyReaction(data?.myReaction?.reactionType || null);
            setAllReactions(data?.allReaction?.reactions || []);
        } catch (err) {
            // silent: reaction is optional
        }
    };

    useEffect(() => {
        // initial fetch
        fetchReactions();

        // poll every 3 seconds
        const intervalId = setInterval(() => {
            fetchReactions();
        }, 3000);

        // cleanup on unmount / capsule change
        return () => clearInterval(intervalId);
    }, [timecapsuleId]);


    /* ---------------- React ---------------- */
    const handleReact = async (type) => {
        try {
            const { success, message } = await api.post(
                `/timecapsule/reaction/${timecapsuleId}`,
                { reactionType: type }
            );

            if (success) {
                toast.success(message || "Reaction saved");
                fetchReactions(); // 🔁 re-sync from server
            }
        } catch (err) {
            toast.error(err?.message);
        }
    };

    /* ---------------- Hover handling ---------------- */
    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        setOpen(true);
    };

    const handleMouseLeave = () => {
        hideTimeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, HIDE_DELAY);
    };

    const getCount = (type) =>
        allReactions.find((r) => r.type === type)?.count || 0;

    const selectedEmoji =
        REACTIONS.find((r) => r.type === myReaction)?.emoji || "😊";

    return (
        <div
            className="fixed bottom-6 left-6 z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Main Button */}
            <div
                className="
                    px-4 py-2 rounded-full bg-card border border-border
                    shadow-lg cursor-pointer flex items-center gap-2
                    hover:vintage-glow transition-all
                "
            >
                <span className="text-lg">{selectedEmoji}</span>
                <span className="text-xs text-muted-foreground">React</span>
            </div>

            {/* Reaction Popup */}
            {open && (
                <div
                    className="
                        absolute bottom-14 left-0
                        flex gap-2 items-center
                        bg-card border border-border
                        rounded-full px-3 py-2
                        shadow-xl
                        animate-in fade-in zoom-in
                    "
                >
                    {REACTIONS.map((r) => {
                        const isSelected = myReaction === r.type;
                        const count = getCount(r.type);

                        return (
                            <button
                                key={r.type}
                                onClick={() => handleReact(r.type)}
                                className={`
                                    relative text-2xl transition-transform
                                    hover:scale-125
                                    ${
                                    isSelected
                                        ? "drop-shadow-[0_0_6px_rgba(255,200,100,0.8)]"
                                        : ""
                                }
                                `}
                            >
                                {r.emoji}

                                {count > 0 && (
                                    <span
                                        className="
                                            absolute -top-2 -right-2
                                            text-[10px]
                                            bg-primary text-primary-foreground
                                            rounded-full px-1
                                        "
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReactionBar;
