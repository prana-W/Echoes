import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="max-w-xl w-full text-center">
                {/* Card */}
                <div className="bg-card border border-border rounded-xl p-10 vintage-shadow">
                    {/* 404 */}
                    <h1 className="text-8xl font-extrabold text-primary mb-4 tracking-tight">
                        404
                    </h1>

                    {/* Title */}
                    <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                        This memory seems lost
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        The page you’re trying to reach doesn’t exist, or it may
                        have faded away with time.
                    </p>

                    {/* Action */}
                    <Link
                        to="/"
                        className="
                            inline-flex items-center justify-center
                            px-8 py-3 rounded-md
                            bg-primary text-primary-foreground
                            font-medium
                            hover:vintage-glow
                            transition-all duration-300
                        "
                    >
                        Return back to the Reality
                    </Link>
                </div>

                {/* Subtle footer text */}
                <p className="mt-6 text-sm text-muted-foreground italic">
                    Some moments are meant to be remembered, others forgotten.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
