import React, { useEffect, useRef } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Logo from '@/components/EchoesLogo.jsx';

const EchoesHero = () => {
    const canvasRef = useRef(null);
    const titleRef = useRef(null);
    const velocityX = useRef(0);
    const velocityY = useRef(0);
    const prevEvent = useRef(0);

    const isLoggedIn = Boolean(localStorage.getItem('user'));

    /* ---------------- Canvas Background ---------------- */
    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 80;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.4 + 0.15;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(218, 165, 32, ${this.opacity})`; // amber glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let rafId;
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(218, 165, 32, ${0.12 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });

            rafId = requestAnimationFrame(animateParticles);
        }

        animateParticles();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    /* ---------------- Scatter Text Effect ---------------- */
    useEffect(() => {
        if (!titleRef.current) return;
        const chars = titleRef.current.querySelectorAll('.char');

        const handlePointerMove = (e) => {
            const now = performance.now();
            const dt = (now - prevEvent.current) / 1000 || 0.016;
            prevEvent.current = now;
            velocityX.current = e.movementX / dt;
            velocityY.current = e.movementY / dt;
        };

        document.addEventListener('pointermove', handlePointerMove);

        chars.forEach(char => {
            char.addEventListener('mouseenter', () => {
                const speed = Math.hypot(velocityX.current, velocityY.current);
                const angle = Math.atan2(velocityY.current, velocityX.current);
                const dist = Math.min(speed * 0.07, 36);

                char.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
                char.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;

                setTimeout(() => {
                    char.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
                    char.style.transform = 'translate(0,0)';
                }, 800);
            });
        });

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);

    const splitTextIntoChars = (text) =>
        text.split('').map((char, i) => (
            <span key={i} className="char inline-block">
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));

    return (
        <section className="relative overflow-hidden bg-background text-foreground min-h-screen">
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Warm ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="p-6 rounded-full bg-primary/15 vintage-glow">
                            <Logo />
                        </div>
                    </div>

                    {/* Title */}
                    <h1
                        ref={titleRef}
                        className="text-5xl lg:text-7xl font-serif font-bold mb-6 tracking-tight select-none"
                    >
                        {splitTextIntoChars('Echoes of the Past')}
                    </h1>

                    <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                        Capture today’s memories. Preserve them for tomorrow.
                        <br />
                        <span className="text-primary font-semibold">
                            Talk to your future self.
                        </span>
                    </p>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                        Create time capsules filled with your memories, questions, and dreams.
                        Open them when the moment is right — a future date or a life milestone.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="px-8 py-6 bg-primary text-primary-foreground text-lg rounded-lg
               hover:scale-105 transition-all vintage-glow cursor-target"
                            onClick={() =>
                                (window.location.href = isLoggedIn ? '/capsule' : '/auth')
                            }
                        >
    <span className="flex items-center gap-2">
        {isLoggedIn ? 'Create Your Time Capsule' : 'Enter Now'}
        <ArrowRight className="w-5 h-5" />
    </span>
                        </button>


                        <button
                            className="px-8 py-6 bg-card border border-border text-foreground text-lg
                                       rounded-lg hover:bg-muted transition-all hover:scale-105 cursor-target"
                            onClick={() =>
                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                            }
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .char {
                    display: inline-block;
                    will-change: transform;
                }
            `}</style>
        </section>
    );
};

export default EchoesHero;
