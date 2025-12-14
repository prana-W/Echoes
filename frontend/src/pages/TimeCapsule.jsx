import React, { useState, useEffect } from 'react';
import { Clock, Plus, Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/index.js';
import { toast } from 'sonner';
import TimeCapsuleCard from '@/components/TimeCapsuleComponent.jsx';

export default function TimeCapsulesPage() {
    const api = useApi();

    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openedCapsules, setOpenedCapsules] = useState([]);
    const [sealedCapsules, setSealedCapsules] = useState([]);
    const [unsealedCapsules, setUnsealedCapsules] = useState([]);

    /* ---------------- Seal ritual ---------------- */
    const [sealTarget, setSealTarget] = useState(null);
    const [sealHolding, setSealHolding] = useState(false);
    const [sealProgress, setSealProgress] = useState(0);

    /* ---------------- Open ritual ---------------- */
    const [openTarget, setOpenTarget] = useState(null);
    const [openHolding, setOpenHolding] = useState(false);
    const [openProgress, setOpenProgress] = useState(0);

    useEffect(() => {
        fetchCapsules();
    }, []);

    /* ---------------- Fetch ---------------- */
    const fetchCapsules = async () => {
        setLoading(true);
        try {
            const { data, success } = await api.get('/timecapsule');
            if (success && data) {
                setCapsules(data);
                categorize(data);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to load capsules');
        } finally {
            setLoading(false);
        }
    };

    const categorize = (list) => {
        const opened = [];
        const sealed = [];
        const unsealed = [];

        list.forEach(c => {
            if (c.isOpened) opened.push(c);
            else if (c.isSealed) sealed.push(c);
            else unsealed.push(c);
        });

        setOpenedCapsules(opened);
        setSealedCapsules(sealed);
        setUnsealedCapsules(unsealed);
    };

    /* ---------------- Navigation handlers ---------------- */
    const handleEdit = (capsule) => {
        window.location.href = `/capsule/assemble/?new=false&capsuleId=${capsule._id}`;
    };

    const handleAddMemories = (capsule) => {
        window.location.href = `/capsule/memories/${capsule._id}`;
    };

    const handleView = (capsule) => {
        window.location.href = `/capsule/view/${capsule._id}`;
    };

    /* ---------------- Seal logic ---------------- */
    const handleSeal = (capsule) => {
        setSealTarget(capsule);
        setSealHolding(false);
        setSealProgress(0);
    };

    useEffect(() => {
        if (!sealHolding) return;

        const start = Date.now();
        const duration = 5000;

        const interval = setInterval(() => {
            const progress = Math.min(
                ((Date.now() - start) / duration) * 100,
                100
            );
            setSealProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                finalizeSeal();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [sealHolding]);

    const finalizeSeal = async () => {
        try {
            await api.put(`/timecapsule/${sealTarget._id}`, { isSealed: true });
            toast.success('Capsule sealed successfully.');
            setSealTarget(null);
            setSealHolding(false);
            setSealProgress(0);
            fetchCapsules();
        } catch (err) {
            toast.error(err?.message || 'Failed to seal capsule');
            setSealHolding(false);
        }
    };

    /* ---------------- Open logic ---------------- */
    const canOpenCapsule = (capsule) => {
        if (!capsule.isSealed || capsule.isOpened) return false;
        if (capsule.isEventRelated) return false;


        if (new Date(capsule?.openAt) < new Date()) {
            return true;
        }

        return false;
    };

    const handleOpenRequest = (capsule) => {
        setOpenTarget(capsule);
        setOpenHolding(false);
        setOpenProgress(0);
    };

    useEffect(() => {
        if (!openHolding) return;

        const start = Date.now();
        const duration = 5000;

        const interval = setInterval(() => {
            const progress = Math.min(
                ((Date.now() - start) / duration) * 100,
                100
            );
            setOpenProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                finalizeOpen();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [openHolding]);

    const finalizeOpen = async () => {
        try {
            const { success } = await api.post(
                `/timecapsule/open/${openTarget._id}`
            );

            if (success) {
                toast.success(
                    'The capsule is finally opened. You may now view the memories.'
                );
                setOpenTarget(null);
                setOpenHolding(false);
                setOpenProgress(0);
                fetchCapsules();
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to open capsule');
            setOpenHolding(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/30">
                <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold">
                            My Time Capsules
                        </h1>
                        <p className="text-muted-foreground">
                            Your memories preserved through time
                        </p>
                    </div>

                    <Button
                        size="lg"
                        className="bg-primary text-primary-foreground"
                        onClick={() =>
                            (window.location.href =
                                '/capsule/assemble?new=true')
                        }
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Capsule
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-16">
                {/* 1️⃣ Waiting to be sealed */}
                {unsealedCapsules.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold mb-6">
                            Waiting to be Sealed
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {unsealedCapsules.map(c => (
                                <TimeCapsuleCard
                                    key={c._id}
                                    capsule={c}
                                    onEdit={handleEdit}
                                    onAddMemories={handleAddMemories}
                                    onSeal={handleSeal}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 2️⃣ Opened */}
                {openedCapsules.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold mb-6">
                            Opened & Revealed
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {openedCapsules.map(c => (
                                <TimeCapsuleCard
                                    key={c._id}
                                    capsule={c}
                                    onOpen={handleView}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 3️⃣ Sealed but not opened */}
                {sealedCapsules.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold mb-6">
                            Sealed & Waiting
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {sealedCapsules.map(c => (
                                <TimeCapsuleCard
                                    key={c._id}
                                    capsule={c}
                                    onOpen={
                                        canOpenCapsule(c)
                                            ? () => handleOpenRequest(c)
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* ---------------- Seal Modal ---------------- */}
            {sealTarget && (
                <HoldModal
                    title="Seal This Capsule?"
                    subtitle="This action is irreversible."
                    progress={sealProgress}
                    onHoldStart={() => setSealHolding(true)}
                    onHoldEnd={() => {
                        setSealHolding(false);
                        setSealProgress(0);
                    }}
                    onCancel={() => setSealTarget(null)}
                    icon={<Lock className="w-12 h-12 text-secondary" />}
                />
            )}

            {/* ---------------- Open Modal ---------------- */}
            {openTarget && (
                <HoldModal
                    title="Open This Capsule?"
                    subtitle="Time has arrived. Memories await."
                    progress={openProgress}
                    onHoldStart={() => setOpenHolding(true)}
                    onHoldEnd={() => {
                        setOpenHolding(false);
                        setOpenProgress(0);
                    }}
                    onCancel={() => setOpenTarget(null)}
                    icon={<LockOpen className="w-12 h-12 text-primary" />}
                />
            )}
        </div>
    );
}

/* ---------------- Shared Hold Modal ---------------- */
function HoldModal({
                       title,
                       subtitle,
                       progress,
                       onHoldStart,
                       onHoldEnd,
                       onCancel,
                       icon,
                   }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl p-8 max-w-md text-center space-y-6">
                <div className="mx-auto">{icon}</div>

                <h2 className="text-2xl font-serif font-bold">{title}</h2>
                <p className="text-sm text-muted-foreground">{subtitle}</p>

                <div
                    className="relative select-none"
                    onMouseDown={onHoldStart}
                    onMouseUp={onHoldEnd}
                    onMouseLeave={onHoldEnd}
                >
                    <div className="h-14 rounded-lg bg-muted overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center font-serif">
                        Hold for 5 seconds
                    </div>
                </div>

                <Button variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
