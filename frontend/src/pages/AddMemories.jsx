import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon,
    Video,
    Music,
    Trash2,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import GoBackButton from '@/components/GoBack.jsx';

const API_BASE = import.meta.env.VITE_SERVER_URL;

const MAX = {
    image: 10,
    video: 5,
    audio: 5,
};

export default function AddMemories() {
    const { capsuleId } = useParams();

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
    const addFiles = (files, setter, type) => {
        const valid = Array.from(files).filter((f) =>
            f.type.startsWith(type)
        );

        setter((prev) => {
            if (prev.length + valid.length > MAX[type]) {
                toast.error(`Max ${MAX[type]} ${type}s allowed`);
                return prev;
            }
            return [...prev, ...valid];
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
                    { text: letter },
                    { withCredentials: true }
                );
            }

            if (question.trim()) {
                await axios.post(
                    `${API_BASE}/upload/texts/${capsuleId}`,
                    { text: question, isQuestion: true },
                    { withCredentials: true }
                );
            }

            toast.success('Memories are now part of history.');

        } catch {
            toast.error('Something went wrong while preserving memories');
        }
        finally {

            navigate('/capsule')

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
                        onAdd={(f) => addFiles(f, setImages, 'image')}
                        onClear={() => clearFiles(setImages)}
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
                        onAdd={(f) => addFiles(f, setVideos, 'video')}
                        onClear={() => clearFiles(setVideos)}
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
                        onAdd={(f) => addFiles(f, setAudios, 'audio')}
                        onClear={() => clearFiles(setAudios)}
                        accept="audio/*"
                        renderPreview={(file) => (
                            <div className="flex items-center justify-center text-xs text-muted-foreground">
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

function Vault({
                   title,
                   icon,
                   files,
                   onAdd,
                   onClear,
                   accept,
                   renderPreview,
               }) {
    return (
        <Card className="p-6 bg-card vintage-shadow space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg flex items-center gap-2">
                    {icon} {title}
                </h3>

                {files.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-xs flex items-center gap-1 text-destructive hover:underline"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* Upload */}
            <input
                type="file"
                multiple
                accept={accept}
                id={title}
                className="hidden"
                onChange={(e) => onAdd(e.target.files)}
            />

            <label
                htmlFor={title}
                className="block cursor-pointer text-center py-3 rounded-md bg-accent hover:bg-accent/80 transition"
            >
                Add {title}
            </label>

            {/* Previews */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-5 gap-2"
                    >
                        {files.map((file, i) => (
                            <motion.div
                                key={i}
                                layout
                                className="aspect-square bg-muted rounded overflow-hidden"
                            >
                                {renderPreview(file)}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
