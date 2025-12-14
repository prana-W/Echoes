import { usePresence } from "@/context/PresenceContext";

const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const OnlinePeopleWidget = () => {
    const { people, totalOnline } = usePresence();

    return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 vintage-shadow">
            <div className="flex justify-between">
                <h3 className="font-serif text-lg">Online Now</h3>
                <span className="text-sm text-muted-foreground">
                    {totalOnline} online
                </span>
            </div>

            <div className="relative h-64 border border-border rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:18px_18px]" />

                {people.map((p) => (
                    <div
                        key={p.userId}
                        className="absolute group hover:scale-125 transition"
                        style={{
                            left: `${p.position.x}%`,
                            top: `${p.position.y}%`,
                        }}
                    >
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                            {getInitials(p.name)}
                        </div>

                        <div
                            className="
        absolute -top-8 left-1/2 -translate-x-1/2
        text-xs bg-card border px-2 py-1 rounded z-1000
        opacity-0 group-hover:opacity-100
        whitespace-nowrap
    "                        >
                            {p.name}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default OnlinePeopleWidget;
