import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { Icons } from '../components/common/Icons';
import Button from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeveloperRequests() {
    const { user, isDev } = useAuth();
    const { showToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchRequests();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('developer_requests_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'developer_requests' },
                (payload) => {
                    fetchRequests();
                })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('developer_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === 'PGRST205' || (error.message && error.message.includes('developer_requests'))) {
                    // specific error handled in state, but we don't block optimistic UI for now
                } else {
                    throw error;
                }
            }
            setRequests(data || []);
            // Only clear error if we successfully fetched data, otherwise keep "table missing" error visible
            if (data) setError(null);

        } catch (error) {
            console.error('Error fetching requests:', error);
            if (error.code === 'PGRST205' || (error.message && error.message.includes('developer_requests'))) {
                setError('Database table "developer_requests" not found. Please run the SQL script in your Supabase SQL Editor.');
            } else {
                // Only set generic error if we don't have a specific one
                if (!error) setError(error.message || 'Failed to load requests');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newRequest.trim()) return;

        // 1. Optimistic Update (Immediate)
        const optimisticId = 'temp-' + Date.now();
        const optimisticRequest = {
            id: optimisticId,
            content: newRequest,
            author_name: user?.email?.split('@')[0] || 'Me',
            created_by: user?.id,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        setRequests(prev => [optimisticRequest, ...prev]);
        setNewRequest('');
        setSubmitting(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('developer_requests')
                .insert([
                    {
                        content: optimisticRequest.content,
                        author_name: optimisticRequest.author_name,
                        created_by: optimisticRequest.created_by,
                        status: optimisticRequest.status
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            // 2. Success: Replace optimistic item with the Real item (REAL UUID)
            if (data) {
                setRequests(prev => prev.map(r => r.id === optimisticId ? data : r));
                showToast('Request submitted successfully', 'success');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            // Revert optimistic update on error
            setRequests(prev => prev.filter(r => r.id !== optimisticId));
            setNewRequest(optimisticRequest.content); // restore text

            if (error.code === 'PGRST205' || (error.message && error.message.includes('developer_requests'))) {
                setError('Table "developer_requests" not found. Please run the SQL script.');
            } else {
                showToast('Failed to submit request: ' + error.message, 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        if (id.toString().startsWith('temp-')) return;

        // 1. Optimistic Update
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

        try {
            const { error } = await supabase
                .from('developer_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating status:', error);
            // Revert
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: currentStatus } : r));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        if (deleteId.toString().startsWith('temp-')) {
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            return;
        }

        // 1. Optimistic Update
        const previousRequests = [...requests];
        setRequests(prev => prev.filter(r => r.id !== deleteId));
        setIsDeleteModalOpen(false); // Close immediately

        try {
            const { error } = await supabase
                .from('developer_requests')
                .delete()
                .eq('id', deleteId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting request:', error);
            // Revert
            setRequests(previousRequests);
            showToast('Failed to delete request', 'error');
        } finally {
            setDeleteId(null);
        }
    };

    const handleDeleteClick = (id) => {
        if (id.toString().startsWith('temp-')) return;
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden group shadow-2xl"
            >
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] -z-10 group-hover:bg-violet-600/15 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -z-10" />

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                        <Icons.Code className="w-6 h-6 text-violet-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Developer Requests
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Submit feature requests, bug reports, or modifications directly to the developer team.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in">
                        <Icons.Exclamation className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-red-400">Error: Database Connection Issue</div>
                            <div className="text-sm opacity-90">{error}</div>
                        </div>
                    </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="mb-10 relative">
                    <div className="relative group/input">
                        <textarea
                            value={newRequest}
                            onChange={(e) => setNewRequest(e.target.value)}
                            placeholder="Describe what you need... (e.g., 'Add a date filter', 'Fix layout bug on mobile')"
                            className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none shadow-inner"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            type="submit"
                            disabled={submitting || !newRequest.trim()}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            {submitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Icons.Plus className="w-4 h-4" />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Request List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white/80 flex items-center gap-2 pl-1 uppercase tracking-wider text-xs">
                        <Icons.List className="w-4 h-4" />
                        Active Requests
                    </h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                            <div className="text-sm font-medium">Loading requests...</div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Icons.Code className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-gray-400 font-medium">No requests found.</p>
                            <p className="text-gray-600 text-sm">Be the first to create one!</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            <AnimatePresence mode="popLayout relative">
                                {requests.map((request) => {
                                    const isTemp = request.id.toString().startsWith('temp-');
                                    return (
                                        <motion.div
                                            key={request.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                            animate={{ opacity: isTemp ? 0.7 : 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`group relative p-5 rounded-2xl border transition-all duration-300 ${request.status === 'completed'
                                                ? 'bg-green-900/10 border-green-500/10 hover:border-green-500/20'
                                                : 'bg-white/5 border-white/5 hover:border-violet-500/20 hover:bg-white/8 hover:shadow-lg hover:shadow-violet-500/5'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${request.status === 'completed'
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            }`}>
                                                            {request.status}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                            <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                            <span>{request.author_name}</span>
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed ${request.status === 'completed' ? 'text-gray-500 line-through decoration-gray-700' : 'text-gray-200'
                                                        }`}>
                                                        {request.content}
                                                    </p>
                                                </div>

                                                <div className={`flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute top-4 right-4 md:bg-black/40 md:backdrop-blur-md rounded-lg p-1 md:border border-white/5 shadow-lg group-hover:translate-y-0 translate-y-2 duration-200 ${isTemp ? 'invisible' : ''}`}>
                                                    <button
                                                        onClick={() => toggleStatus(request.id, request.status)}
                                                        className={`p-2 rounded-md transition-all active:scale-95 ${request.status === 'completed'
                                                            ? 'text-amber-400 hover:bg-amber-500/10'
                                                            : 'text-green-400 hover:bg-green-500/10'
                                                            }`}
                                                        title={request.status === 'completed' ? "Mark as Pending" : "Mark as Complete"}
                                                    >
                                                        <Icons.Check className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-px h-4 bg-white/10 hidden md:block"></div>
                                                    <button
                                                        onClick={() => handleDeleteClick(request.id)}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-all active:scale-95"
                                                        title="Delete Request"
                                                    >
                                                        <Icons.Close className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Request"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Are you sure you want to delete this request? This action cannot be undone.
                    </p>
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                        >
                            Delete Request
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
