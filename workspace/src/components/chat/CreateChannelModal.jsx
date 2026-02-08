import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

export function CreateChannelModal({ onClose, onCreated }) {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

        try {
            const { data, error } = await supabase
                .from('channels')
                .insert({
                    name,
                    slug,
                    type: 'public', // Default to public for now, can add toggle later
                    created_by: user.id
                })
                .select()
                .single();

            if (error) throw error;
            onCreated(data);
        } catch (err) {
            console.error('Error creating channel:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden transform transition-all">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Create Channel</h3>
                    <p className="text-sm text-gray-400 mb-6">Start a new discussion topic</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Channel Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="e.g. Project Alpha"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="ghost"
                                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                disabled={!name.trim()}
                            >
                                Create Channel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
