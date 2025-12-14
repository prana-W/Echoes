import React from 'react';
import {cn} from '@/lib/utils'; // Ensure you have your utility helper available

const Logo = ({className, ...props}) => {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            // Default size is w-16 h-16, but overrides apply via className
            className={cn('w-20 h-20', className)}
            {...props}
        >
            {/* Background Circle
        Centered at (32,32) with a radius of 32 to fill the 64x64 viewbox.
        Uses your theme's dark background color.
      */}
            <circle cx="40" cy="40" r="40" className="fill-background" />

            {/* Ripple/Echo Effect
        Uses 'stroke-primary' to automatically use your vintage amber color.
      */}
            <g className="stroke-primary" strokeWidth="5" strokeLinecap="round">
                {/* Inner ripple - Lower opacity */}
                <path
                    d="M20 44 C 20 30.745 30.745 20 44 20"
                    className="opacity-60"
                />

                {/* Middle ripple - Medium opacity */}
                <path
                    d="M14 50 C 14 30.118 30.118 14 50 14"
                    className="opacity-80"
                />

                {/* Outer ripple - Full opacity */}
                <path d="M8 56 C 8 29.49 29.49 8 56 8" />
            </g>
        </svg>
    );
};

export default Logo;
