import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChannelList } from './ChannelList';
import { ChatWindow } from './ChatWindow';
import { CreateChannelModal } from './CreateChannelModal';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../context/ChatNotificationContext';

export function ChatLayout() {
    const { isHost } = useAuth();
    const { clearUnread, setCurrentChannelId } = useChatNotifications();
    const [activeChannel, setActiveChannel] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // URL param handling
    const location = useLocation();
    const navigate = useNavigate();

    // Mobile View State
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showMobileList, setShowMobileList] = useState(!activeChannel);
    const [refreshKey, setRefreshKey] = useState(0); // Force list refresh

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to handle mobile navigation
    useEffect(() => {
        if (isMobileView) {
            setShowMobileList(!activeChannel);
        } else {
            setShowMobileList(true);
        }
    }, [isMobileView, activeChannel]);

    // Sync active channel state and Cleanup on unmount
    useEffect(() => {
        if (activeChannel?.slug) {
            setCurrentChannelId(activeChannel.slug);
            // Update URL without full reload if needed, though Link logic handles this mostly
            const url = new URL(window.location);
            if (url.searchParams.get('channel') !== activeChannel.slug) {
                url.searchParams.set('channel', activeChannel.slug);
                window.history.replaceState({}, '', url);
            }
        }

        // CLEANUP: Reset current channel when leaving the ChatLayout (navigating elsewhere)
        return () => {
            setCurrentChannelId(null);
        };
    }, [activeChannel, setCurrentChannelId]);

    // Initialize from URL
    // We can't set activeChannel directly here because we need the full channel object
    // which ChannelList fetches. We'll pass the initial slug to ChannelList or 
    // allow ChannelList to inform us or expose a "selectBySlug" method.
    // Simpler: Let ChannelList take an "initialSlug" prop and call "onSelectChannel" itself.

    // Better: We hoist channel fetching or rely on ChannelList to handle the selection via internal side-effect.
    // Let's pass `initialChannelSlug` to ChannelList.
    const initialChannelSlug = new URLSearchParams(location.search).get('channel');

    useEffect(() => {
        // Clear unread when entering a channel
        if (activeChannel) {
            clearUnread(activeChannel.slug);
        }
    }, [activeChannel, clearUnread]);

    const handleChannelSelect = useCallback((channel) => {
        setActiveChannel(channel);
        if (isMobileView) {
            setShowMobileList(false);
        }
    }, [isMobileView]);

    const handleBackToList = useCallback(() => {
        setActiveChannel(null);
        setShowMobileList(true);
        navigate('/chat'); // Clear param
    }, [navigate]);

    return (

        <div className="h-full w-full bg-[#f8fafc] flex overflow-hidden border-t border-gray-200 relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.01] pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c0672a]/5 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#1a2b4b]/5 blur-[120px] pointer-events-none animate-pulse" style={{animationDelay: '2s'}} />

            {/* Sidebar (Channel List) */}
            {/* Sidebar (Channel List) */}
            {/* Sidebar (Channel List) */}
            <AnimatePresence mode="wait">
                {(!isMobileView || showMobileList) && (
                    <motion.div
                        initial={isMobileView ? { x: -300, opacity: 0 } : false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={isMobileView ? { x: -300, opacity: 0 } : undefined}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                         className={`${isMobileView ? 'absolute inset-y-0 left-0 w-full z-50' : 'w-80 border-r border-gray-200'} h-full bg-white/80 backdrop-blur-xl z-20 pt-24`}
                    >
                        <ChannelList
                            key={refreshKey}
                            activeChannel={activeChannel}
                            onSelectChannel={handleChannelSelect}
                            onOpenCreateModal={() => setShowCreateModal(true)}
                            initialChannelSlug={initialChannelSlug}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
             <div className={`${isMobileView
                ? (!showMobileList ? 'w-full fixed inset-0 z-40 bg-[#f8fafc]' : 'hidden')
                : 'flex-1 relative'
                } h-full flex flex-col pt-24 bg-[#f8fafc]`}>
                {activeChannel ? (
                    <ChatWindow
                        channel={activeChannel}
                        onBack={isMobileView ? handleBackToList : undefined}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-transparent">
                         <div className="w-24 h-24 mb-6 rounded-3xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                            <svg className="w-10 h-10 text-[#c0672a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b4b] mb-2">Benvenuto nel Team Chat</h3>
                        <p className="max-w-md text-gray-700">
                            Seleziona un canale dalla barra laterale per iniziare a collaborare con il tuo team.
                        </p>
                    </div>
                )}
            </div>

            {/* Create Channel Modal */}
            {showCreateModal && isHost && (
                <CreateChannelModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={(channel) => {
                        setShowCreateModal(false);
                        setRefreshKey(prev => prev + 1); // Refresh list
                        handleChannelSelect(channel);
                    }}
                />
            )}
        </div>
    );
}
