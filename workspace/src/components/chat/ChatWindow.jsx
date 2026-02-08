import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { MessageBubble } from './MessageBubble';

import { Icons } from '../common/Icons';

export function ChatWindow({ channel, onBack }) { // channel is now the full object
    const { user, isHost, isEliteRole } = useAuth();
    const { showToast } = useToast();
    const canUpload = isHost || isEliteRole; // Only Hosts/Elite can upload
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Use channel.slug instead of channel string if using slug-based
    // BUT we should verify if 'channel' prop is the object or string.
    // Based on ChatLayout, it's the full channel object.
    const channelSlug = channel?.slug;

    useEffect(() => {
        if (!channelSlug) return;

        fetchMessages();

        // Real-time subscription
        const subscription = supabase
            .channel(`messages:${channelSlug}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `channel=eq.${channelSlug}`
            }, (payload) => {
                fetchNewMessageProfile(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [channelSlug]);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (messages.length > 0) {
            if (isInitialLoad) {
                scrollToBottom('auto');
                setIsInitialLoad(false);
            } else {
                scrollToBottom('smooth');
            }
        }
    }, [messages, isInitialLoad]);

    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    async function fetchNewMessageProfile(message) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('email, display_name')
                .eq('id', message.user_id)
                .single();

            if (!error && data) {
                // Ensure profiles structure matches what MessageBubble expects
                const messageWithProfile = { ...message, profiles: data };
                setMessages(prev => {
                    if (prev.some(m => m.id === message.id)) return prev;
                    return [...prev, messageWithProfile];
                });

                // Scroll to bottom on new message
                setTimeout(() => scrollToBottom('smooth'), 100);
            }
        } catch (error) {
            console.error('Error fetching profile for new message:', error);
        }
    }

    async function fetchMessages() {
        try {
            setLoading(true);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Sliding 7-day window

            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    profiles (email, display_name)
                `)
                .eq('channel', channelSlug)
                .gte('created_at', sevenDaysAgo.toISOString())
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
            setIsInitialLoad(true);
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Strict Size Limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
            showToast('File too large. Max limit is 5MB.', 'error');
            return;
        }

        // 2. Strict Type Limit
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Invalid file type. Only Images and Documents allowed.', 'error');
            return;
        }

        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `chat/${fileName}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('chat-attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // URL
            const { data: { publicUrl } } = supabase.storage
                .from('chat-attachments')
                .getPublicUrl(filePath);

            // Insert Msg
            const { error: msgError } = await supabase
                .from('messages')
                .insert({
                    content: `📎 File: ${file.name}`,
                    channel: channelSlug,
                    user_id: user.id,
                    attachment_url: publicUrl,
                    attachment_type: file.type,
                    attachment_name: file.name
                });

            if (msgError) throw msgError;

        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Failed to upload file', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    async function sendMessage(e) {
        e.preventDefault();
        if (!newMessage.trim() || !user || !channelSlug) return;

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    content: newMessage,
                    channel: channelSlug,
                    user_id: user.id
                });

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error('❌ Error sending message:', error);
            showToast('Failed to send message: ' + error.message, 'error');
        }
    }

    return (
        <div className="h-full flex flex-col bg-transparent overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900/60 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden text-gray-400 hover:text-white p-1 -ml-1"
                        >
                            <Icons.ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${channel.type === 'role_restricted' ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <div>
                            <h3 className="text-white text-lg leading-none">{channel.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">messages and files sent in chat are deleted after 7 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                        <div className="p-4 rounded-full bg-white/5">
                            <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // Check if previous message was from same user within last 5 minutes to group them
                        return <MessageBubble key={msg.id} message={msg} />;
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900/60 backdrop-blur-md border-t border-white/5 shrink-0">
                <form
                    onSubmit={sendMessage}
                    className="flex items-end gap-2 bg-[#0a0a0a] p-2 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] focus-within:bg-white/[0.02] transition-all duration-300"
                >

                    {/* Attachment Button */}
                    {canUpload && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className={`p-3 rounded-xl transition-all shrink-0 ${isUploading ? 'bg-white/5 text-gray-500 animate-pulse' : 'text-gray-400 hover:text-indigo-400 hover:bg-white/5'
                                    }`}
                                title="Attach file"
                            >
                                <Icons.Paperclip className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <textarea
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            // Auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(e);
                            }
                        }}
                        placeholder={`Message #${channel.name}...`}
                        className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 resize-none max-h-32 py-3 px-2 custom-scrollbar text-sm leading-relaxed"
                        rows="1"
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-xl transition-all duration-300 shrink-0 ${newMessage.trim()
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <Icons.Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
