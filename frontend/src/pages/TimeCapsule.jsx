import React, {useState, useEffect} from 'react';
import {Plus, Lock, LockOpen} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useApi} from '@/hooks/index.js';
import {toast} from 'sonner';
import TimeCapsuleCard from '@/components/TimeCapsuleComponent.jsx';

const TABS = ['all', 'notSealed', 'sealed', 'opened'];

export default function TimeCapsulesPage() {
    const api = useApi();

    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openedCapsules, setOpenedCapsules] = useState([]);
    const [sealedCapsules, setSealedCapsules] = useState([]);
    const [unsealedCapsules, setUnsealedCapsules] = useState([]);

    const [activeTab, setActiveTab] = useState('all');

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
            const {data, success} = await api.get('/timecapsule');
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

        list.forEach((c) => {
            if (c.isOpened) opened.push(c);
            else if (c.isSealed) sealed.push(c);
            else unsealed.push(c);
        });

        setOpenedCapsules(opened);
        setSealedCapsules(sealed);
        setUnsealedCapsules(unsealed);
    };

    /* ---------------- Helpers ---------------- */
    const canOpenCapsule = (capsule) => {
        if (!capsule.isSealed || capsule.isOpened) return false;
        if (capsule.isEventRelated) return false;
        return new Date(capsule.openAt) < new Date();
    };

    const getVisibleCapsules = () => {
        switch (activeTab) {
            case 'notSealed':
                return unsealedCapsules;
            case 'sealed':
                return sealedCapsules;
            case 'opened':
                return openedCapsules;
            default:
                return capsules;
        }
    };

    /* ---------------- Navigation ---------------- */
    const handleEdit = (c) =>
        (window.location.href = `/capsule/assemble/?new=false&capsuleId=${c._id}`);

    const handleAddMemories = (c) =>
        (window.location.href = `/capsule/memories/${c._id}`);

    const handleView = (c) => (window.location.href = `/capsule/view/${c._id}`);

    /* ---------------- Seal logic ---------------- */
    const handleSeal = (capsule) => {
        setSealTarget(capsule);
        setSealHolding(false);
        setSealProgress(0);
    };

    useEffect(() => {
        if (!sealHolding) return;
        const start = Date.now();
        const interval = setInterval(() => {
            const progress = Math.min(((Date.now() - start) / 5000) * 100, 100);
            setSealProgress(progress);
            if (progress >= 100) finalizeSeal();
        }, 50);
        return () => clearInterval(interval);
    }, [sealHolding]);

    const finalizeSeal = async () => {
        try {
            await api.put(`/timecapsule/${sealTarget._id}`, {isSealed: true});
            toast.success('Capsule sealed successfully.');
            setSealTarget(null);
            setSealHolding(false);
            setSealProgress(0);
            fetchCapsules();
        } catch {
            toast.error('Failed to seal capsule');
        }
    };

    /* ---------------- Open logic ---------------- */
    const handleOpenRequest = (capsule) => {
        setOpenTarget(capsule);
        setOpenHolding(false);
        setOpenProgress(0);
    };

    useEffect(() => {
        if (!openHolding) return;
        const start = Date.now();
        const interval = setInterval(() => {
            const progress = Math.min(((Date.now() - start) / 5000) * 100, 100);
            setOpenProgress(progress);
            if (progress >= 100) finalizeOpen();
        }, 50);
        return () => clearInterval(interval);
    }, [openHolding]);

    const finalizeOpen = async () => {
        try {
            const {success} = await api.post(
                `/timecapsule/open/${openTarget._id}`
            );
            if (success) {
                toast.success('Capsule opened. Memories await.');
                setOpenTarget(null);
                setOpenHolding(false);
                setOpenProgress(0);
                fetchCapsules();
            }
        } catch {
            toast.error('Failed to open capsule');
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/30">
                <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
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
                        className="bg-primary text-primary-foreground cursor-target"
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

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <div className="flex gap-3">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                activeTab === tab
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                        >
                            {tab === 'all'
                                ? 'All'
                                : tab === 'notSealed'
                                  ? 'Not Sealed'
                                  : tab === 'sealed'
                                    ? 'Sealed'
                                    : 'Opened'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Capsules Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">
                {/* ALL TAB → grouped with headings */}
                {activeTab === 'all' && (
                    <>
                        {unsealedCapsules.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif font-bold mb-6">
                                    Waiting to be Sealed
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {unsealedCapsules.map((c) => (
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

                        {sealedCapsules.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif font-bold mb-6">
                                    Sealed & Waiting
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {sealedCapsules.map((c) => (
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

                        {openedCapsules.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif font-bold mb-6">
                                    Opened & Revealed
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {openedCapsules.map((c) => (
                                        <TimeCapsuleCard
                                            key={c._id}
                                            capsule={c}
                                            onOpen={handleView}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* OTHER TABS → single heading */}
                {activeTab !== 'all' && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold mb-6 capitalize">
                            {activeTab === 'notSealed'
                                ? 'Not Sealed Capsules'
                                : activeTab === 'sealed'
                                  ? 'Sealed Capsules'
                                  : 'Opened Capsules'}
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {getVisibleCapsules().map((c) => (
                                <TimeCapsuleCard
                                    key={c._id}
                                    capsule={c}
                                    onEdit={handleEdit}
                                    onAddMemories={handleAddMemories}
                                    onSeal={handleSeal}
                                    onOpen={
                                        c.isOpened
                                            ? handleView
                                            : canOpenCapsule(c)
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

/* ---------------- Hold Modal ---------------- */
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
                    className="relative select-none cursor-target"
                    onMouseDown={onHoldStart}
                    onMouseUp={onHoldEnd}
                    onMouseLeave={onHoldEnd}
                >
                    <div className="h-14 rounded-lg bg-muted overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{width: `${progress}%`}}
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
