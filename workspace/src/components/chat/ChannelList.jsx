import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { useChatNotifications } from '../../context/ChatNotificationContext';
import { usePresence } from '../../context/PresenceContext';
import DeleteChannelModal from './DeleteChannelModal';

export function ChannelList({ activeChannel, onSelectChannel, onOpenCreateModal, initialChannelSlug }) {
    const { user, isHost, isEliteRole } = useAuth();
    const { showToast } = useToast();
    const { unreadCounts, clearUnread } = useChatNotifications();
    const { onlineUsers } = usePresence();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [channelToDelete, setChannelToDelete] = useState(null); // Helper state for modal

    const canCreateChannels = isHost || isEliteRole;

    useEffect(() => {
        fetchChannels();

        // Subscribe to new channels
        const subscription = supabase
            .channel('public:channels')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, () => {
                fetchChannels();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // Effect to handle initial selection
    // Effect to handle initial selection
    // Effect to handle initial selection or deep linking
    useEffect(() => {
        if (!loading && channels.length > 0 && initialChannelSlug) {
            const target = channels.find(c => c.slug === initialChannelSlug);

            // Critical Fix: Only select if we are NOT already on this channel AND we haven't just left it.
            // We rely on the fact that if activeChannel is null, we might need to select it.
            // But we must respect the user's "Back" action.

            // If activeChannel is null, BUT initialChannelSlug is set, it might be a race condition from "Back" navigation.
            // However, since handleChannelSelect is now stable via useCallback, this effect won't fire spuriously.
            // We adding a check: if the prop 'initialChannelSlug' is what we just navigated AWAY from, we might want to ignore it?
            // Actually, if we navigated back, the URL should eventually clear. 
            // The race condition was the re-render BEFORE the URL cleared.

            if (target && target.id !== activeChannel?.id) {
                onSelectChannel(target);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, channels, initialChannelSlug, onSelectChannel]);

    async function fetchChannels() {
        try {
            const { data, error } = await supabase
                .from('channels')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setChannels(data || []);
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setLoading(false);
        }
    }

    function confirmDelete(channel, e) {
        e.stopPropagation();
        if (channel.slug === 'general') {
            showToast("Cannot delete General chat.", "error");
            return;
        }
        setChannelToDelete(channel);
    }

    async function handleConfirmDelete() {
        if (!channelToDelete) return;

        try {
            // 1. Manually delete all messages first (Robustness fix)
            // This ensures no zombie messages remain if the DB trigger fails
            const { error: msgError } = await supabase
                .from('messages')
                .delete()
                .eq('channel', channelToDelete.slug);

            if (msgError) console.error('Error cleaning messages:', msgError);
            // Continue even if message delete "fails" (maybe empty), main goal is removing channel.

            // 2. Delete the channel
            const { error } = await supabase
                .from('channels')
                .delete()
                .eq('id', channelToDelete.id);

            if (error) throw error;

            setChannels(prev => prev.filter(c => c.id !== channelToDelete.id));
            if (activeChannel?.id === channelToDelete.id) {
                const general = channels.find(c => c.slug === 'general');
                if (general) onSelectChannel(general);
            }
        } catch (error) {
            console.error('Error deleting channel:', error);
            showToast('Failed to delete channel', 'error');
        } finally {
            setChannelToDelete(null);
        }
    }

    const filteredChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white/40 backdrop-blur-xl border-r border-gray-200">
            {/* Header */}
            <div className="p-4 bg-gray-900/40 border-b border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">Chats</h2>
                    {canCreateChannels && (
                        <button
                            onClick={onOpenCreateModal}
                            className="p-2 rounded-full hover:bg-[#1a2b4b]/5 text-[#c0672a] transition-colors"
                            title="Crea Nuovo Canale"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cerca chat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-[#1a2b4b] placeholder-gray-400 focus:ring-1 focus:ring-[#1a2b4b] focus:border-transparent transition-all"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                {loading ? (
                    <div className="text-center text-gray-500 py-4 text-sm">Loading channels...</div>
                ) : filteredChannels.length === 0 ? (
                    <div className="text-center text-gray-500 py-4 text-sm italic">No channels found</div>
                ) : (
                    filteredChannels.map(channel => (
                        <div key={channel.id} className="relative group">
                            <button
                                onClick={() => {
                                    onSelectChannel(channel);
                                    clearUnread(channel.slug);
                                }}
                                className={`w-full text-left pl-4 pr-12 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeChannel?.id === channel.id
                                    ? 'bg-[#1a2b4b] text-white shadow-lg border-transparent'
                                    : 'text-gray-600 hover:bg-white/60 hover:text-[#1a2b4b] border border-transparent'
                                    } `}
                            >
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${channel.type === 'role_restricted' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'
                                        } `}>
                                        <span className="text-lg font-bold">{channel.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="truncate flex-1">
                                        <p className={`font-bold text-sm truncate ${activeChannel?.id === channel.id ? 'text-white' : 'text-[#1a2b4b]'}`}>{channel.name}</p>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-xs truncate mt-0.5 ${activeChannel?.id === channel.id ? 'text-white/70' : 'text-gray-500'}`}>
                                                {channel.type === 'role_restricted' ? 'Accesso Riservato' : 'Canale Pubblico'}
                                            </p>
                                            {unreadCounts[channel.slug] > 0 && (
                                                <span className="bg-[#c0672a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg min-w-[1.25rem] text-center animate-pulse">
                                                    {unreadCounts[channel.slug] > 99 ? '99+' : unreadCounts[channel.slug]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Hover Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${activeChannel?.id === channel.id ? 'hidden' : 'block'
                                    } `} />
                            </button>

                            {/* ALWAYS VISIBLE DELETE BUTTON (Right Side) */}
                            {canCreateChannels && channel.slug !== 'general' && (
                                <button
                                    onClick={(e) => confirmDelete(channel, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all z-20"
                                    title="Delete Channel"
                                    style={{ touchAction: 'manipulation', minWidth: '40px', minHeight: '40px' }} // Touch target
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <DeleteChannelModal
                isOpen={!!channelToDelete}
                onClose={() => setChannelToDelete(null)}
                onConfirm={handleConfirmDelete}
                channelName={channelToDelete?.name}
            />

            {/* Online Users Section */}
            <div className="px-4 py-4 bg-white/20 border-t border-gray-100 shrink-0 overflow-y-auto max-h-48 custom-scrollbar">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Online - {Object.keys(onlineUsers).length}</h3>
                <div className="space-y-2">
                    {Object.values(onlineUsers).length === 0 ? (
                        <p className="text-xs text-gray-600 italic">No one else online</p>
                    ) : (
                        Object.values(onlineUsers).map(u => (
                            <div key={u.user_id} className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                <span className={`text-sm truncate ${u.user_id === user?.id ? 'text-[#c0672a] font-bold' : 'text-gray-600 font-medium'} `}>
                                    {u.display_name || u.email?.split('@')[0]}
                                    {u.user_id === user?.id && " (Tu)"}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 bg-white/40 border-t border-gray-100 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white font-black text-xs shadow-md">
                        {user?.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                        <p className="text-xs text-green-400 flex items-center mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
