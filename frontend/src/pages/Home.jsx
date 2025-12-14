import React, { useState, useEffect } from 'react';
import {
    Clock,
    Lock,
    Users,
    Share2,
    Mail,
    Calendar,
    Sparkles,
    ArrowRight,
    Image,
    Video,
    Mic,
    FileText,
    TrendingUp,
    Package,
    Eye,
    UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/hooks/index.js';
import { toast } from 'sonner';

export default function HomePage() {
    const api = useApi();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data, success } = await api.get('/analytics');
            if (success) {
                setAnalytics(data);
            }
        } catch (err) {
            toast.error(err?.message || "Failed to load analytics")
        } finally {
            setLoading(false);
        }
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Logo/Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="p-6 rounded-full bg-primary/10 vintage-glow inline-block">
                                <Clock className="w-16 h-16 text-primary" />
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-foreground mb-6 tracking-tight">
                            Echoes of the Past
                        </h1>

                        <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Capture today's memories. Preserve them for tomorrow.
                            <br />
                            <span className="text-primary">Talk to your future self.</span>
                        </p>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                            Create time capsules filled with your memories, questions, and dreams.
                            Open them when the moment is right—whether it's a date in the future or a milestone in your life.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 vintage-glow"
                                onClick={() => window.location.href = '/create'}
                            >
                                Create Your Time Capsule
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-border hover:bg-muted text-lg px-8 py-6"
                                onClick={() => scrollToSection('about')}
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics Section */}
            {!loading && analytics && (
                <section className="py-16 bg-card/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                                Our Community's Journey
                            </h2>
                            <p className="text-muted-foreground">
                                Together, we're preserving memories across time
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Users */}
                            <Card className="border-border vintage-shadow hover:vintage-glow transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <UserCheck className="w-8 h-8 text-primary" />
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-foreground">
                                                {analytics.totalUsers}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">+12% this month</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground">Total Users</div>
                                    <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-3/4"></div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Capsules Created */}
                            <Card className="border-border vintage-shadow hover:vintage-glow transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Package className="w-8 h-8 text-secondary" />
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-foreground">
                                                {analytics.totalCapsulesCreated}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">+8% this month</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground">Capsules Created</div>
                                    <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-1/2"></div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Capsules Opened */}
                            <Card className="border-border vintage-shadow hover:vintage-glow transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Sparkles className="w-8 h-8 text-primary" />
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-foreground">
                                                {analytics.totalCapsulesOpened}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">Magical moments</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground">Capsules Opened</div>
                                    <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-1/4"></div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Total Visitors */}
                            <Card className="border-border vintage-shadow hover:vintage-glow transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Eye className="w-8 h-8 text-secondary" />
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-foreground">
                                                {analytics.totalVisitors}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">+20% this month</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground">Total Visitors</div>
                                    <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-full"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Create, preserve, and unlock your memories when the time is right
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Card className="border-border vintage-shadow hover:border-primary/50 transition-all">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <FileText className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    Rich Memories
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Add photos, videos, audio recordings, and text. Ask your future self questions.
                                    Capture every detail that matters.
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <Image className="w-5 h-5 text-muted-foreground" />
                                    <Video className="w-5 h-5 text-muted-foreground" />
                                    <Mic className="w-5 h-5 text-muted-foreground" />
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="border-border vintage-shadow hover:border-primary/50 transition-all">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                                    <Users className="w-7 h-7 text-secondary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    Collaborate & Share
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Invite family and friends to contribute. Share memories together and create
                                    collective time capsules that everyone can cherish.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="border-border vintage-shadow hover:border-primary/50 transition-all">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <Calendar className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    Time or Event Based
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Set a future date or choose a life milestone. Your capsule opens exactly when
                                    you want it to—automatically.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 4 */}
                        <Card className="border-border vintage-shadow hover:border-primary/50 transition-all">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                                    <Mail className="w-7 h-7 text-secondary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    Email Reminders
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Never miss the moment. Receive automatic email notifications when your
                                    time capsule is ready to be opened.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 5 */}
                        <Card className="border-border vintage-shadow hover:border-primary/50 transition-all">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <Lock className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    Fully Secure
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Your privacy is our priority. Bank-level encryption ensures your memories
                                    are safe and secure until you're ready.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 6 */}
                        <Card className="border-border vintage-shadow hover:border-primary/50 transition-all">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                                    <Share2 className="w-7 h-7 text-secondary" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    Easy Sharing
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Share your time capsules with anyone. Create public or private capsules.
                                    Control who sees what, always.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-6 bg-card/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold text-foreground mb-6">
                        About Echoes
                    </h2>
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            <span className="text-primary font-medium">Echoes of the Past</span> is more than just
                            a time capsule app—it's a bridge between your present and future self. We believe that
                            memories are precious, and the conversations we have with our future selves are invaluable.
                        </p>
                        <p>
                            Whether you're capturing a moment of joy, documenting a milestone, or asking questions
                            you'll only understand years from now, Echoes provides a secure, beautiful space to
                            preserve what matters most.
                        </p>
                        <p>
                            Our platform combines cutting-edge technology with a deep respect for privacy. Every
                            memory you store is encrypted, every moment you capture is protected, and every question
                            you ask is kept safe until the perfect moment arrives.
                        </p>
                        <p className="text-foreground font-medium pt-4">
                            Remember the past. Talk to the future. Live in the present.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-2xl border border-border vintage-shadow bg-card/50">
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                            Start Your Journey Today
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Create your first time capsule and begin preserving memories for tomorrow
                        </p>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 vintage-glow"
                            onClick={() => window.location.href = '/create'}
                        >
                            Create Your Time Capsule Now
                            <Clock className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-6">
                <div className="max-w-7xl mx-auto text-center text-muted-foreground">
                    <p className="mb-2">© 2024 Echoes of the Past. All memories preserved with care.</p>
                    <p className="text-sm">Made to remember the past and talk to the future.</p>
                </div>
            </footer>
        </div>
    );
}