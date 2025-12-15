import { useEffect, useState } from 'react';
import { useApi } from '@/hooks';
import { AlertTriangle } from 'lucide-react';

const DEMO_KEY = 'echoes-demo-warning-shown';

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
                            <AlertTriangle className="w-12 h-12 text-yellow-400 animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-serif font-bold text-foreground">
                            Demo Environment Notice
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            This website is deployed on <strong>Vercel</strong>{' '}
                            as a <strong>frontend-only demo</strong>.
                            <br />
                            <br />
                            The backend server is <strong>not connected</strong>{' '}
                            in this environment.
                        </p>

                        <p className="text-muted-foreground">
                            To fully test and use this application, please clone
                            the repository and run it locally.
                        </p>

                        <a
                            href="https://github.com/prana-W/echoes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-primary underline underline-offset-4 hover:opacity-90 transition"
                        >
                            View GitHub Repository
                        </a>

                        <button
                            onClick={handleCloseDemoWarning}
                            className="w-full mt-4 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
                        >
                            I Understand
                        </button>
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
