import React from 'react';
import {usePresence} from '@/context/PresenceContext';

const getInitials = (name = '') =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const OnlinePeopleWidget = () => {
    const {people, totalOnline} = usePresence();

    // Determine tooltip position based on bubble location
    const getTooltipClass = (position) => {
        const {x, y} = position;
        let classes =
            'absolute text-xs bg-card border border-border px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-50';

        // Position tooltip based on bubble location
        if (y < 25) {
            // Near top - show below
            classes += ' top-full mt-2 left-1/2 -translate-x-1/2';
        } else if (y > 75) {
            // Near bottom - show above
            classes += ' bottom-full mb-2 left-1/2 -translate-x-1/2';
        } else if (x < 25) {
            // Near left - show right
            classes += ' left-full ml-2 top-1/2 -translate-y-1/2';
        } else if (x > 75) {
            // Near right - show left
            classes += ' right-full mr-2 top-1/2 -translate-y-1/2';
        } else {
            // Center - show above
            classes += ' bottom-full mb-2 left-1/2 -translate-x-1/2';
        }

        return classes;
    };

    return (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 vintage-shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                        Echoes in the Present
                    </h3>
                </div>
                <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
                    {totalOnline} online
                </span>
            </div>

            {/* Canvas Area */}
            <div className="relative h-80 border-2 border-border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(211,167,89,0.08)_1px,transparent_0)] bg-[size:20px_20px]" />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />

                {/* People Bubbles */}
                {people.map((p) => (
                    <div
                        key={p.userId}
                        className="absolute group cursor-pointer"
                        style={{
                            left: `${p.position.x}%`,
                            top: `${p.position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                        }}
                    >
                        {/* Avatar Circle */}
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg transform transition-all duration-300 group-hover:scale-125 vintage-glow ring-2 ring-background">
                                {getInitials(p.name)}
                            </div>

                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                        </div>

                        {/* Tooltip with smart positioning */}
                        <div className={getTooltipClass(p.position)}>
                            <div className="font-medium text-foreground">
                                {p.name}
                            </div>
                        </div>

                        {/* Subtle pulse effect */}
                        <div
                            className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100"
                            style={{animationDuration: '1.5s'}}
                        />
                    </div>
                ))}

                {/* Empty state */}
                {people.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <svg
                            className="w-16 h-16 mb-2 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <p className="text-sm">No one online right now</p>
                    </div>
                )}
            </div>

            {/* Footer info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>Check who’s online right now</span>
            </div>
        </div>
    );
};

export default OnlinePeopleWidget;
