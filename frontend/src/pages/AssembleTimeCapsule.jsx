import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {useApi} from '@/hooks';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch';

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

    const [loading, setLoading] = useState(false);

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
        const fetchRelations = async () => {
            try {
                const {data} = await api.get('/relations');
                setRelations(data || []);
            } catch (err) {
                toast.error(err?.message);
            }
        };
        fetchRelations();
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

    /* ---------------- Toggle helpers ---------------- */
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
                const {success, message, data} = await api.post(
                    '/timecapsule',
                    payload
                );
                if (success) {
                    toast.success(message);
                    navigate(`/capsule/${data._id}`);
                }
            } else {
                const {success, message} = await api.put(
                    `/timecapsule/${timecapsuleId}`,
                    payload
                );
                if (success) toast.success(message);
            }
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-background px-6 py-12">
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

                {/* Core */}
                <Card className="p-8 vintage-shadow space-y-8">
                    <Input
                        placeholder="A letter to my future self…"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-serif"
                    />

                    <Textarea
                        rows={6}
                        placeholder="Write as if time itself is listening…"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="font-serif"
                    />

                    {/* Event / Date */}
                    <Card className="p-5 bg-muted/40">
                        <div className="flex justify-between items-center">
                            <span>Tie to a life event</span>
                            <Switch
                                checked={isEventRelated}
                                onCheckedChange={setIsEventRelated}
                            />
                        </div>

                        {isEventRelated ? (
                            <select
                                className="mt-4 w-full bg-background border border-border p-2 rounded-md"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                            >
                                <option value="">Select an event</option>
                                {eventList.map((ev) => (
                                    <option key={ev} value={ev}>
                                        {ev}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                type="datetime-local"
                                className="mt-4"
                                value={openAt}
                                onChange={(e) => setOpenAt(e.target.value)}
                            />
                        )}
                    </Card>

                    {/* Contributors */}
                    <Card className="p-5 bg-muted/40 space-y-3">
                        <h3 className="font-serif">Contributors</h3>
                        {relations.map((rel) => (
                            <label
                                key={rel._id}
                                className="flex items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={contributors.includes(rel.to._id)}
                                    onChange={() =>
                                        toggleSelection(
                                            rel.to._id,
                                            setContributors
                                        )
                                    }
                                />
                                {rel.to.name}
                            </label>
                        ))}
                    </Card>

                    {/* Recipients */}
                    <Card className="p-5 bg-muted/40 space-y-3">
                        <h3 className="font-serif">Recipients</h3>
                        {relations.map((rel) => (
                            <label
                                key={rel._id}
                                className="flex items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={recipients.includes(rel.to._id)}
                                    onChange={() =>
                                        toggleSelection(
                                            rel.to._id,
                                            setRecipients
                                        )
                                    }
                                />
                                {rel.to.name}
                            </label>
                        ))}
                    </Card>
                </Card>

                {/* Action */}
                <div className="text-center">
                    <Button
                        disabled={loading}
                        onClick={handleSave}
                        className="px-12 py-6 text-lg font-serif bg-primary vintage-glow"
                    >
                        {isNew ? 'Assemble This Capsule' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AssembleCapsule;
