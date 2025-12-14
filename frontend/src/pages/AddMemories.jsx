import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'sonner';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';

const MAX_IMAGES = 10;
const MAX_VIDEOS = 5;
const MAX_AUDIOS = 5;

const API_BASE = import.meta.env.VITE_SERVER_URL;

const AddMemories = () => {
    const {capsuleId} = useParams();

    const [capsule, setCapsule] = useState(null);
    const [loading, setLoading] = useState(true);

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [audios, setAudios] = useState([]);

    const [letter, setLetter] = useState('');
    const [question, setQuestion] = useState('');

    /* ---------------- Fetch Capsule ---------------- */
    useEffect(() => {
        const fetchCapsule = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE}/timecapsule/${capsuleId}`,
                    {withCredentials: true}
                );

                setCapsule(res.data?.data);
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCapsule();
    }, [capsuleId]);

    /* ---------------- File Handlers ---------------- */
    const handleFiles = (files, setter, max, type) => {
        const valid = Array.from(files).filter((file) =>
            file.type.startsWith(type)
        );

        setter((prev) => {
            if (prev.length + valid.length > max) {
                toast.error(`Maximum ${max} ${type} files allowed`);
                return prev;
            }
            return [...prev, ...valid];
        });
    };

    /* ---------------- Upload Memories ---------------- */
    const handleUpload = async () => {
        toast.success('Uploading memories… Please stay with us.');

        try {
            if (images.length) {
                const fd = new FormData();
                images.forEach((img) => fd.append('images', img));

                await axios.post(`${API_BASE}/upload/images/${capsuleId}`, fd, {
                    withCredentials: true,
                });
            }

            if (videos.length) {
                const fd = new FormData();
                videos.forEach((vid) => fd.append('videos', vid));

                await axios.post(`${API_BASE}/upload/video/${capsuleId}`, fd, {
                    withCredentials: true,
                });
            }

            if (audios.length) {
                const fd = new FormData();
                audios.forEach((aud) => fd.append('audios', aud));

                await axios.post(`${API_BASE}/upload/audio/${capsuleId}`, fd, {
                    withCredentials: true,
                });
            }

            if (letter.trim()) {
                await axios.post(
                    `${API_BASE}/upload/texts/${capsuleId}`,
                    {text: letter},
                    {
                        withCredentials: true,
                        headers: {'Content-Type': 'application/json'},
                    }
                );
            }

            if (question.trim()) {
                await axios.post(
                    `${API_BASE}/upload/texts/${capsuleId}`,
                    {
                        text: question,
                        isQuestion: true,
                    },
                    {
                        withCredentials: true,
                        headers: {'Content-Type': 'application/json'},
                    }
                );
            }

            toast.success('Memories safely placed into the capsule.');
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Retrieving memories…
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-background px-6 py-12">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-serif font-bold">
                        {capsule?.title}
                    </h1>
                    <p className="text-muted-foreground italic">
                        Place memories gently. Time is listening.
                    </p>
                </div>

                <Card className="p-10 bg-card vintage-shadow space-y-10">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Vault
                            title="Images"
                            count={images.length}
                            max={MAX_IMAGES}
                            accept="image/*"
                            onChange={(e) =>
                                handleFiles(
                                    e.target.files,
                                    setImages,
                                    MAX_IMAGES,
                                    'image'
                                )
                            }
                        />
                        <Vault
                            title="Videos"
                            count={videos.length}
                            max={MAX_VIDEOS}
                            accept="video/*"
                            onChange={(e) =>
                                handleFiles(
                                    e.target.files,
                                    setVideos,
                                    MAX_VIDEOS,
                                    'video'
                                )
                            }
                        />
                        <Vault
                            title="Audios"
                            count={audios.length}
                            max={MAX_AUDIOS}
                            accept="audio/*"
                            onChange={(e) =>
                                handleFiles(
                                    e.target.files,
                                    setAudios,
                                    MAX_AUDIOS,
                                    'audio'
                                )
                            }
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-serif text-lg">
                            A Letter to the Future
                        </h3>
                        <Textarea
                            rows={7}
                            value={letter}
                            onChange={(e) => setLetter(e.target.value)}
                            placeholder="Write slowly. Ink remembers everything…"
                            className="font-serif leading-relaxed bg-accent/40 border-border"
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-serif text-lg">
                            One Question for Your Future Self
                        </h3>
                        <Textarea
                            rows={2}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Did things turn out the way you hoped?"
                            className="font-serif bg-accent/40 border-border"
                        />
                    </div>
                </Card>

                <div className="text-center">
                    <Button
                        onClick={handleUpload}
                        className="px-12 py-6 text-lg font-serif bg-primary text-primary-foreground hover:vintage-glow transition-all duration-500"
                    >
                        Add Memories to Capsule
                    </Button>

                    <p className="mt-3 text-xs text-muted-foreground italic">
                        Once placed, memories begin their journey through time.
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ---------------- Vault Component ---------------- */
const Vault = ({title, count, max, accept, onChange}) => {
    return (
        <Card className="p-6 bg-muted/40 border-border text-center space-y-3">
            <h3 className="font-serif text-lg">{title} Vault</h3>
            <p className="text-sm text-muted-foreground">
                {count} / {max} stored
            </p>
            <input
                type="file"
                accept={accept}
                multiple
                onChange={onChange}
                className="hidden"
                id={title}
            />
            <label
                htmlFor={title}
                className="inline-block mt-2 px-5 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80"
            >
                Place {title}
            </label>
        </Card>
    );
};

export default AddMemories;
