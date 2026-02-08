import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import Button from '../common/Button';

export function WorkflowAttachments({ workflowId, isEditable }) {
    const { user, isHost } = useAuth();
    const { showToast } = useToast();
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttachments();
    }, [workflowId]);

    async function fetchAttachments() {
        try {
            const { data, error } = await supabase
                .from('workflow_attachments')
                .select('*')
                .eq('workflow_id', workflowId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAttachments(data || []);
        } catch (error) {
            console.error('Error fetching attachments:', error);
            showToast('Error fetching attachments: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleFileUpload(e) {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `workflows/${workflowId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath);

            // 3. Save to Database
            const { data, error: dbError } = await supabase
                .from('workflow_attachments')
                .insert({
                    workflow_id: workflowId,
                    file_url: publicUrl,
                    file_name: file.name,
                    file_type: file.type,
                    uploaded_by: user.id
                }).select().single();

            if (dbError) throw dbError;

            setAttachments((prev) => [data, ...prev]);
            showToast('File uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Error uploading file: ' + error.message, 'error');
        } finally {
            setUploading(false);
            // if (fileInputRef.current) fileInputRef.current.value = ''; // Assuming fileInputRef is defined elsewhere if needed
        }
    }

    async function handleDelete(attachmentId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            // Note: Deleting from storage via client might be restricted depending on policies.
            // For now we just delete the DB record which hides it.

            const { error } = await supabase
                .from('workflow_attachments')
                .delete()
                .eq('id', attachmentId);

            if (error) throw error;
            fetchAttachments();
        } catch (error) {
            alert('Error deleting file: ' + error.message);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Attachments</h3>
                <div>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`cursor-pointer inline-flex items-center px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold text-base ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <svg className="w-5 h-5 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-gray-400">Loading attachments...</div>
            ) : attachments.length === 0 ? (
                <div className="text-sm text-gray-400 italic">No attachments yet.</div>
            ) : (
                <ul className="divide-y divide-white/10 border border-white/10 rounded-xl bg-gray-900/60 backdrop-blur-xl">
                    {attachments.map((file) => (
                        <li key={file.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center overflow-hidden">
                                <svg className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-primary-400 hover:text-primary-300 truncate transition-colors"
                                >
                                    {file.file_name}
                                </a>
                            </div>
                            <div className="flex items-center ml-4">
                                <span className="text-xs text-gray-400 mr-3">
                                    {new Date(file.created_at).toLocaleDateString()}
                                </span>
                                {(user.id === file.uploaded_by || isHost) && (
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete file"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
