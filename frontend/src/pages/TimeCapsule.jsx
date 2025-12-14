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

    // Categorized capsules
    const [openedCapsules, setOpenedCapsules] = useState([]);
    const [sealedCapsules, setSealedCapsules] = useState([]);
    const [unsealedCapsules, setUnsealedCapsules] = useState([]);

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
            if (capsule.isOpened) {
                opened.push(capsule);
            } else if (capsule.isSealed) {
                sealed.push(capsule);
            } else {
                unsealed.push(capsule);
            }
        });

        setOpenedCapsules(opened);
        setSealedCapsules(sealed);
        setUnsealedCapsules(unsealed);
    };

    const handleEdit = (capsule) => {
        // Navigate to edit page or open edit modal
        window.location.href = `/capsule/assemble/?new=false&capsuleId=${capsule._id}`;
    };

    const handleAddMemories = (capsule) => {
        // Navigate to add memories page
        window.location.href = `/capsule/${capsule._id}/memories`;
    };

    const handleSeal = async (capsule) => {
        // Implement seal functionality

        try {
            await api.put(`/timecapsule/${capsule?._id}`, {isSealed: true});
            toast.success('Capsule sealed successfully!');
        }
    catch (err) {

            toast.error(err?.message || "There was an error was sealing the capsule!")

    }


        fetchCapsules(); // Refresh
    };

    const handleOpen = (capsule) => {
        // Navigate to view capsule page
        window.location.href = `/capsule/${capsule._id}`;
    };

    const EmptyState = ({ icon: Icon, title, description }) => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
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
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Clock className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading your time capsules...</p>
                        </div>
                    </div>
                ) : capsules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 vintage-glow">
                            <Package className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                            No Time Capsules Yet
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-md text-center">
                            Start preserving your memories by creating your first time capsule.
                            Fill it with photos, videos, messages, and questions for your future self.
                        </p>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => window.location.href = '/capsule/create'}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Capsule
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Unsealed Capsules Section */}
                        {unsealedCapsules.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-foreground">
                                            In Progress
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {unsealedCapsules.length} capsule{unsealedCapsules.length !== 1 ? 's' : ''} waiting to be sealed
                                        </p>
                                    </div>
                                </div>
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

                        {/* Sealed Capsules Section */}
                        {sealedCapsules.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-secondary/20">
                                        <Lock className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-foreground">
                                            Sealed & Waiting
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {sealedCapsules.length} capsule{sealedCapsules.length !== 1 ? 's' : ''} locked until their time comes
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sealedCapsules.map(capsule => (
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

                        {/* Opened Capsules Section */}
                        {openedCapsules.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/20 vintage-glow">
                                        <Sparkles className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-foreground">
                                            Opened & Revealed
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {openedCapsules.length} capsule{openedCapsules.length !== 1 ? 's' : ''} unlocked and ready to revisit
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {openedCapsules.map(capsule => (
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
                    </div>
                )}
            </div>

            {/* Decorative Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/3 rounded-full blur-3xl" />
            </div>
        </div>
    );
}