import { useEffect, useState } from 'react';
import { useApi } from '@/hooks';
import { AlertTriangle } from 'lucide-react';

const DEMO_KEY = 'vercel_warning_shown';

const Footer = () => {
    const [pageViews, setPageViews] = useState(0);
    const [displayViews, setDisplayViews] = useState(0);
    const [showDemoWarning, setShowDemoWarning] = useState(false);

    const api = useApi();

    /* ---------------- Page Views ---------------- */
    useEffect(() => {
        const updateVisitors = async () => {
            try {
                const { data } = await api.post('/visitors');
                setPageViews(data?.count || 0);
            } catch (err) {
                console.error('Visitor update failed', err);
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

    /* ---------------- DEMO WARNING ---------------- */
    useEffect(() => {
        const isVercel =
            typeof window !== 'undefined' &&
            window.location.hostname.includes('vercel.app');

        const alreadyShown = localStorage.getItem(DEMO_KEY);

        if (isVercel && !alreadyShown) {
            setShowDemoWarning(true);
        }
    }, []);

    const handleCloseDemoWarning = () => {
        localStorage.setItem(DEMO_KEY, 'true');
        setShowDemoWarning(false);
    };

    return (
        <>
            {/* ---------------- DEMO WARNING MODAL ---------------- */}
            {showDemoWarning && (
                <div className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center px-6">
                    <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 text-center space-y-6 vintage-shadow">
                        <div className="flex justify-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-serif font-bold text-foreground">
                            Demo Environment Notice
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            This application uses a <strong>React frontend deployed on Vercel</strong>{" "}
                            and a <strong>Node.js backend hosted on Render</strong>.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            Due to several <span className="text-red-500 font-medium">platform-level limitations</span>,
                            the web app may <span className="text-red-500 font-medium">not behave as originally intended</span>{" "}
                            in this environment.
                        </p>

                        <div className="text-left text-sm space-y-2">
                            <p className="text-red-500">
                                • Server ↔ Client timezone mismatches
                            </p>
                            <p className="text-red-500">
                                • No server-side file storage
                            </p>
                            <p className="text-red-500">
                                • Long backend wake-up times (cold starts)
                            </p>
                            <p className="text-red-500">
                                • Server sleeping causes CRON jobs to fail or skip
                            </p>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            Because of these and other unintended issues, almost every feature may behave
                            unpredictably or not work at all.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            To experience the application <strong>as it was designed</strong>,
                            we <span className="text-red-500 font-medium">strongly recommend</span>{" "}
                            running the project locally using Docker.
                            The setup requires just <strong>one command</strong>, available in the repository.
                        </p>

                        <div className="space-y-3 pt-2">
                            <a
                                href="https://github.com/prana-W/Echoes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
                            >
                                Run Locally (Recommended)
                            </a>

                            <button
                                onClick={handleCloseDemoWarning}
                                className="w-full px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            >
                                Explore a Bit Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- FOOTER ---------------- */}
            <footer className="border-t border-border py-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm">

                    {/* Left - Page Views */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <div>
                            Page views{' '}
                            <span className="text-foreground font-semibold">
                                {displayViews.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Center - Brand */}
                    <div className="text-center">
                        © {new Date().getFullYear()}{' '}
                        <span className="text-foreground font-medium">
                            Echoes of the Past
                        </span>
                    </div>

                    {/* Right - Credits + GitHub */}
                    <div className="text-center md:text-right space-y-1">
                        <div>
                            Made with <span className="text-red-400">❤️</span>{' '}
                            by{' '}
                            <a
                                href="https://pranaw-kumar-portfolio.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground font-medium hover:underline hover:text-primary transition"
                            >
                                Pranaw Kumar
                            </a>
                        </div>

                        <a
                            href="https://github.com/prana-W/echoes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs hover:text-primary underline underline-offset-4 transition"
                        >
                            View GitHub Repository
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
