import React, {useState, useEffect} from 'react';
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
    UserCheck,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useApi} from '@/hooks/index.js';
import Logo from '@/components/EchoesLogo.jsx';
import OnlinePeopleWidget from '@/components/OnlinePeopleWidget.jsx';
import EchoesHero from '@/components/EchoesHero.jsx'

export default function HomePage() {
    const api = useApi();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       if(localStorage.getItem('user')) fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const {data, success} = await api.get('/analytics');
            if (success) {
                setAnalytics(data);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <EchoesHero />

            {localStorage.getItem('user') &&  <OnlinePeopleWidget />}

            {/* Analytics Section */}
            {!loading && analytics && (
                <section className="py-16 bg-card/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                                Echoes Analytics
                            </h2>
                            <p className="text-muted-foreground">
                                Together, we're preserving memories across time
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Bar Chart */}
                            <Card className="border-border vintage-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl font-serif text-foreground">
                                        Platform Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Total Users */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium text-foreground">
                                                        Total Users
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-foreground">
                                                    {analytics.totalUsers}
                                                </span>
                                            </div>
                                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${Math.min((analytics.totalUsers / Math.max(analytics.totalUsers, analytics.totalCapsulesCreated, analytics.totalVisitors, 1)) * 100, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Capsules Created */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-secondary" />
                                                    <span className="text-sm font-medium text-foreground">
                                                        Capsules Created
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-foreground">
                                                    {
                                                        analytics.totalCapsulesCreated
                                                    }
                                                </span>
                                            </div>
                                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${Math.min((analytics.totalCapsulesCreated / Math.max(analytics.totalUsers, analytics.totalCapsulesCreated, analytics.totalVisitors, 1)) * 100, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Capsules Opened */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium text-foreground">
                                                        Capsules Opened
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-foreground">
                                                    {
                                                        analytics.totalCapsulesOpened
                                                    }
                                                </span>
                                            </div>
                                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width:
                                                            analytics.totalCapsulesCreated >
                                                            0
                                                                ? `${Math.min((analytics.totalCapsulesOpened / analytics.totalCapsulesCreated) * 100, 100)}%`
                                                                : '0%',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Total Visitors */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-5 h-5 text-secondary" />
                                                    <span className="text-sm font-medium text-foreground">
                                                        Total Visitors
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-foreground">
                                                    {analytics.totalVisitors}
                                                </span>
                                            </div>
                                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${Math.min((analytics.totalVisitors / Math.max(analytics.totalUsers, analytics.totalCapsulesCreated, analytics.totalVisitors, 1)) * 100, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Radial Progress Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Capsule Completion Rate */}
                                <Card className="border-border vintage-shadow">
                                    <CardContent className="p-6 flex flex-col items-center justify-center">
                                        <div className="relative w-32 h-32 mb-4">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="oklch(0.28 0.025 40)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="oklch(0.62 0.12 75)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (analytics.totalCapsulesCreated > 0 ? analytics.totalCapsulesOpened / analytics.totalCapsulesCreated : 0))}`}
                                                    className="transition-all duration-1000 ease-out"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-foreground">
                                                    {analytics.totalCapsulesCreated >
                                                    0
                                                        ? Math.round(
                                                              (analytics.totalCapsulesOpened /
                                                                  analytics.totalCapsulesCreated) *
                                                                  100
                                                          )
                                                        : 0}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-medium text-muted-foreground text-center">
                                            Opening Rate
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {analytics.totalCapsulesOpened} of{' '}
                                            {analytics.totalCapsulesCreated}{' '}
                                            opened
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Visits per User */}
                                <Card className="border-border vintage-shadow">
                                    <CardContent className="p-6 flex flex-col items-center justify-center">
                                        <div className="relative w-32 h-32 mb-4">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="oklch(0.28 0.025 40)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="oklch(0.55 0.10 195)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(analytics.totalUsers > 0 ? analytics.totalVisitors / analytics.totalUsers / 10 : 0, 1))}`}
                                                    className="transition-all duration-1000 ease-out"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-foreground">
                                                    {analytics.totalUsers > 0
                                                        ? (
                                                              analytics.totalVisitors /
                                                              analytics.totalUsers
                                                          ).toFixed(1)
                                                        : '0.0'}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-medium text-muted-foreground text-center">
                                            Visits per User
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {analytics.totalVisitors} visits /{' '}
                                            {analytics.totalUsers} users
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Average Capsules per User */}
                                <Card className="border-border vintage-shadow sm:col-span-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                                    Avg. Capsules per User
                                                </h3>
                                                <p className="text-3xl font-bold text-foreground">
                                                    {analytics.totalUsers > 0
                                                        ? (
                                                              analytics.totalCapsulesCreated /
                                                              analytics.totalUsers
                                                          ).toFixed(1)
                                                        : '0.0'}
                                                </p>
                                            </div>
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                <TrendingUp className="w-8 h-8 text-primary" />
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${Math.min((analytics.totalUsers > 0 ? analytics.totalCapsulesCreated / analytics.totalUsers : 0) * 20, 100)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
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
                            Create, preserve, and unlock your memories when the
                            time is right
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
                                    Add photos, videos, audio recordings, and
                                    text. Ask your future self questions.
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
                                    Invite family and friends to contribute.
                                    Share memories together and create
                                    collective time capsules that everyone can
                                    cherish.
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
                                    Set a future date or choose a life
                                    milestone. Your capsule opens exactly when
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
                                    Never miss the moment. Receive automatic
                                    email notifications when your time capsule
                                    is ready to be opened.
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
                                    Your privacy is our priority. Bank-level
                                    encryption ensures your memories are safe
                                    and secure until you're ready.
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
                                    Share your time capsules with anyone. Create
                                    public or private capsules. Control who sees
                                    what, always.
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
                            <span className="text-primary font-medium">
                                Echoes of the Past
                            </span>{' '}
                            is more than just a time capsule app—it's a bridge
                            between your present and future self. We believe
                            that memories are precious, and the conversations we
                            have with our future selves are invaluable.
                        </p>
                        <p>
                            Whether you're capturing a moment of joy,
                            documenting a milestone, or asking questions you'll
                            only understand years from now, Echoes provides a
                            secure, beautiful space to preserve what matters
                            most.
                        </p>
                        <p>
                            Our platform combines cutting-edge technology with a
                            deep respect for privacy. Every memory you store is
                            encrypted, every moment you capture is protected,
                            and every question you ask is kept safe until the
                            perfect moment arrives.
                        </p>
                        <p className="text-foreground font-medium pt-4">
                            Remember the past. Talk to the future. Live in the
                            present.
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
                            Create your first time capsule and begin preserving
                            memories for tomorrow
                        </p>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 vintage-glow cursor-target"
                            onClick={() => (window.location.href = '/capsule')}
                        >
                            Create Your Time Capsule Now
                            <Clock className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
