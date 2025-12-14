import React from 'react';
import {
    Clock,
    Lock,
    LockOpen,
    Edit,
    Plus,
    Sparkles,
    Users,
    Calendar,
    CheckCircle,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

export default function TimeCapsuleCard({
    capsule,
    onEdit,
    onAddMemories,
    onSeal,
    onOpen,
}) {
    const isLocked = capsule.isSealed && !capsule.isOpened;
    const isOpened = capsule.isOpened;
    const canEdit = capsule.isOwner && !capsule.isSealed;
    const canAddMemories =
        (capsule.isOwner || capsule.isContributor) && !capsule.isSealed;
    const canSeal = capsule.isOwner && !capsule.isSealed;

    const isEventBased = capsule.isEventRelated;

    /* ---------------- Date logic (only if NOT event-based) ---------------- */
    let formattedDate = null;
    let daysUntil = null;
    let isPast = false;

    if (!isEventBased && capsule.openAt) {
        const openDate = new Date(capsule.openAt);
        formattedDate = openDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        daysUntil = Math.ceil((openDate - new Date()) / (1000 * 60 * 60 * 24));
        isPast = openDate.getTime() <= Date.now();
    }

    return (
        <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 group">
            {/* Capsule Shape Background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <svg viewBox="0 0 200 300" className="w-full h-full">
                    <ellipse
                        cx="100"
                        cy="80"
                        rx="80"
                        ry="80"
                        fill="currentColor"
                        className="text-primary"
                    />
                    <rect
                        x="20"
                        y="80"
                        width="160"
                        height="140"
                        fill="currentColor"
                        className="text-primary"
                    />
                    <ellipse
                        cx="100"
                        cy="220"
                        rx="80"
                        ry="80"
                        fill="currentColor"
                        className="text-primary"
                    />
                </svg>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`p-2 rounded-full ${
                                    isOpened
                                        ? 'bg-primary/20 vintage-glow'
                                        : isLocked
                                          ? 'bg-secondary/20'
                                          : 'bg-muted'
                                }`}
                            >
                                {isOpened ? (
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                ) : isLocked ? (
                                    <Lock className="w-5 h-5 text-secondary" />
                                ) : (
                                    <LockOpen className="w-5 h-5 text-muted-foreground" />
                                )}
                            </div>

                            <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                {capsule.title}
                            </h3>
                        </div>

                        <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 mb-3"
                        >
                            {capsule.theme}
                        </Badge>
                    </div>

                    {canEdit && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-primary/10 hover:text-primary"
                            onClick={() => onEdit(capsule)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {capsule.description}
                </p>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    {/* Date / Event */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {isEventBased ? (
                            <span className="italic">
                                Event:{' '}
                                <span className="text-foreground font-medium capitalize">
                                    {capsule.event}
                                </span>
                            </span>
                        ) : (
                            <span>{formattedDate}</span>
                        )}
                    </div>

                    {/* Contributors */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>
                            {capsule.contributors.length} contributor
                            {capsule.contributors.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Status Line */}
                <div className="mb-4">
                    {isOpened ? (
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Opened & Revealed</span>
                        </div>
                    ) : isLocked ? (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            {isEventBased ? (
                                <span className="text-muted-foreground italic">
                                    Opens when{' '}
                                    <span className="text-foreground font-medium capitalize">
                                        {capsule.event}
                                    </span>{' '}
                                    happens
                                </span>
                            ) : isPast ? (
                                <span className="text-secondary font-medium">
                                    Ready to open!
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Opens in{' '}
                                    <span className="text-foreground font-medium">
                                        {daysUntil}
                                    </span>{' '}
                                    days
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <LockOpen className="w-4 h-4" />
                            <span className="italic">Not sealed yet</span>
                        </div>
                    )}
                </div>

                {/* Wax Seal */}
                {isLocked && (
                    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-destructive/30 flex items-center justify-center border-2 border-destructive/50">
                            <Lock className="w-8 h-8 text-destructive" />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap pt-4 border-t border-border">
                    {isOpened ? (
                        <Button
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => onOpen(capsule)}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            View Memories
                        </Button>
                    ) : isLocked ? (
                        <>
                            {!isEventBased && isPast && (
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground vintage-glow"
                                    onClick={() => onOpen(capsule)}
                                >
                                    <LockOpen className="w-4 h-4 mr-2" />
                                    Open Capsule
                                </Button>
                            )}

                            {(!isPast || isEventBased) && (
                                <Button
                                    variant="outline"
                                    className="flex-1 border-border cursor-not-allowed opacity-50"
                                    disabled
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Sealed
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            {canAddMemories && (
                                <Button
                                    variant="outline"
                                    className="flex-1 border-primary/50 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => onAddMemories(capsule)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Memories
                                </Button>
                            )}
                            {canSeal && (
                                <Button
                                    className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                    onClick={() => onSeal(capsule)}
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Seal Capsule
                                </Button>
                            )}
                        </>
                    )}
                </div>

                {/* Owner Badge */}
                {capsule.isOwner && (
                    <div className="absolute bottom-2 right-2">
                        <Badge
                            variant="outline"
                            className="text-xs border-primary/30 text-primary/70"
                        >
                            Owner
                        </Badge>
                    </div>
                )}
            </div>
        </Card>
    );
}
