import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {useApi} from '@/hooks';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch';
import { RefreshCcw } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {Info} from 'lucide-react';
import GoBackButton from '@/components/GoBack.jsx';

const eventList = [
    'birthday',
    'wedding',
    'anniversary',
    'graduation',
    'retirement',
    'engagement',
    'childbirth',
    'firstJob',
    'promotion',
    'housePurchase',
    'startupLaunch',
    'memorial',
    'other',
];

const AssembleCapsule = () => {
    const api = useApi();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isNew = searchParams.get('new') === 'true';
    const timecapsuleId = searchParams.get('capsuleId');

    const [showRefresh, setShowRefresh] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showCreatedDialog, setShowCreatedDialog] = useState(false);

    /* Core fields */
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [theme, setTheme] = useState('vintage');
    const [isEventRelated, setIsEventRelated] = useState(false);
    const [event, setEvent] = useState('');
    const [openAt, setOpenAt] = useState('');
    const [allowContributorsToOpen, setAllowContributorsToOpen] =
        useState(false);

    /* Relations */
    const [relations, setRelations] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [recipients, setRecipients] = useState([]);

    const modeLabel = isNew ? 'Assemble a New Capsule' : 'Refine Your Capsule';

    /* ---------------- Fetch relations ---------------- */
    useEffect(() => {
        api.get('/relations')
            .then(({data}) => setRelations(data || []))
            .catch((err) => toast.error(err?.message));
    }, []);

    /* ---------------- Fetch capsule (edit mode) ---------------- */
    useEffect(() => {
        if (isNew || !timecapsuleId) return;

        const fetchCapsule = async () => {
            setLoading(true);
            try {
                const {data} = await api.get(`/timecapsule/${timecapsuleId}`);
                setTitle(data.title || '');
                setDescription(data.description || '');
                setTheme(data.theme || 'vintage');
                setIsEventRelated(data.isEventRelated);
                setEvent(data.event || '');
                setOpenAt(data.openAt?.slice(0, 16) || '');
                setAllowContributorsToOpen(
                    data.allowContributorsToOpen || false
                );
                setContributors(data.contributors || []);
                setRecipients(data.recipients || []);
            } catch (err) {
                toast.error(err?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCapsule();
    }, [isNew, timecapsuleId]);

    const toggleSelection = (id, setter) => {
        setter((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    /* ---------------- Save ---------------- */
    const handleSave = async () => {
        setLoading(true);

        const payload = {
            title,
            description,
            theme,
            isEventRelated,
            event: isEventRelated ? event : undefined,
            openAt: !isEventRelated ? openAt : undefined,
            allowContributorsToOpen,
            contributors,
            recipients,
        };

        try {
            if (isNew) {
                const {success} = await api.post('/timecapsule', payload);
                if (success) setShowCreatedDialog(true);
            } else {
                const {success} = await api.put(
                    `/timecapsule/${timecapsuleId}`,
                    payload
                );
                if (success) {
                    toast.success('Capsule updated');
                    navigate('/capsule');
                }
            }
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Delete ---------------- */
    const handleDelete = async () => {
        try {
            await api.delete(`/timecapsule/${timecapsuleId}`);
            toast.success('Capsule deleted');
            navigate('/capsule');
        } catch (err) {
            toast.error(err?.message);
        }
    };

    return (
        <div className="min-h-screen bg-background px-6 py-12">
            <GoBackButton />
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-serif font-bold">
                        {modeLabel}
                    </h1>
                    <p className="text-muted-foreground italic">
                        Memories deserve time, care, and silence.
                    </p>
                </div>

                <Card className="p-8 vintage-shadow space-y-8">
                    <Input
                        placeholder="A letter to my future self…"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-serif"
                    />

                    <Textarea
                        rows={6}
                        placeholder="Describe this capsule..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="font-serif"
                    />

                    {/* Event / Date */}
                    <Card className="p-5 bg-muted/40 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">
                                Tie to a life event
                            </span>
                            <Switch
                                checked={isEventRelated}
                                onCheckedChange={setIsEventRelated}
                            />
                        </div>

                        {isEventRelated ? (
                            <select
                                className="w-full bg-background border border-border px-3 py-2 rounded-lg"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                            >
                                <option value="">Select an event</option>
                                {eventList.map((ev) => (
                                    <option key={ev} value={ev}>
                                        {ev.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                type="datetime-local"
                                className="bg-background border-border focus:ring-2 focus:ring-primary"
                                value={openAt}
                                onChange={(e) => setOpenAt(e.target.value)}
                            />
                        )}
                    </Card>

                    <Card className="p-5 bg-muted/40 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif">Contributors</h3>

                            <button
                                onClick={() => {
                                    window.open('/relations', '_blank');
                                    setShowRefresh(true);
                                }}
                                className="text-xs text-primary hover:underline"
                            >
                                Add New People
                            </button>
                        </div>

                        {/* Info line */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Info className="w-4 h-4" />
                            <span>
            Contributors can add memories and open the capsule once the time arrives.
        </span>
                        </div>

                        {relations.map((rel) => (
                            <label
                                key={rel._id}
                                className="flex items-center gap-3 text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-primary scale-110"
                                    checked={contributors.includes(rel.to._id)}
                                    onChange={() =>
                                        toggleSelection(rel.to._id, setContributors)
                                    }
                                />
                                {rel.to.name}
                            </label>
                        ))}
                    </Card>


                    <Card className="p-5 bg-muted/40 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif">Recipients</h3>

                            <button
                                onClick={() => {
                                    window.open('/relations', '_blank');
                                    setShowRefresh(true);
                                }}
                                className="text-xs text-primary hover:underline"
                            >
                                Add New People
                            </button>
                        </div>

                        {/* Info line */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Info className="w-4 h-4" />
                            <span>
            Recipients can only read memories once the capsule is opened.
        </span>
                        </div>

                        {relations.map((rel) => (
                            <label
                                key={rel._id}
                                className="flex items-center gap-3 text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-secondary scale-110"
                                    checked={recipients.includes(rel.to._id)}
                                    onChange={() =>
                                        toggleSelection(rel.to._id, setRecipients)
                                    }
                                />
                                {rel.to.name}
                            </label>
                        ))}
                    </Card>


                </Card>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    {!isNew && (
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Capsule
                        </Button>
                    )}

                    <Button
                        disabled={loading}
                        onClick={handleSave}
                        className="px-12 py-6 text-lg font-serif bg-primary vintage-glow cursor-target"
                    >
                        {isNew ? 'Assemble This Capsule' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Created Dialog */}
            <Dialog open={showCreatedDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Your capsule has been assembled ✨
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-muted-foreground">
                        Don’t forget to add memories to it before sealing.
                    </p>

                    <DialogFooter>
                        <Button onClick={() => navigate('/capsule')}>
                            I understand
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {showRefresh && (
                <button
                    onClick={() => window.location.reload()}
                    title="Refresh people list"
                    className="fixed bottom-6 right-6 z-50
                   h-12 w-12 rounded-full
                   bg-destructive/10 border border-destructive/30
                   flex items-center justify-center
                   hover:bg-destructive hover:text-white
                   transition-all duration-200 shadow-lg"
                >
                    <RefreshCcw className="w-5 h-5 text-destructive" />
                </button>
            )}


        </div>
    );
};

export default AssembleCapsule;
