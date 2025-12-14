import {useState} from 'react';
import {toast} from 'sonner';
import {useApi} from '@/hooks';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {CheckCircle} from 'lucide-react';

export const eventList = [
    'birthday',
    'wedding',
    'anniversary',
    'graduation',
    'retirement',
    'engagement',
    'childbirth',
    'firstJob',
    'promotion',
    'housePurchase',
    'startupLaunch',
    'memorial',
    'other',
];

// helper: Capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const LifeEventPage = () => {
    const api = useApi();
    const [selectedEvent, setSelectedEvent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedEvent) {
            toast.error('Please select an event first');
            return;
        }

        setLoading(true);
        try {
            const {success, message} = await api.post('/event', {
                eventType: selectedEvent,
            });

            if (success) {
                toast.success(message || 'Event recorded successfully');
                setSelectedEvent('');
            }
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background px-6 py-12">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-serif font-bold">
                        A Moment in Your Life
                    </h1>
                    <p className="text-muted-foreground italic">
                        Mark what has already happened. Time will remember.
                    </p>
                </div>

                {/* Events */}
                <Card className="p-8 vintage-shadow space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {eventList.map((event) => {
                            const isSelected = selectedEvent === event;

                            return (
                                <button
                                    key={event}
                                    onClick={() => setSelectedEvent(event)}
                                    className={`
                                        flex items-center justify-between px-5 py-4
                                        rounded-lg border transition-all
                                        ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 vintage-glow'
                                                : 'border-border bg-muted/40 hover:bg-muted'
                                        }
                                    `}
                                >
                                    <span className="font-serif text-lg">
                                        {capitalize(event)}
                                    </span>

                                    {isSelected && (
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Action */}
                <div className="text-center">
                    <Button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="
                            px-12 py-6 text-lg font-serif
                            bg-primary text-primary-foreground
                            hover:vintage-glow transition-all
                        "
                    >
                        Record This Moment
                    </Button>

                    <p className="mt-3 text-xs text-muted-foreground italic">
                        This helps time capsules unlock when life moves forward.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LifeEventPage;
