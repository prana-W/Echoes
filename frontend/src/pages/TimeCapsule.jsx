import React, { useState, useEffect } from 'react';
import { Clock, Plus, Package, Lock, Sparkles } from 'lucide-react';
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

    // 🔒 Seal ritual state (NEW)
    const [sealTarget, setSealTarget] = useState(null);
    const [holding, setHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);

    useEffect(() => {
        fetchCapsules();
    }, []);

    const fetchCapsules = async () => {
        setLoading(true);
        try {
            const { data, success } = await api.get('/timecapsule');
            if (success && data) {
                setCapsules(data);
                categorizeCapsules(data);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to load time capsules');
        } finally {
            setLoading(false);
        }
    };

    const categorizeCapsules = (capsulesData) => {
        const opened = [];
        const sealed = [];
        const unsealed = [];

        capsulesData.forEach(capsule => {
            if (capsule.isOpened) opened.push(capsule);
            else if (capsule.isSealed) sealed.push(capsule);
            else unsealed.push(capsule);
        });

        setOpenedCapsules(opened);
        setSealedCapsules(sealed);
        setUnsealedCapsules(unsealed);
    };

    const handleEdit = (capsule) => {
        window.location.href = `/capsule/assemble/?new=false&capsuleId=${capsule._id}`;
    };

    const handleAddMemories = (capsule) => {
        window.location.href = `/capsule/${capsule._id}/memories`;
    };

    const handleOpen = (capsule) => {
        window.location.href = `/capsule/${capsule._id}`;
    };

    // ❌ OLD: sealed immediately
    // ✅ NEW: open confirmation ritual
    const handleSeal = (capsule) => {
        setSealTarget(capsule);
        setHoldProgress(0);
        setHolding(false);
    };

    // ⏳ Hold logic (NEW)
    useEffect(() => {
        if (!holding) return;

        const start = Date.now();
        const duration = 5000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setHoldProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                finalizeSeal();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [holding]);

    // ⌨️ Spacebar support (NEW)
    useEffect(() => {
        if (!sealTarget) return;

        const down = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setHolding(true);
            }
        };

        const up = () => {
            setHolding(false);
            setHoldProgress(0);
        };

        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);

        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, [sealTarget]);

    // 🔐 Final seal (same API as before)
    const finalizeSeal = async () => {
        try {
            await api.put(`/timecapsule/${sealTarget._id}`, { isSealed: true });
            toast.success('Capsule sealed successfully!');
            setSealTarget(null);
            setHolding(false);
            setHoldProgress(0);
            fetchCapsules();
        } catch (err) {
            toast.error(err?.message || 'There was an error sealing the capsule');
            setHolding(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* === YOUR ORIGINAL UI BELOW (UNCHANGED) === */}

            {/* Header */}
            <div className="border-b border-border bg-card/30">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-full bg-primary/10 vintage-glow">
                                    <Clock className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-4xl font-serif font-bold text-foreground">
                                    My Time Capsules
                                </h1>
                            </div>
                            <p className="text-muted-foreground ml-14">
                                Your memories preserved through time
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground vintage-glow"
                            onClick={() => window.location.href = '/capsule/assemble?new=true'}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Capsule
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* UNSEALED */}
                {unsealedCapsules.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold mb-6">In Progress</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {unsealedCapsules.map(capsule => (
                                <TimeCapsuleCard
                                    key={capsule._id}
                                    capsule={capsule}
                                    onEdit={handleEdit}
                                    onAddMemories={handleAddMemories}
                                    onSeal={handleSeal}
                                    onOpen={handleOpen}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* SEALED */}
                {sealedCapsules.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold mb-6">Sealed & Waiting</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sealedCapsules.map(capsule => (
                                <TimeCapsuleCard
                                    key={capsule._id}
                                    capsule={capsule}
                                    onOpen={handleOpen}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* OPENED */}
                {openedCapsules.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold mb-6">Opened & Revealed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {openedCapsules.map(capsule => (
                                <TimeCapsuleCard
                                    key={capsule._id}
                                    capsule={capsule}
                                    onOpen={handleOpen}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* SEAL CONFIRMATION MODAL (NEW, NON-INTRUSIVE) */}
            {sealTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-xl p-8 max-w-md text-center space-y-6 vintage-shadow">
                        <Lock className="w-12 h-12 text-secondary mx-auto" />

                        <h2 className="text-2xl font-serif font-bold">
                            Seal This Capsule?
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Once sealed, this capsule cannot be reopened or edited
                            until the chosen date or event.
                            <br /><br />
                            <span className="text-foreground font-medium">
                                This action is irreversible.
                            </span>
                        </p>

                        <div
                            className="relative select-none"
                            onMouseDown={() => setHolding(true)}
                            onMouseUp={() => {
                                setHolding(false);
                                setHoldProgress(0);
                            }}
                            onMouseLeave={() => {
                                setHolding(false);
                                setHoldProgress(0);
                            }}
                        >
                            <div className="h-14 rounded-lg bg-muted overflow-hidden">
                                <div
                                    className="h-full bg-secondary transition-all duration-75"
                                    style={{ width: `${holdProgress}%` }}
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center font-serif">
                                Hold for 5 seconds to SEAL
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground italic">
                            Hold mouse or press & hold <b>Spacebar</b>
                        </p>

                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSealTarget(null);
                                setHolding(false);
                                setHoldProgress(0);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
