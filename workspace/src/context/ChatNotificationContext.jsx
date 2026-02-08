import { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

const ChatNotificationContext = createContext(null);

// 1. Loud "Pop" for Background / Important
// Valid short "Pop" sound (Base64 encoded MP3/WAV)
const NOTIFICATION_SOUND = 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7cQBMNJjoDbET4QOgle435ozTPgicEXtO7/97anxB+MALATUqF6H7kbn/84gqD8IVQoQWf/7kQQAeAAi5J1rAAIKKSdawaCCAA3Lh1zAAIaS4dcwACCA//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7cQBMNJjoDbET4QOgle435ozTPgicEXtO7/97anxB+MALATUqF6H7kbn/84gqD8IVQoQWf/7kQQAeAAi5J1rAAIKKSdawaCCAA3Lh1zAAIaS4dcwACCA';
// Softer "Ping"
const IN_APP_SOUND = 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7cQBMNJjoDbET4QOgle435ozTPgicEXtO7/97anxB+MALATUqF6H7kbn/84gqD8IVQoQWf/7kQQAeAAi5J1rAAIKKSdawaCCAA3Lh1zAAIaS4dcwACCA';

export function ChatNotificationProvider({ children }) {
    const { user } = useAuth();
    const [unreadCounts, setUnreadCounts] = useState({});
    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);
    const [currentChannelId, setCurrentChannelId] = useState(null); // Track active channel

    // Audio Refs
    const bgAudioRef = useRef(null);
    const fgAudioRef = useRef(null);

    // Initialize Audio
    useEffect(() => {
        bgAudioRef.current = new Audio(NOTIFICATION_SOUND);
        bgAudioRef.current.volume = 0.7;

        fgAudioRef.current = new Audio(IN_APP_SOUND);
        fgAudioRef.current.volume = 0.3;
    }, []);

    // 1. Calculate Total
    const totalUnread = useMemo(() =>
        Object.values(unreadCounts).reduce((a, b) => a + b, 0),
        [unreadCounts]
    );

    // 2. Sync Badge
    useEffect(() => {
        if ('setAppBadge' in navigator) {
            if (totalUnread > 0) {
                navigator.setAppBadge(totalUnread).catch(() => { });
            } else {
                navigator.clearAppBadge().catch(() => { });
            }
        }
    }, [totalUnread]);



    // Unlock Audio Context on first interaction (Touch/Click/Pointer)
    useEffect(() => {
        const unlockAudio = () => {
            const unlockTrack = (audioRef) => {
                if (audioRef.current) {
                    // Play a silent buffer or just play/pause quickly
                    audioRef.current.play().then(() => {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }).catch((e) => console.debug("Audio unlock blocked", e));
                }
            };

            unlockTrack(bgAudioRef);
            unlockTrack(fgAudioRef);

            // Remove listeners once assumed unlocked
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('pointerdown', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        const events = ['click', 'touchstart', 'pointerdown', 'keydown'];
        events.forEach(e => document.addEventListener(e, unlockAudio));

        return () => {
            events.forEach(e => document.removeEventListener(e, unlockAudio));
        };
    }, []);

    const playSound = useCallback((type) => {
        const audio = type === 'background' ? bgAudioRef.current : fgAudioRef.current;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn("Audio blocked:", e));

            // Vibration for mobile (WhatsApp style: short double tap for foreground, long for background)
            if (navigator.vibrate) {
                navigator.vibrate(type === 'background' ? [200, 100, 200] : [100]);
            }
        }
    }, []);

    const showToast = useCallback((message, channelSlug, type = 'background') => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

        const id = Date.now();
        setToast({ message, id, channelSlug });
        playSound(type);

        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 4000);
    }, [playSound]);

    const clearUnread = useCallback((channelId) => {
        if (!channelId) return;
        setUnreadCounts(prev => {
            if (!prev[channelId]) return prev;
            const newCounts = { ...prev };
            delete newCounts[channelId];
            return newCounts;
        });
    }, []);

    // 3. Global Subscription
    useEffect(() => {
        if (!user) return;

        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const subscription = supabase
            .channel('global_messages_listener')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, (payload) => {
                const newMessage = payload.new;
                if (newMessage.user_id === user.id) return; // Ignore own

                const isHidden = document.hidden;

                // Check if we are "in" the channel
                const isLookingAtChannel = !isHidden && currentChannelId === newMessage.channel;

                if (isLookingAtChannel) {
                    // Already looking at it, do nothing (or maybe subtle tick sound?)
                    return;
                }

                // Update Unread
                setUnreadCounts(prev => ({
                    ...prev,
                    [newMessage.channel]: (prev[newMessage.channel] || 0) + 1
                }));

                // Notifications
                if (isHidden) {
                    // System Notification
                    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                        new Notification(`New message in #${newMessage.channel}`, {
                            body: newMessage.content ? newMessage.content.substring(0, 50) : 'Sent an attachment',
                            icon: '/pwa-192x192.png',
                            badge: '/pwa-192x192.png',
                            vibrate: [200, 100, 200]
                        });
                    }
                    // In-App Toast + Sound (Background means louder usually)
                    showToast(`New message in #${newMessage.channel}`, newMessage.channel, 'background');
                } else {
                    // App is open, but we are NOT in the channel
                    // Foreground sound + toast
                    showToast(`New message in #${newMessage.channel}`, newMessage.channel, 'foreground');
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, playSound, showToast, currentChannelId]); // Depends on currentChannelId

    // 4. Hybrid Push Subscription (Web + Native)
    const subscribeToPush = useCallback(async () => {
        if (!user) return;

        // --- NATIVE (Android/iOS) ---
        if (Capacitor.isNativePlatform()) {
            try {
                // 1. Request Permission
                const permStatus = await PushNotifications.requestPermissions();
                if (permStatus.receive === 'granted') {
                    // 2. Register with Apple / Google
                    await PushNotifications.register();
                } else {
                    console.warn('Push notification permission denied');
                }
            } catch (e) {
                console.error('Native Push Error:', e);
            }

            // Note: Listeners should be added once at app start, but we can manage them here or in a separate effect.
            // For simplicity, we assume listeners are global or handled by the plugin's idempotent nature.

            // On successful registration, we get the token
            PushNotifications.addListener('registration', async (token) => {
                console.log('Push Registration Token:', token.value);
                // Save to Supabase
                const { error } = await supabase
                    .from('push_subscriptions')
                    .upsert({
                        user_id: user.id,
                        endpoint: token.value, // For Native, endpoint is the token
                        p256dh: 'active',      // Not used for FCM/APNs but valid for schema
                        auth: 'native',        // Marker for Native
                        platform: Capacitor.getPlatform() // Optional: add column if needed, or store in auth/p256dh
                    }, { onConflict: 'user_id, endpoint' });

                if (error) console.error('Error saving native token:', error);
            });

            PushNotifications.addListener('registrationError', (error) => {
                console.error('Push Registration Error:', error);
            });

            // Handle received notification
            PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push Received:', notification);
                showToast(notification.title || 'New Message', notification.data.channel || 'general', 'background');
            });

            // Handle action (tap)
            PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                console.log('Push Action:', notification);
                const data = notification.notification.data;
                if (data.url) {
                    window.location.href = data.url; // Use internal router if possible
                }
            });

            return;
        }

        // --- WEB (Service Worker) ---
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        try {
            // 1. Check/Request Permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') return;

            // 2. Get Service Worker Registration
            const registration = await navigator.serviceWorker.ready;

            // 3. Subscribe (Use valid VAPID Public Key)
            const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

            if (!VAPID_PUBLIC_KEY) {
                console.warn('VITE_VAPID_PUBLIC_KEY not set. Skipping push subscription.');
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            // 4. Send to Supabase
            if (subscription) {
                const subJson = subscription.toJSON();
                const { error } = await supabase
                    .from('push_subscriptions')
                    .upsert({
                        user_id: user.id,
                        endpoint: subJson.endpoint,
                        p256dh: subJson.keys.p256dh,
                        auth: subJson.keys.auth
                    }, { onConflict: 'user_id, endpoint' });

                if (error) console.error('Error saving push subscription:', error);
            }

        } catch (error) {
            console.error('Push Subscription Error:', error);
        }
    }, [user, showToast]);

    // Initial Push Sub
    useEffect(() => {
        if (user) {
            subscribeToPush();
        }
    }, [user, subscribeToPush]);

    // Helper function for VAPID key
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    return (
        <ChatNotificationContext.Provider value={{ unreadCounts, totalUnread, clearUnread, setCurrentChannelId, subscribeToPush }}>
            {children}
            {/* Enhanced Toast UI */}
            {toast && (
                <div className="fixed top-20 right-4 z-[100] animate-slide-in-right cursor-pointer" onClick={() => {
                    window.location.href = `/chat?channel=${toast.channelSlug}`;
                }}>
                    <div className="bg-gray-800/95 backdrop-blur-xl border border-indigo-500/40 text-white pl-4 pr-12 py-4 rounded-xl shadow-2xl flex items-center gap-4 relative overflow-hidden ring-1 ring-white/10 hover:ring-indigo-500/50 transition-all">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-xl">💬</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-indigo-300 uppercase tracking-wider text-[10px]">New Message</h4>
                            <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setToast(null); }}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </ChatNotificationContext.Provider>
    );
}

export function useChatNotifications() {
    const context = useContext(ChatNotificationContext);
    if (!context) {
        throw new Error('useChatNotifications must be used within a ChatNotificationProvider');
    }
    return context;
}

