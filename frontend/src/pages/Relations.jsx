import React, {useState, useEffect} from 'react';
import {Users, Search, Plus, X, UserPlus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {useApi} from '@/hooks/index.js';
import {toast} from 'sonner';

const RELATIONS = [
    {value: 'father', label: 'Father'},
    {value: 'mother', label: 'Mother'},
    {value: 'son', label: 'Son'},
    {value: 'daughter', label: 'Daughter'},
    {value: 'husband', label: 'Husband'},
    {value: 'wife', label: 'Wife'},
    {value: 'brother', label: 'Brother'},
    {value: 'sister', label: 'Sister'},
    {value: 'maternal_grandfather', label: 'Maternal Grandfather'},
    {value: 'maternal_grandmother', label: 'Maternal Grandmother'},
    {value: 'paternal_grandfather', label: 'Paternal Grandfather'},
    {value: 'paternal_grandmother', label: 'Paternal Grandmother'},
    {value: 'grandson', label: 'Grandson'},
    {value: 'granddaughter', label: 'Granddaughter'},
    {value: 'brother_in_law', label: 'Brother-in-law'},
    {value: 'sister_in_law', label: 'Sister-in-law'},
    {value: 'uncle', label: 'Uncle'},
    {value: 'aunt', label: 'Aunt'},
    {value: 'cousin', label: 'Cousin'},
    {value: 'maternal_uncle', label: 'Maternal Uncle'},
    {value: 'maternal_aunt', label: 'Maternal Aunt'},
    {value: 'paternal_uncle', label: 'Paternal Uncle'},
    {value: 'paternal_aunt', label: 'Paternal Aunt'},
    {value: 'nephew', label: 'Nephew'},
    {value: 'niece', label: 'Niece'},
    {value: 'other', label: 'Other'},
];

export default function RelationsPage() {
    const api = useApi();
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const [selectedRelation, setSelectedRelation] = useState('');
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState(false);

    // Fetch all relations on mount
    useEffect(() => {
        fetchRelations();
    }, []);

    const fetchRelations = async () => {
        setLoading(true);
        try {
            const {data, success} = await api.get('/relations');
            if (success) {
                setRelations(data || []);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to load relations');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchUser = async () => {
        if (!searchEmail.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        setSearching(true);
        try {
            const {data, success} = await api.get(
                `/users/email/${searchEmail}`
            );
            if (success && data) {
                setSearchedUser(data);
            }
        } catch (err) {
            toast.error(err?.message || 'User not found');
            setSearchedUser(null);
        } finally {
            setSearching(false);
        }
    };

    const handleAddRelation = async () => {
        if (!searchedUser) {
            toast.error('Please search and select a user first');
            return;
        }
        if (!selectedRelation) {
            toast.error('Please select a relation');
            return;
        }

        setAdding(true);
        try {
            const {success, message} = await api.post('/relations', {
                targetUserId: searchedUser._id,
                relation: selectedRelation,
            });

            if (success) {
                toast.success(message || 'Relation added successfully!');
                setShowAddDialog(false);
                setSearchEmail('');
                setSearchedUser(null);
                setSelectedRelation('');
                fetchRelations(); // Refresh the list
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to add relation');
        } finally {
            setAdding(false);
        }
    };

    const formatRelation = (relation) => {
        const found = RELATIONS.find((r) => r.value === relation);
        return found ? found.label : relation;
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-serif text-foreground">
                            Family & Friends
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Connect with your loved ones and share memories together
                    </p>
                </div>

                {/* Add New Button */}
                <div className="mb-6">
                    <Button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Member
                    </Button>
                </div>

                {/* Relations List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground">
                            Loading relations...
                        </div>
                    </div>
                ) : relations.length === 0 ? (
                    <Card className="border-border">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <UserPlus className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-center">
                                No family members or friends added yet.
                                <br />
                                Click "Add New Member" to get started.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {relations.map((relation) => (
                            <Card
                                key={relation._id}
                                className="border-border hover:border-primary/50 transition-colors"
                            >
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-foreground">
                                                {relation.to.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {relation.to.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium">
                                            {formatRelation(relation.relation)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add Relation Dialog */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">
                                Add Family Member or Friend
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Search for a user by email and select your
                                relation with them.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Search User */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="search-email"
                                    className="text-foreground"
                                >
                                    Email Address
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search-email"
                                            type="email"
                                            placeholder="user@example.com"
                                            className="pl-10 bg-muted/50 border-border"
                                            value={searchEmail}
                                            onChange={(e) =>
                                                setSearchEmail(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === 'Enter' &&
                                                handleSearchUser()
                                            }
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSearchUser}
                                        disabled={searching}
                                        className="bg-secondary hover:bg-secondary/90"
                                    >
                                        {searching ? 'Searching...' : 'Search'}
                                    </Button>
                                </div>
                            </div>

                            {/* Searched User Display */}
                            {searchedUser && (
                                <Card className="border-border bg-muted/30">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Users className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {searchedUser.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {searchedUser.email}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Relation Selection */}
                            {searchedUser && (
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="relation"
                                        className="text-foreground"
                                    >
                                        Relation
                                    </Label>
                                    <Select
                                        value={selectedRelation}
                                        onValueChange={setSelectedRelation}
                                    >
                                        <SelectTrigger className="bg-muted/50 border-border">
                                            <SelectValue placeholder="Select relation" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            {RELATIONS.map((rel) => (
                                                <SelectItem
                                                    key={rel.value}
                                                    value={rel.value}
                                                >
                                                    {rel.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => {
                                        setShowAddDialog(false);
                                        setSearchEmail('');
                                        setSearchedUser(null);
                                        setSelectedRelation('');
                                    }}
                                    variant="outline"
                                    className="flex-1 border-border"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddRelation}
                                    disabled={
                                        !searchedUser ||
                                        !selectedRelation ||
                                        adding
                                    }
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    {adding ? 'Adding...' : 'Add Relation'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
