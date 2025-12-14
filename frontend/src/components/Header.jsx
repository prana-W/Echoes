import React, { useState, useEffect } from 'react';
import { Clock, Home, Package, Users, User, LogOut, Plus,  Calendar} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {useApi} from '@/hooks/index.js';
import {useNavigate} from 'react-router-dom';

export default function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState(null);
    const api = useApi();

    const navigate = useNavigate();

    useEffect(() => {
        // Check for user in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(userData);
            } catch (err) {
                console.error('Failed to parse user data');
            }
        }

        // Mouse move listener to show/hide header
        const handleMouseMove = (e) => {
            if (e.clientY < 80) {
                setIsVisible(true);
            } else if (e.clientY > 150) {
                setIsVisible(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleLogout = async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/auth');
    };

    const NavLink = ({ href, icon: Icon, children }) => (
        <a
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-foreground/90 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
        >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">{children}</span>
        </a>
    );

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
            }`}
        >
            <div className="bg-background/70 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl px-6 py-3 vintage-glow">
                <div className="flex items-center gap-4">
                    {/* User Greeting or Get Started */}
                    {user ? (
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10" onClick={() => navigate('/auth')}>
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-medium text-foreground">
               <span className="text-primary">{user}</span>
              </span>
                        </div>
                    ) : (
                        <Button
                            onClick={() =>navigate('/auth')}
                            size="sm"
                            className="hidden lg:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-1 text-sm"
                        >
                            Get Started
                        </Button>
                    )}


                    {/* Navigation Links */}
                    <nav className="flex items-center gap-1">
                        {user ? (
                            <>
                                <NavLink href="/" icon={Home}>
                                    <span className="hidden md:inline">Home</span>
                                </NavLink>
                                <NavLink href="/capsule" icon={Package}>
                                    <span className="hidden md:inline">Capsules</span>
                                </NavLink>
                                <NavLink href="/relations" icon={Users}>
                                    <span className="hidden lg:inline">Family</span>
                                </NavLink>
                                <NavLink href="/event" icon={Calendar}>
                                    <span className="hidden md:inline">Event</span>
                                </NavLink>
                                {/*<Button*/}
                                {/*    onClick={() => window.location.href = '/capsule/assemble?new=true'}*/}
                                {/*    size="sm"*/}
                                {/*    className="hidden xl:flex bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-4 py-1 text-sm ml-2"*/}
                                {/*>*/}
                                {/*    <Plus className="w-3.5 h-3.5 mr-1" />*/}
                                {/*    New*/}
                                {/*</Button>*/}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-destructive hover:bg-destructive/10 transition-all duration-200 ml-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="font-medium text-sm hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink href="/" icon={Home}>
                                    <span className="hidden sm:inline">Home</span>
                                </NavLink>
                                <NavLink href="/#about" icon={Clock}>
                                    <span className="hidden sm:inline">About</span>
                                </NavLink>
                                <Button
                                    onClick={() => navigate('/auth')}
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-1 text-sm ml-2"
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Subtle glow effect underneath */}
            <div className="absolute inset-0 -z-10 bg-primary/10 blur-xl rounded-full opacity-50"></div>
        </div>
    );
}