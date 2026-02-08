import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../contexts/ToastContext';

export default function Documents() {
    const { user, isHost } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUpload, setShowUpload] = useState(false);

    // UI State for custom interactions
    // UI State for custom interactions
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('documents')
                .select(`
                    *,
                    profiles (display_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesHashtag = doc.hashtags?.some(tag => tag.toLowerCase().includes(query));

        // Filter out "Only Host" documents for non-hosts
        if (doc.only_host && !isHost) return false;

        return matchesTitle || matchesHashtag;
    });

    const initiateDelete = (doc) => {
        setDocumentToDelete(doc);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!documentToDelete) return;
        const docId = documentToDelete.id;

        try {


            const { error, count } = await supabase
                .from('documents')
                .delete({ count: 'exact' })
                .eq('id', docId);

            if (error) throw error;

            if (count === 0) {
                throw new Error('No document was deleted. This usually means you do not have permission (RLS) or the document was already deleted.');
            }

            if (count === 0) {
                throw new Error('No document was deleted. This usually means you do not have permission (RLS) or the document was already deleted.');
            }

            setDocuments(documents.filter(doc => doc.id !== docId));
            showToast('Resource deleted successfully', 'success');
            setDeleteModalOpen(false);
            setDocumentToDelete(null);
        } catch (error) {
            console.error('Error deleting document:', error);
            showToast('Error deleting document: ' + error.message, 'error');
            setDeleteModalOpen(false);
        }
    };

    const handleToggleVisibility = async (doc) => {
        try {
            const newStatus = !doc.only_host;

            // Optimistic update
            setDocuments(documents.map(d =>
                d.id === doc.id ? { ...d, only_host: newStatus } : d
            ));

            const { error } = await supabase
                .from('documents')
                .update({ only_host: newStatus })
                .eq('id', doc.id);

            if (error) {
                // Revert on error
                setDocuments(documents.map(d =>
                    d.id === doc.id ? { ...d, only_host: doc.only_host } : d
                ));
                throw error;
            }
        } catch (error) {
            console.error('Error updating visibility:', error);
            // detailed error for debugging
            if (error.code === '42703') { // Postgres code for undefined column
                showToast('Error: The "only_host" column seems to be missing in your database. Please check the implementation plan.', 'error');
            } else {
                showToast('Error updating visibility: ' + (error.message || 'Unknown error'), 'error');
            }
        }
    };

    // Get all unique hashtags for suggestions
    const allHashtags = [...new Set(documents.flatMap(doc => doc.hashtags || []))];

    const handleSearchTag = (tag) => {
        setSearchQuery(tag);
    };

    return (
        <PageTransition className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Documents & Links</h1>
                    <p className="text-gray-400 mt-1">Repository for useful files and resources.</p>
                </div>
                <Button
                    onClick={() => setShowUpload(!showUpload)}
                    variant="primary"
                    className="w-full sm:w-auto px-6 py-4 flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/20"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showUpload ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                    </svg>
                    <span>{showUpload ? 'Close Upload' : 'Add Resource'}</span>
                </Button>
            </div>

            {showUpload && (
                <div className="animate-fade-in-down mb-4">
                    <DocumentUpload
                        allHashtags={allHashtags}
                        onUploadComplete={() => {
                            fetchDocuments();
                            setShowUpload(false);
                            fetchDocuments();
                            setShowUpload(false);
                            showToast('Resource added successfully!', 'success');
                        }}
                    />
                </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-20 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-base transition-all"
                    placeholder="Search by title or #hashtag..."
                />
            </div>

            {/* Documents Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading documents...</p>
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/60 backdrop-blur-xl rounded-xl border border-white/10 border-dashed">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-white">No documents found</h3>
                    <p className="mt-1 text-sm text-gray-400">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding a new document.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 hover:shadow-xl hover:border-primary-500/30 transition-all p-5 flex flex-col overflow-hidden group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-lg ${doc.type === 'file' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {doc.type === 'file' ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                                    {new Date(doc.created_at).toLocaleDateString()}
                                </span>
                                {doc.only_host && (
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-semibold ml-2">
                                        HOST ONLY
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-start gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-100 break-all overflow-hidden leading-tight" title={doc.title}>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                                        {doc.title}
                                    </a>
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4 flex-1 content-start">
                                {doc.hashtags?.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleSearchTag(tag)}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors break-all border border-white/5 hover:border-white/20"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>

                            {isHost && (
                                <div className="mb-4 pt-3 flex items-center justify-between gap-2 border-t border-white/5">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Admin</div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleToggleVisibility(doc);
                                            }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border ${doc.only_host
                                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                }`}
                                        >
                                            {doc.only_host ? (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                    Private
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Public
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                initiateDelete(doc);
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all text-xs font-bold"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-3 border-t border-white/10 flex justify-between items-center gap-2">
                                <span className="text-xs text-gray-500 truncate flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                                    {doc.profiles?.display_name || 'Unknown'}
                                </span>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary-600 hover:text-white text-primary-400 text-sm font-medium transition-all flex items-center gap-1 group-hover:bg-primary-600/20"
                                >
                                    {doc.type === 'file' ? 'Download' : 'Visit'}
                                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Are you sure you want to delete <span className="text-white font-bold">"{documentToDelete?.title}"</span>?
                        <br />
                        <span className="text-red-400 text-sm mt-2 block">This action cannot be undone.</span>
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            onClick={() => setDeleteModalOpen(false)}
                            variant="secondary"
                            className="text-gray-200 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            variant="primary" // Using primary (white) but overriding with red styles
                            className="!bg-red-600 !text-white !border-red-500 hover:!bg-red-700 shadow-none hover:shadow-lg"
                        >
                            Delete Resource
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageTransition>
    );
}
