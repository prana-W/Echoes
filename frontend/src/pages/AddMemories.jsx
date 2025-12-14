import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'sonner';
import {motion, AnimatePresence} from 'framer-motion';
import {Image as ImageIcon, Video, Music, Trash2} from 'lucide-react';

import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import GoBackButton from '@/components/GoBack.jsx';

const API_BASE = import.meta.env.VITE_SERVER_URL;

const LIMITS = {
    image: 5,
    video: 5,
    audio: 5,
};

export default function AddMemories() {
    const {capsuleId} = useParams();

    const navigate = useNavigate();

    const [capsule, setCapsule] = useState(null);
    const [loading, setLoading] = useState(true);

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [audios, setAudios] = useState([]);

    const [letter, setLetter] = useState('');
    const [question, setQuestion] = useState('');

    /* ---------------- Fetch capsule ---------------- */
    useEffect(() => {
        axios
            .get(`${API_BASE}/timecapsule/${capsuleId}`, {
                withCredentials: true,
            })
            .then((res) => setCapsule(res.data?.data))
            .catch(() => toast.error('Failed to load capsule'))
            .finally(() => setLoading(false));
    }, [capsuleId]);

    /* ---------------- File handling ---------------- */
    const addFiles = (fileList, setter, type) => {
        const max = LIMITS[type];
        const incoming = Array.from(fileList).filter((f) =>
            f.type.startsWith(type)
        );

        setter((prev) => {
            if (prev.length >= max) {
                toast.error(`Maximum ${max} ${type}s allowed`);
                return prev;
            }

            const spaceLeft = max - prev.length;
            const accepted = incoming.slice(0, spaceLeft);

            if (accepted.length < incoming.length) {
                toast.warning(
                    `Only ${spaceLeft} more ${type}${spaceLeft > 1 ? 's' : ''} allowed`
                );
            }

            return [...prev, ...accepted];
        });
    };

    const clearFiles = (setter) => setter([]);

    /* ---------------- Upload ---------------- */
    const handleUpload = async () => {
        try {
            if (images.length) {
                const fd = new FormData();
                images.forEach((f) => fd.append('images', f));
                await axios.post(`${API_BASE}/upload/images/${capsuleId}`, fd, {
                    withCredentials: true,
                });
            }

            if (videos.length) {
                const fd = new FormData();
                videos.forEach((f) => fd.append('videos', f));
                await axios.post(`${API_BASE}/upload/video/${capsuleId}`, fd, {
                    withCredentials: true,
                });
            }

            if (audios.length) {
                const fd = new FormData();
                audios.forEach((f) => fd.append('audios', f));
                await axios.post(`${API_BASE}/upload/audio/${capsuleId}`, fd, {
                    withCredentials: true,
                });
            }

            if (letter.trim()) {
                await axios.post(
                    `${API_BASE}/upload/texts/${capsuleId}`,
                    {text: letter},
                    {withCredentials: true}
                );
            }

            if (question.trim()) {
                await axios.post(
                    `${API_BASE}/upload/texts/${capsuleId}`,
                    {text: question, isQuestion: true},
                    {withCredentials: true}
                );
            }

            toast.success('Memories are now part of history.');
        } catch {
            toast.error('Something went wrong while preserving memories');
        } finally {
            navigate('/capsule');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Listening to time…
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background px-6 py-12">
            <GoBackButton />

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-bold">
                        {capsule?.title}
                    </h1>
                    <p className="text-muted-foreground italic mt-1">
                        This is where moments become memories.
                    </p>
                </div>

                {/* Media Vaults */}
                <div className="grid md:grid-cols-3 gap-8">
                    <Vault
                        title="Images"
                        icon={<ImageIcon />}
                        files={images}
                        limit={LIMITS.image}
                        onAdd={(f) => addFiles(f, setImages, 'image')}
                        onClear={() => setImages([])}
                        accept="image/*"
                        renderPreview={(file) => (
                            <img
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover rounded"
                            />
                        )}
                    />

                    <Vault
                        title="Videos"
                        icon={<Video />}
                        files={videos}
                        limit={LIMITS.video}
                        onAdd={(f) => addFiles(f, setVideos, 'video')}
                        onClear={() => setVideos([])}
                        accept="video/*"
                        renderPreview={(file) => (
                            <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover rounded"
                                muted
                            />
                        )}
                    />

                    <Vault
                        title="Audios"
                        icon={<Music />}
                        files={audios}
                        limit={LIMITS.audio}
                        onAdd={(f) => addFiles(f, setAudios, 'audio')}
                        onClear={() => setAudios([])}
                        accept="audio/*"
                        renderPreview={(file) => (
                            <div className="flex items-center justify-center text-xs text-muted-foreground text-center px-1">
                                🎵 {file.name.slice(0, 10)}…
                            </div>
                        )}
                    />
                </div>

                {/* Writing */}
                <Card className="p-8 space-y-6 vintage-shadow">
                    <Textarea
                        rows={6}
                        placeholder="A letter your future self will read slowly…"
                        value={letter}
                        onChange={(e) => setLetter(e.target.value)}
                        className="font-serif"
                    />

                    <Textarea
                        rows={2}
                        placeholder="One question only time can answer…"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="font-serif"
                    />
                </Card>

                {/* Action */}
                <div className="text-center">
                    <Button
                        onClick={handleUpload}
                        className="px-14 py-6 text-lg font-serif bg-primary text-primary-foreground vintage-glow"
                    >
                        Preserve These Memories
                    </Button>
                    <p className="text-xs text-muted-foreground italic mt-2">
                        Once placed, time takes over.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Vault ---------------- */

const Vault = ({
    title,
    icon,
    files,
    onAdd,
    onClear,
    accept,
    renderPreview,
    limit,
}) => {
    const inputId = `vault-${title}`;
    const isFull = files.length >= limit;

    return (
        <Card className="p-6 bg-muted/40 border-border space-y-4 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-primary">{icon}</div>
                    <h3 className="font-serif text-lg">{title}</h3>
                </div>

                <span
                    className={`text-xs font-medium ${
                        isFull ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                >
                    {files.length} / {limit}
                </span>
            </div>

            {/* Upload */}
            <input
                type="file"
                accept={accept}
                multiple
                disabled={isFull}
                id={inputId}
                className="hidden"
                onChange={(e) => {
                    onAdd(e.target.files);
                    e.target.value = '';
                }}
            />

            <label
                htmlFor={inputId}
                className={`block text-center px-4 py-2 rounded-md cursor-pointer
                    transition-all ${
                        isFull
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-accent text-accent-foreground hover:bg-accent/80'
                    }`}
            >
                {isFull ? 'Vault Full' : `Add ${title}`}
            </label>

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                    {files.slice(0, 5).map((file, i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-md overflow-hidden
                                       bg-background border border-border
                                       animate-in zoom-in fade-in"
                        >
                            {renderPreview(file)}
                        </div>
                    ))}
                </div>
            )}

            {/* Clear */}
            {files.length > 0 && (
                <button
                    onClick={onClear}
                    className="text-xs text-destructive hover:underline mt-1"
                >
                    Remove all
                </button>
            )}
        </Card>
    );
};
