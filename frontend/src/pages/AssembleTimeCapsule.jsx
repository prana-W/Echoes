import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const AssembleCapsule = () => {
    const api = useApi();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isNew = searchParams.get("new") === "true";
    const timecapsuleId = searchParams.get("capsuleId");

    const [loading, setLoading] = useState(false);

    /* Core fields */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [theme, setTheme] = useState("vintage");
    const [isEventRelated, setIsEventRelated] = useState(false);
    const [event, setEvent] = useState("");
    const [openAt, setOpenAt] = useState("");
    const [allowContributorsToOpen, setAllowContributorsToOpen] =
        useState(false);

    /* Mode label */
    const modeLabel = isNew ? "Assemble a New Capsule" : "Refine Your Capsule";

    /* ----------------------------------
       Fetch capsule if EDIT mode
    -----------------------------------*/
    useEffect(() => {
        if (isNew || !timecapsuleId) return;

        const fetchCapsule = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(
                    `/timecapsule/${timecapsuleId}`
                );

                setTitle(data.title || "");
                setDescription(data.description || "");
                setTheme(data.theme || "vintage");
                setIsEventRelated(data.isEventRelated);
                setEvent(data.event || "");
                setOpenAt(data.openAt?.slice(0, 16) || "");
                setAllowContributorsToOpen(
                    data.allowContributorsToOpen || false
                );
            } catch (err) {
                toast.error(err?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCapsule();
    }, [isNew, timecapsuleId]);

    /* ----------------------------------
       CREATE / UPDATE
    -----------------------------------*/
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
        };

        try {
            if (isNew) {
                const { success, message, data } = await api.post(
                    "/timecapsule",
                    payload
                );

                if (success) {
                    toast.success(message);
                    navigate(`/capsule/${data._id}`);
                }
            } else {
                const { success, message } = await api.put(
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

    /* ----------------------------------
       UI
    -----------------------------------*/
    return (
        <div className="min-h-screen bg-background px-6 py-12">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-foreground">
                        {modeLabel}
                    </h1>
                    <p className="text-muted-foreground italic">
                        Memories deserve time, care, and silence.
                    </p>
                </div>

                {/* Capsule Core */}
                <Card className="bg-card border-border p-8 vintage-shadow space-y-8">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                            Capsule Title
                        </label>
                        <Input
                            placeholder="A letter to my future self…"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-serif"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                            The Memory Inside
                        </label>
                        <Textarea
                            rows={6}
                            placeholder="Write as if time itself is listening…"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="font-serif leading-relaxed"
                        />
                    </div>

                    {/* Time Logic */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-5 bg-muted/40">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">
                                    Tie to a life event
                                </span>
                                <Switch
                                    checked={isEventRelated}
                                    onCheckedChange={setIsEventRelated}
                                />
                            </div>

                            {isEventRelated ? (
                                <Input
                                    className="mt-4"
                                    placeholder="Graduation, Marriage, 30th Birthday…"
                                    value={event}
                                    onChange={(e) =>
                                        setEvent(e.target.value)
                                    }
                                />
                            ) : (
                                <Input
                                    className="mt-4"
                                    type="datetime-local"
                                    value={openAt}
                                    onChange={(e) =>
                                        setOpenAt(e.target.value)
                                    }
                                />
                            )}
                        </Card>

                        <Card className="p-5 bg-muted/40">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">
                                    Contributors can open
                                </span>
                                <Switch
                                    checked={allowContributorsToOpen}
                                    onCheckedChange={
                                        setAllowContributorsToOpen
                                    }
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Trust shared memories with others.
                            </p>
                        </Card>
                    </div>
                </Card>

                {/* Seal Button */}
                <div className="text-center pt-6">
                    <Button
                        disabled={loading}
                        onClick={handleSave}
                        className="
                            px-12 py-6 text-lg font-serif
                            bg-primary text-primary-foreground
                            hover:vintage-glow
                            transition-all duration-500
                        "
                    >
                        {isNew ? "Seal This Capsule" : "Save Changes"}
                    </Button>

                    <p className="mt-3 text-xs text-muted-foreground italic">
                        Once sealed, some memories can never be changed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AssembleCapsule;
