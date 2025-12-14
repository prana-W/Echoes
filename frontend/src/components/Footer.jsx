import { useEffect, useState } from "react";
import { useApi } from "@/hooks/index.js";

const Footer = () => {
    const [pageViews, setPageViews] = useState(0);
    const [displayViews, setDisplayViews] = useState(0);
    const api = useApi();

    useEffect(() => {
        const updateVisitors = async () => {
            try {
                const { data } = await api.post("/visitors");
                setPageViews(data?.count || 0);
            } catch (err) {
                console.error("Visitor update failed", err);
            }
        };

        updateVisitors();
    }, []);

    useEffect(() => {
        if (!pageViews) return;

        let current = displayViews;
        const increment = Math.max(1, Math.floor((pageViews - current) / 20));

        const interval = setInterval(() => {
            current += increment;
            if (current >= pageViews) {
                current = pageViews;
                clearInterval(interval);
            }
            setDisplayViews(current);
        }, 40);

        return () => clearInterval(interval);
    }, [pageViews]);

    return (
        <footer className="border-t border-border py-6 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">

                {/* Left */}
                <div className="text-center md:text-left">
                    © {new Date().getFullYear()}{" "}
                    <span className="text-foreground font-medium">
                        Echoes of the Past
                    </span>
                </div>

                {/* Center */}
                <div className="tracking-wide">
                    Page views{" "}
                    <span className="text-foreground font-semibold">
                        {displayViews.toLocaleString()}
                    </span>
                </div>

                {/* Right */}
                <div className="text-center md:text-right">
                    Made with <span className="text-red-400">❤️</span> by{" "}
                    <a
                        href="https://pranaw-kumar-portfolio.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground font-medium hover:underline hover:text-primary transition"
                    >
                        Pranaw Kumar
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
