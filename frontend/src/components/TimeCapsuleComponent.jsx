import React, { useState } from 'react';
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
    Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import EmptyCapsule from '@/assets/empty-capsule.png';
import FullCapsule from '@/assets/full_capsule.png';
import LockedCapsule from '@/assets/locked_capsule.png';

export default function TimeCapsuleCard({
                                            capsule,
                                            onEdit,
                                            onAddMemories,
                                            onSeal,
                                            onOpen,
                                        }) {
    const [isHovered, setIsHovered] = useState(false);

    const isLocked = capsule.isSealed && !capsule.isOpened;
    const isOpened = capsule.isOpened;
    const canEdit = capsule.isOwner && !capsule.isSealed;
    const canAddMemories =
        (capsule.isOwner || capsule.isContributor) && !capsule.isSealed;
    const canSeal = capsule.isOwner && !capsule.isSealed;

    const isEventBased = capsule.isEventRelated;

    /* ---------------- Date logic ---------------- */
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

    /* ---------------- Capsule Image ---------------- */
    const capsuleImage = isOpened
        ? FullCapsule
        : isLocked
            ? LockedCapsule
            : EmptyCapsule;

    return (
        <Card
            className="group relative overflow-visible border border-border bg-transparent hover:border-primary/50 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover Details Popup */}
            <div
                className={`absolute -top-2 left-1/2 -translate-x-1/2 w-80 bg-card border-2 border-primary/30 rounded-xl p-5 shadow-2xl vintage-glow z-50 transition-all duration-300 ${
                    isHovered ? 'opacity-100 -translate-y-full' : 'opacity-0 -translate-y-[calc(100%+1rem)] pointer-events-none'
                }`}
            >
                {/* Arrow pointer */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-card border-r-2 border-b-2 border-primary/30 rotate-45" />

                <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {isOpened ? (
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                ) : isLocked ? (
                                    <Lock className="w-5 h-5 text-secondary" />
                                ) : (
                                    <LockOpen className="w-5 h-5 text-muted-foreground" />
                                )}
                                <h3 className="font-serif font-bold text-lg text-foreground">
                                    {capsule.title}
                                </h3>
                            </div>

                            <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20"
                            >
                                {capsule.theme}
                            </Badge>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {capsule.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2.5 text-sm mb-4 bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span>
                                {capsule.contributors.length} contributor
                                {capsule.contributors.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                            {isOpened ? (
                                <>
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-primary font-medium">Opened & Revealed</span>
                                </>
                            ) : isLocked ? (
                                <>
                                    <Clock className="w-4 h-4 text-secondary" />
                                    {isEventBased ? (
                                        <span className="italic">Opens on {capsule.event}</span>
                                    ) : isPast ? (
                                        <span className="text-secondary font-medium">Ready to open!</span>
                                    ) : (
                                        <span>Opens in <strong className="text-primary">{daysUntil}</strong> days</span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                    <span className="italic text-muted-foreground">Not sealed yet</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Owner Badge */}
                    {capsule.isOwner && (
                        <div className="flex justify-end">
                            <Badge
                                variant="outline"
                                className="text-xs border-primary/40 text-primary bg-primary/5"
                            >
                                You own this
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* Capsule Image - Direct on page */}
            <div className="relative h-72 flex items-center justify-center py-8">
                <img
                    src={capsuleImage}
                    alt="Time Capsule"
                    className="h-64 object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-2xl drop-shadow-xl"
                    style={{
                        filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 30px rgba(211, 167, 89, 0.4))' : 'none'
                    }}
                />
            </div>

            {/* Title and Date/Event - Always Visible */}
            <div className="px-6 pb-2 text-center border-t border-border/50 pt-4">
                <h3 className="font-serif font-bold text-xl text-foreground mb-2">
                    {capsule.title}
                </h3>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                    {isEventBased ? (
                        <span className="italic capitalize">
                            Event: <span className="text-foreground font-medium">{capsule.event}</span>
                        </span>
                    ) : (
                        <span className="text-foreground">{formattedDate}</span>
                    )}
                </div>

                {/* Action Buttons - Always Visible */}
                <div className="flex gap-2 justify-center flex-wrap">
                    {isOpened ? (
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 vintage-glow cursor-target"
                            onClick={() => onOpen(capsule)}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            View Memories
                        </Button>
                    ) : isLocked ? (
                        !isEventBased &&
                        isPast && (
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90 vintage-glow animate-pulse"
                                onClick={() => onOpen(capsule)}
                            >
                                <LockOpen className="w-4 h-4 mr-2" />
                                Open Capsule
                            </Button>
                        )
                    ) : (
                        <>
                            {canEdit && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="border border-border hover:border-primary/50 cursor-target"
                                    onClick={() => onEdit(capsule)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                            {canAddMemories && (
                                <Button
                                    variant="outline"
                                    className="border-primary/30 hover:bg-primary/10 cursor-target"
                                    onClick={() => onAddMemories(capsule)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Memories
                                </Button>
                            )}
                            {canSeal && (
                                <Button
                                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-target"
                                    onClick={() => onSeal(capsule)}
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Seal Capsule
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}