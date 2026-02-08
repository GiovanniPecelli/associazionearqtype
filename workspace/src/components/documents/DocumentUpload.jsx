import { useState, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

export function DocumentUpload({ onUploadComplete, allHashtags = [] }) {
    const { user, isHost, isArchitect } = useAuth();
    const [type, setType] = useState('link'); // Default to 'link' now
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);

    const [hashtags, setHashtags] = useState([]);
    const [currentHashtag, setCurrentHashtag] = useState('');
    const [onlyHost, setOnlyHost] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { showToast } = useToast();
    const fileInputRef = useRef(null);

    // Filter suggestions based on current input
    const suggestions = allHashtags.filter(tag =>
        tag.toLowerCase().includes(currentHashtag.toLowerCase()) &&
        !hashtags.includes(tag) &&
        currentHashtag.length > 0
    ).slice(0, 5);

    const handleHashtagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            addHashtag();
        }
    };

    const addHashtag = () => {
        const tag = currentHashtag.trim().replace(/^#/, '');
        if (tag && !hashtags.includes(tag)) {
            setHashtags([...hashtags, tag]);
        }
        setCurrentHashtag('');
    };

    const removeHashtag = (tagToRemove) => {
        setHashtags(hashtags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;
        if (!title.trim()) { showToast('Please enter a title', 'warning'); return; }
        if (hashtags.length === 0) { showToast('Add at least one hashtag', 'warning'); return; }
        if (type === 'file' && !file) { showToast('Please select a file', 'warning'); return; }
        if (type === 'link' && !url.trim()) { showToast('Please enter a URL', 'warning'); return; }

        setLoading(true);
        try {
            let finalUrl = url;
            let mimeType = 'text/uri-list';
            let size = 0;

            if (type === 'file') {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(filePath);

                finalUrl = publicUrl;
                mimeType = file.type;
                size = file.size;
            }

            const { error: insertError } = await supabase
                .from('documents')
                .insert({
                    title,
                    type,
                    url: finalUrl,
                    hashtags,
                    uploaded_by: user.id,
                    mime_type: mimeType,
                    size,
                    only_host: onlyHost
                });

            if (insertError) throw insertError;

            // Reset form
            setTitle('');
            setUrl('');
            setFile(null);
            setHashtags([]);
            setOnlyHost(false);
            if (fileInputRef.current) fileInputRef.current.value = '';

            if (onUploadComplete) onUploadComplete();
            // Success handled by closing the form via onUploadComplete
        } catch (error) {
            console.error('Error uploading document:', error);
            showToast(error.message || 'Error uploading document', 'error');
        } finally {
            setLoading(false);
        }
    };

    const canUploadFiles = isHost || isArchitect;

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/10 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Add Resource</h3>
                    <p className="text-sm text-gray-400">Share useful links{canUploadFiles ? ' or documents' : ''} with the team</p>
                </div>
            </div>


            {canUploadFiles && (
                <div className="flex gap-3 mb-6">
                    <Button
                        type="button"
                        onClick={() => setType('link')}
                        className={`flex-1 transition-all ${type === 'link'
                            ? 'bg-white text-black shadow-lg shadow-white/20'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Web Link
                        </div>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setType('file')}
                        className={`flex-1 transition-all ${type === 'file'
                            ? 'bg-white text-black shadow-lg shadow-white/20'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div className="text-left">
                                <div>File/Document</div>
                                <div className="text-[10px] font-normal opacity-60">Host/Coordinator Only</div>
                            </div>
                        </div>
                    </Button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-white bg-white/5 placeholder-gray-500"
                        placeholder="e.g. React Tutorial, Project Specs..."
                        required
                    />
                </div>

                {type === 'file' && canUploadFiles ? (
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            File * <span className="text-xs font-normal text-gray-500">(PDF, ZIP, images, etc.)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-dashed border-primary-500/50 rounded-xl bg-white/5
                                    file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 
                                    file:text-sm file:font-bold file:bg-primary-600 file:text-white file:hover:bg-primary-500
                                    cursor-pointer hover:border-primary-500 transition-colors text-gray-300"
                                required
                            />
                        </div>
                        {file && (
                            <p className="mt-2 text-sm text-green-700 font-medium">
                                ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </p>
                        )}
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">URL *</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-white bg-white/5 placeholder-gray-500"
                            placeholder="https://example.com/resource"
                            required
                        />
                    </div>
                )}

                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Hashtags * <span className="text-xs font-normal text-gray-500">(Press Enter or Space to add)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {hashtags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-600 text-white shadow-sm">
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => removeHashtag(tag)}
                                    className="ml-2 text-white hover:text-red-200 focus:outline-none font-bold"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={currentHashtag}
                        onChange={(e) => {
                            setCurrentHashtag(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                        }}
                        onKeyDown={handleHashtagKeyDown}
                        onBlur={() => {
                            setTimeout(() => setShowSuggestions(false), 200);
                            addHashtag();
                        }}
                        onFocus={() => setShowSuggestions(currentHashtag.length > 0)}
                        className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-white bg-white/5 placeholder-gray-500"
                        placeholder="Add tags... (e.g. react, tutorial, design)"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                            {suggestions.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        setHashtags([...hashtags, tag]);
                                        setCurrentHashtag('');
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm font-medium text-white flex items-center transition-colors"
                                >
                                    <span className="text-primary-600 mr-2 font-bold">#</span>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {canUploadFiles && (
                    <div className="flex items-center gap-2 py-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={onlyHost}
                                    onChange={(e) => setOnlyHost(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 transition-all checked:border-purple-500 checked:bg-purple-500 hover:border-purple-500/50"
                                />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors">
                                Visible to Hosts Only
                            </span>
                        </label>
                        <span className="text-xs text-gray-500">(Exclusive content)</span>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 text-base shadow-lg"
                        disabled={loading}
                    >
                        {loading ? '⏳ Uploading...' : `✨ Add ${type === 'link' ? 'Link' : 'Document'}`}
                    </Button>
                </div>
            </form>
        </div>
    );
}
