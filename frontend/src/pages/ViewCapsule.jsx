import React, { useState, useEffect } from 'react';
import {
    Clock,
    Users,
    User,
    Download,
    Maximize2,
    X,
    Send,
    Sparkles,
    Image,
    Video,
    Mic,
    FileText,
    MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useApi } from '@/hooks/index.js';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

export default function ViewCapsulePage() {
    const { capsuleId } = useParams();
    const api = useApi();

    const [capsuleData, setCapsuleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [answers, setAnswers] = useState({});
    const [sendingAnswer, setSendingAnswer] = useState(false);

    useEffect(() => {
        fetchCapsule();
    }, [capsuleId]);

    const fetchCapsule = async () => {
        setLoading(true);
        try {
            const { data, success } = await api.get(`/timecapsule/view/${capsuleId}`);
            if (success && data) {
                setCapsuleData(data);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to load time capsule');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success('Download started!');
        } catch (err) {
            toast.error('Failed to download file');
        }
    };

    const handleSendAnswer = async (questionId) => {
        const answer = answers[questionId];
        if (!answer || !answer.trim()) {
            toast.error('Please write an answer first');
            return;
        }

        setSendingAnswer(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Message finally delivered to the past! ✨', {
                duration: 4000,
            });
            setAnswers({ ...answers, [questionId]: '' });
        } catch (err) {
            toast.error('Failed to send answer');
        } finally {
            setSendingAnswer(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Clock className="w-16 h-16 text-primary animate-pulse mx-auto mb-4 vintage-glow" />
                    <p className="text-muted-foreground text-lg">Opening your time capsule...</p>
                </div>
            </div>
        );
    }

    if (!capsuleData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <X className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <p className="text-foreground text-lg">Time capsule not found</p>
                </div>
            </div>
        );
    }

    const { metadata, contents } = capsuleData;
    const timeElapsed = metadata.timeElapsedMs;
    const daysElapsed = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    const hoursElapsed = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - Metadata */}
            <section className="relative overflow-hidden border-b border-border">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="p-4 rounded-full bg-primary/10 vintage-glow">
                                <Sparkles className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-foreground mb-4">
                            {metadata.title}
                        </h1>
                        {metadata.description && (
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {metadata.description}
                            </p>
                        )}
                    </div>

                    {/* Metadata Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card className="border-border vintage-shadow">
                            <CardContent className="p-6 text-center">
                                <User className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Created by</h3>
                                <p className="text-lg font-semibold text-foreground">{metadata.owner.name}</p>
                                <p className="text-xs text-muted-foreground">{metadata.owner.email}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-border vintage-shadow">
                            <CardContent className="p-6 text-center">
                                <Clock className="w-8 h-8 text-secondary mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Time Elapsed</h3>
                                <p className="text-lg font-semibold text-foreground">
                                    {daysElapsed} days, {hoursElapsed} hours
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Opened on {new Date(metadata.openedAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border vintage-shadow">
                            <CardContent className="p-6 text-center">
                                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contributors</h3>
                                <p className="text-lg font-semibold text-foreground">
                                    {metadata.totalContributors}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {metadata.totalRecipients} recipient{metadata.totalRecipients !== 1 ? 's' : ''}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-8">
                        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-primary font-medium">Theme: {metadata.theme}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Images Section */}
            {contents.images && contents.images.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Image className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-foreground">
                                Captured Moments
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contents.images.map((image, index) => (
                                <Card key={index} className="border-border overflow-hidden group">
                                    <div className="relative aspect-square">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_SERVER_URL}${image.content}`}
                                            alt={image.caption || `Memory ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setFullscreenImage(image)}
                                            >
                                                <Maximize2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleDownload(image.url, `memory-${index + 1}.jpg`)}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {image.caption && (
                                        <CardContent className="p-4">
                                            <p className="text-sm text-muted-foreground">{image.caption}</p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Videos Section */}
            {contents.videos && contents.videos.length > 0 && (
                <section className="py-16 px-6 bg-card/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-lg bg-secondary/10">
                                <Video className="w-6 h-6 text-secondary" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-foreground">
                                Moving Memories
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contents.videos.map((video, index) => (
                                <Card key={index} className="border-border overflow-hidden">
                                    <video
                                        controls
                                        className="w-full aspect-video bg-black"
                                        src={`${import.meta.env.VITE_BASE_SERVER_URL}${video.content}`}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    {video.caption && (
                                        <CardContent className="p-4">
                                            <p className="text-sm text-muted-foreground">{video.caption}</p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Audio Section */}
            {contents.audios && contents.audios.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Mic className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-foreground">
                                Echoes of Voices
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contents.audios.map((audio, index) => (
                                <Card key={index} className="border-border">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 rounded-full bg-primary/10">
                                                <Mic className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">
                                                    Audio Recording {index + 1}
                                                </p>
                                                {audio.caption && (
                                                    <p className="text-sm text-muted-foreground">{audio.caption}</p>
                                                )}
                                            </div>
                                        </div>
                                        <audio controls className="w-full">
                                            <source src={`${import.meta.env.VITE_BASE_SERVER_URL}${audio.content}`} />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Text Messages Section */}
            {contents.texts && contents.texts.length > 0 && (
                <section className="py-16 px-6 bg-card/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-lg bg-secondary/10">
                                <FileText className="w-6 h-6 text-secondary" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-foreground">
                                Written Memories
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {contents.texts.map((text, index) => (
                                <Card key={index} className="border-border vintage-shadow">
                                    <CardContent className="p-8">
                                        <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap font-serif">
                                            {text.content}
                                        </p>
                                        {text.author && (
                                            <p className="text-sm text-muted-foreground mt-4 italic">
                                                — {text.author}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Questions Section - Only for Owner */}
            {metadata.isOwner && contents.questions && contents.questions.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center mb-4">
                                <div className="p-4 rounded-full bg-primary/10 vintage-glow">
                                    <MessageCircle className="w-10 h-10 text-primary" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-foreground mb-3">
                                A Question from the Past
                            </h2>
                            <p className="text-muted-foreground">
                                Your past self wants to know...
                            </p>
                        </div>

                        <div className="space-y-8">
                            {contents.questions.map((question, index) => (
                                <Card key={index} className="border-2 border-primary/30 vintage-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-serif text-foreground">
                                            {question.text}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            placeholder="Share your answer with your past self..."
                                            className="min-h-32 bg-muted/50 border-border resize-none mb-4 font-serif"
                                            value={answers[question.id] || ''}
                                            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                        />
                                        <Button
                                            onClick={() => handleSendAnswer(question.id)}
                                            disabled={sendingAnswer}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 vintage-glow"
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            {sendingAnswer ? 'Sending to the past...' : 'Send to the Past'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Final Message */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-8 rounded-2xl border border-border vintage-shadow bg-card/50">
                        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 vintage-glow" />
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                            End of Journey
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Thank you for revisiting these precious moments. Your memories are forever preserved,
                            echoing through time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Fullscreen Image Modal */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setFullscreenImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                        src={fullscreenImage.url}
                        alt={fullscreenImage.caption || 'Fullscreen'}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-4 right-4">
                        <Button
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(fullscreenImage.url, 'memory.jpg');
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            )}

            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/3 rounded-full blur-3xl" />
            </div>
        </div>
    );
}