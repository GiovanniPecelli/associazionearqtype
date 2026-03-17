import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { MessageContent } from './MessageContent';

export function MessageBubble({ message }) {
    const { user } = useAuth();
    const isMe = message.user_id === user?.id;

    // Format time (e.g., "14:30")
    const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderInitial = (message.profiles?.display_name || message.profiles?.email)?.[0]?.toUpperCase() || 'U';

    return (
        <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar for incoming messages */}
            {!isMe && (
                <Link to={`/users/${message.user_id}`} className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[#1a2b4b]/10 flex items-center justify-center text-[#1a2b4b] font-black text-xs hover:ring-2 hover:ring-[#c0672a] transition-all">
                        {senderInitial}
                    </div>
                </Link>
            )}

            {/* Message Bubble */}
            <div className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                ? 'bg-[#1a2b4b] text-white rounded-br-none shadow-md'
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                {!isMe && (
                    <Link to={`/users/${message.user_id}`}>
                        <div className="text-[10px] uppercase tracking-widest font-black text-[#c0672a] mb-2 hover:underline">
                           {message.profiles?.display_name || message.profiles?.email?.split('@')[0] || 'User'}
                        </div>
                    </Link>
                )}
                {/* Attachment Display */}
                {message.attachment_url && (
                    <div className="mb-2">
                        {message.attachment_type?.startsWith('image/') ? (
                            <a href={message.attachment_url} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={message.attachment_url}
                                    alt="attachment"
                                    className="max-w-full rounded-xl border border-gray-100 hover:opacity-90 transition-opacity"
                                    style={{ maxHeight: '200px' }}
                                />
                           </a>
                        ) : (
                             <a
                                href={message.attachment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center space-x-2 p-3 rounded-xl transition-colors border ${isMe ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                            >
                               <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-sm underline truncate max-w-[150px]">{message.attachment_name || 'Attachment'}</span>
                            </a>
                        )}
                    </div>
                )}
                <MessageContent text={message.content} />
                <div className={`text-[9px] mt-2 font-bold uppercase tracking-wider text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                    {time}
                </div>
           </div>
        </div>
    );
}
