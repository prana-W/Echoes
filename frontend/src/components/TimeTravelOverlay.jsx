import {useEffect, useState} from 'react';

const audio = new Audio('/sounds/time_machine.mp3');

export default function TimeTravelOverlay({duration = 5000, onFinish}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        audio.volume = 0.6;

        audio.play().catch(() => {
            // autoplay fallback
            const handler = () => {
                audio.play().catch(() => {});
                window.removeEventListener('click', handler);
            };
            window.addEventListener('click', handler);
        });

        const timer = setTimeout(() => {
            setVisible(false);
            onFinish?.();
        }, duration);

        return () => {
            clearTimeout(timer);
            audio.pause();
            audio.currentTime = 0;
        };
    }, [duration, onFinish]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            <img
                src="/time_travel.gif"
                alt="Time traveling..."
                className="w-full h-full object-cover"
            />

            {/* Optional cinematic text */}
            <div className="absolute bottom-12 text-center">
                <p className="text-white/80 text-lg tracking-widest animate-pulse">
                    Traversing time…
                </p>
            </div>
        </div>
    );
}
