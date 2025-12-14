import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export default function GoBackButton() {
    const navigate = useNavigate();

    const handleBack = () => {
        // If browser history exists, go back
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/'); // safe fallback
        }
    };

    return (
        <button
            onClick={handleBack}
            aria-label="Go back"
            className="
                fixed top-6 left-6 z-50
                flex items-center gap-2
                px-4 py-2 rounded-full
                bg-card border border-border
                text-foreground
                shadow-md vintage-shadow
                hover:bg-muted hover:scale-105
                transition-all duration-200
            "
        >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span className="text-sm font-serif hidden sm:inline">Go back</span>
        </button>
    );
}
